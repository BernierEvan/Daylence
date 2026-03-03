const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type RequestBody = {
  text?: string;
  texts?: string[];
  targetLang?: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const targetLang = (body.targetLang ?? 'FR').toUpperCase();

    const inputTexts = body.texts ?? (body.text ? [body.text] : []);
    const texts = inputTexts.filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

    if (!texts.length) {
      return new Response(JSON.stringify({ error: 'Aucun texte a traduire' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const deeplApiKey = Deno.env.get('DEEPL_API_KEY');
    if (!deeplApiKey) {
      return new Response(JSON.stringify({ error: 'DEEPL_API_KEY manquante' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const deeplBody = new URLSearchParams();
    deeplBody.append('target_lang', targetLang);
    for (const text of texts) {
      deeplBody.append('text', text);
    }

    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${deeplApiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: deeplBody.toString(),
    });

    if (!deeplResponse.ok) {
      const deeplError = await deeplResponse.text();
      return new Response(JSON.stringify({ error: `DeepL error: ${deeplError}` }), {
        status: deeplResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const deeplData = await deeplResponse.json();
    const translations = Array.isArray(deeplData.translations)
      ? deeplData.translations.map((item: { text?: string }) => item.text ?? '')
      : [];

    return new Response(JSON.stringify({ translations }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
