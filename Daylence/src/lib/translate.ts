import { supabase } from '../supabaseClient';

type TranslateResponse = {
  translations?: string[];
  error?: string;
};

export async function translateTextsToFrench(texts: string[]): Promise<string[]> {
  if (!texts.length) return [];

  const { data, error } = await supabase.functions.invoke<TranslateResponse>('translate-text', {
    body: {
      texts,
      targetLang: 'FR',
    },
  });

  if (error) {
    throw new Error(`Erreur Edge Function: ${error.message}`);
  }

  if (!data?.translations) {
    throw new Error(data?.error ?? 'Aucune traduction renvoyee');
  }

  return data.translations;
}
