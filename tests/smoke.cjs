/** Lightweight deterministic tests; no real Gemini requests and no invented model scores. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function load(relativePath, deps = {}) {
  const source = fs.readFileSync(path.join(root,relativePath),'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  const sandbox = { module, exports:module.exports, process, console, fetch: global.fetch, AbortSignal, require: (name)=> {
    if (name in deps) return deps[name];
    if (name.startsWith('.')) {
      const to = path.posix.normalize(path.posix.join(path.posix.dirname(relativePath), name + '.ts'));
      return load(to, deps);
    }
    throw Error('Unmocked dependency: '+name);
  }};
  vm.runInNewContext(js,sandbox,{filename:relativePath});
  return module.exports;
}
async function run(){
  const {samples,getDemoSample} = load('lib/examples.ts');
  assert.equal(samples.length,5);
  for (const s of samples) {
    assert.equal(getDemoSample(s.text,s.context,s.source).id,s.id);
    assert.equal(getDemoSample(s.text.toUpperCase(),s.context,s.source).id,s.id);
    assert.equal(getDemoSample(s.text,s.context+' altered',s.source),undefined);
    assert.equal(typeof s.result.translation,'string');
  }
  const {enhancedPrompt,baselinePrompt}=load('lib/prompt.ts');
  assert.ok(enhancedPrompt('Barang ini percuma.','Malaysia','ms').includes('User selected Malaysian Malay'));
  assert.ok(enhancedPrompt('Boleh saya masuk?','','auto').includes('do not guess when ambiguous'));
  assert.ok(baselinePrompt('Kereta saya rosak').includes('Kereta saya rosak'));
  const {parseJsonObject}=load('lib/gemini.ts');
  assert.equal(parseJsonObject('```json\n{"translation":"okay"}\n```').translation,'okay');
  assert.equal(parseJsonObject('text {"translation":"okay"} trailing').translation,'okay');
  assert.throws(()=>parseJsonObject('not json'));
  const cases = JSON.parse(fs.readFileSync(path.join(root,'data/evaluation-cases.json'),'utf8'));
  assert.equal(cases.length,12);
  assert.equal(cases.filter(c=>c.language==='id').length,6);
  assert.equal(cases.filter(c=>c.language==='ms').length,6);
  assert.equal(new Set(cases.map(c=>c.id)).size,cases.length);
  const {POST} = load('app/api/translate/route.ts', {'next/server':{NextResponse:{json:(body,opts={})=>({body,status:opts.status||200})}}});
  const oldKey=process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const req=(body)=>({json:async()=>body});
  try {
    const good=await POST(req({text:samples[0].text,context:samples[0].context,source:samples[0].source}));
    assert.equal(good.status,200);
    assert.equal(good.body.mode,'curated-demo');
    assert.equal(good.body.result.translation,samples[0].result.translation);
    const missing=await POST(req({text:'Not one of the exact examples',source:'auto'}));
    assert.equal(missing.status,503);
    const bad=await POST(req({text:'',source:'auto'}));
    assert.equal(bad.status,400);
    const tooLong=await POST(req({text:'x'.repeat(2001),source:'auto'}));
    assert.equal(tooLong.status,400);
  } finally {if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;}
  console.log('PASS: curated examples, prompts, JSON parsing, balanced test dataset, demo API, and request validation.');
  console.log('NOT TESTED: live Gemini requests, website build, Vercel deployment, human-reviewed accuracy.');
}
run().catch(err=>{console.error(err);process.exitCode=1;});
