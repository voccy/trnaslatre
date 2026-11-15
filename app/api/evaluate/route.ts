import { NextResponse } from 'next/server';
import { callGemini } from '../../../lib/gemini';
import { baselinePrompt } from '../../../lib/prompt';
export const runtime = 'nodejs';
export async function POST(req:Request){
 try {
  const body = await req.json(); const text=typeof body?.text==='string'?body.text.trim():'';
  if(!text||text.length>2000) return NextResponse.json({error:'Invalid sentence.'},{status:400});
  if(!process.env.GEMINI_API_KEY||process.env.GEMINI_API_KEY==='your_api_key_here') return NextResponse.json({error:'Configure GEMINI_API_KEY to run a real baseline.'},{status:503});
  const translation=await callGemini(baselinePrompt(text));
  return NextResponse.json({translation:translation.trim(),mode:'live-baseline'});
 }catch{return NextResponse.json({error:'Baseline request failed.'},{status:502});}
}
