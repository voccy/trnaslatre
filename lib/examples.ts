export type SourceLanguage = 'auto' | 'id' | 'ms';
export type TranslationResult = {
  sourceLanguage: 'Indonesian' | 'Malaysian Malay' | 'Ambiguous / shared';
  detectedConfidence: 'high' | 'medium' | 'low';
  translation: string;
  alternativeTranslation: string;
  register: string;
  culturalNote: string;
  ambiguity: string;
  wordNotes: { word: string; meaning: string }[];
  safetyNote: string;
};
export type Sample = { id: string; title: string; text: string; context: string; source: SourceLanguage; result: TranslationResult };

// HAND-AUTHORED UI EXAMPLES, NOT EVALUATION RESULTS OR A VALIDATED DATASET.
export const samples: Sample[] = [
  { id:'percuma-ms', title:'The false friend', text:'Barang ini percuma.', context:'A sign in a shop in Kuala Lumpur', source:'ms', result:{sourceLanguage:'Malaysian Malay',detectedConfidence:'high',translation:'This item is free of charge.',alternativeTranslation:'In Indonesian, this could be understood as “This item is useless / it’s in vain.”',register:'Neutral, everyday',culturalNote:'“Percuma” often means free of charge in Malaysian Malay. In Indonesian, it commonly means futile or pointless.',ambiguity:'Without location or speaker context, “percuma” is a cross-language false friend. Do not force one meaning.',wordNotes:[{word:'percuma', meaning:'Malay: free of charge · Indonesian: futile / pointless'}],safetyNote:'This example is curated for demonstration; have fluent speakers validate it before using it as ground truth.'}},
  { id:'kereta-ms',title:'Same word, new meaning',text:'Kereta saya rosak.',context:'A Malaysian speaker talking about their vehicle',source:'ms',result:{sourceLanguage:'Malaysian Malay',detectedConfidence:'high',translation:'My car is broken.',alternativeTranslation:'In Indonesian, “kereta” usually refers to a train.',register:'Informal, conversational',culturalNote:'Malaysian Malay “kereta” commonly refers to a car; Indonesian “kereta” commonly refers to a train.',ambiguity:'“Rosak” is common Malay usage for “broken,” helping identify the language variety.',wordNotes:[{word:'kereta',meaning:'Malay: car · Indonesian: train'},{word:'rosak',meaning:'Malay: broken / damaged'}],safetyNote:'Demo interpretation. Regional variations exist.'}},
  { id:'bisa-id',title:'Meaning from context',text:'Saya bisa datang besok.',context:'An Indonesian person making plans with a friend',source:'id',result:{sourceLanguage:'Indonesian',detectedConfidence:'high',translation:'I can come tomorrow.',alternativeTranslation:'“Bisa” also means venom in Indonesian in other contexts, but not in this sentence.',register:'Neutral, conversational',culturalNote:'In this sentence, “bisa” is the Indonesian modal “can / be able to.” Context resolves other dictionary meanings.',ambiguity:'Low ambiguity once the sentence context is considered.',wordNotes:[{word:'bisa',meaning:'Here: can / be able to'},{word:'besok',meaning:'tomorrow'}],safetyNote:'Demo interpretation.'}},
  { id:'tandas-ms',title:'Local phrasing',text:'Saya nak pergi tandas.',context:'Casual speech in Malaysia',source:'ms',result:{sourceLanguage:'Malaysian Malay',detectedConfidence:'high',translation:'I want to go to the toilet.',alternativeTranslation:'A more typical everyday Indonesian phrasing would be “Saya mau ke toilet.”',register:'Informal, everyday',culturalNote:'“Nak” for “want” and “tandas” for “toilet” are common in colloquial Malaysian Malay.',ambiguity:'The vocabulary provides strong Malay cues.',wordNotes:[{word:'nak',meaning:'colloquial Malay: want to'},{word:'tandas',meaning:'toilet / restroom'}],safetyNote:'Demo interpretation.'}},
  { id:'boleh-shared',title:'When it is genuinely ambiguous',text:'Boleh saya masuk?',context:'No location or speaker information',source:'auto',result:{sourceLanguage:'Ambiguous / shared',detectedConfidence:'low',translation:'May I come in?',alternativeTranslation:'This sentence is natural in both Indonesian and Malaysian Malay.',register:'Polite / neutral',culturalNote:'Closely related languages can share an entire sentence. Good AI should acknowledge uncertainty instead of inventing certainty.',ambiguity:'Source language cannot be confidently identified from this short text alone.',wordNotes:[{word:'boleh',meaning:'can / may in both languages'}],safetyNote:'Identifying the language may require regional or conversational context.'}},
];

export function getDemoSample(text: string, context: string, source: SourceLanguage): Sample | undefined {
  const t = text.trim().toLowerCase().replace(/[.!?]+$/,'');
  return samples.find(s => s.text.toLowerCase().replace(/[.!?]+$/,'') === t && s.context === context && s.source === source);
}
