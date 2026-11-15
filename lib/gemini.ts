const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_api_key_here') throw new Error('API_NOT_CONFIGURED');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
    method: 'POST', headers: {'Content-Type': 'application/json','x-goog-api-key': key},
    body: JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:0.15,maxOutputTokens:1800}}),
    cache:'no-store', signal:AbortSignal.timeout(25000)
  });
  if (!response.ok) {
    const reason = await response.text();
    console.error('Gemini request failed:',response.status,reason.slice(0,300));
    throw new Error(response.status === 429 ? 'RATE_LIMIT' : 'GEMINI_ERROR');
  }
  const json = await response.json();
  const result = json?.candidates?.[0]?.content?.parts?.map((x:{text?:string})=>x.text||'').join('');
  if (!result) throw new Error('EMPTY_RESPONSE');
  return result;
}

export function parseJsonObject(text: string): unknown {
 const cleaned = text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
 try {return JSON.parse(cleaned);} catch {
   const start = cleaned.indexOf('{'); const end = cleaned.lastIndexOf('}');
   if (start < 0 || end < start) throw new Error('INVALID_JSON');
   return JSON.parse(cleaned.slice(start,end+1));
 }
}
