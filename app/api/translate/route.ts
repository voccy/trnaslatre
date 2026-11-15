import { NextResponse } from 'next/server';
import { callGemini, parseJsonObject } from '../../../lib/gemini';
import { enhancedPrompt } from '../../../lib/prompt';
import { getDemoSample, SourceLanguage, TranslationResult } from '../../../lib/examples';

export const runtime = 'nodejs';
const languages = new Set(['auto','id','ms']);

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  const context = typeof body?.context === 'string' ? body.context.trim().slice(0,500) : '';
  const source: SourceLanguage = languages.has(body?.source) ? body.source : 'auto';
  if (!text || text.length > 2000) return NextResponse.json({error:'Enter 1–2,000 characters.'},{status:400});
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
   const matching = getDemoSample(text,context,source);
   if (matching) return NextResponse.json({mode:'curated-demo',result:matching.result});
   return NextResponse.json({error:'Connect a Gemini API key in .env.local to translate custom text. Or try one of the curated examples.'},{status:503});
  }
  const raw = await callGemini(enhancedPrompt(text,context,source));
  const obj = parseJsonObject(raw) as Partial<TranslationResult>;
  if (!obj || typeof obj.translation !== 'string' || typeof obj.sourceLanguage !== 'string') throw new Error('INVALID_RESULT');
  const result:TranslationResult = {
   sourceLanguage:['Indonesian','Malaysian Malay','Ambiguous / shared'].includes(obj.sourceLanguage) ? obj.sourceLanguage : 'Ambiguous / shared',
   detectedConfidence:['high','medium','low'].includes(obj.detectedConfidence||'') ? obj.detectedConfidence! : 'low',
   translation:obj.translation,
   alternativeTranslation:String(obj.alternativeTranslation||''),
   register:String(obj.register||'Unknown'), culturalNote:String(obj.culturalNote||''),
   ambiguity:String(obj.ambiguity||''),wordNotes:Array.isArray(obj.wordNotes)?obj.wordNotes.filter(v=>v&&typeof v.word==='string'&&typeof v.meaning==='string').slice(0,4):[],
   safetyNote:String(obj.safetyNote||'')
  };
  return NextResponse.json({mode:'live-ai',result});
 } catch (error) {
  console.error('Translation error',error instanceof Error ? error.message:'unknown');
  const code=error instanceof Error?error.message:'GEMINI_ERROR';
  return NextResponse.json({error:code==='RATE_LIMIT'?'Gemini rate limit reached. Try again shortly.': 'Translation unavailable. Check API key, model, and service status.'},{status:502});
 }
}
