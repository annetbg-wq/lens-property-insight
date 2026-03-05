import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    const { method, address, latitude, longitude, url, goal, notes, photos } = input;

    const locationDesc = address
      ? `Адрес: ${address}`
      : latitude && longitude
        ? `Координаты: ${latitude}, ${longitude}`
        : url
          ? `URL листинга: ${url}`
          : photos?.length
            ? `Фотоанализ (${photos.length} изображений)`
            : "Неизвестная локация";

    const prompt = `Ты — профессиональный аналитик недвижимости с опытом в оценке инвестиционной привлекательности объектов по всему миру. 

Проведи детальную оценку объекта недвижимости и верни результат СТРОГО в формате JSON без markdown-обертки.

ВХОДНЫЕ ДАННЫЕ:
- Метод ввода: ${method}
- ${locationDesc}
- Цель: ${goal} (rent=аренда, buy=покупка, invest=инвестиция, business=коммерция)
${notes ? `- Заметки: ${notes}` : ""}

ТРЕБОВАНИЯ К ОЦЕНКЕ:
Оцени объект по следующим параметрам на основе локации, типа объекта, рыночных условий:

1. Decision Score (0-100) — общая оценка привлекательности
2. Зона риска: green (70-100), yellow (45-69), red (0-44)
3. SubScores: risk (0-100, ниже=лучше), return (0-100, выше=лучше), stability (0-100, выше=лучше)
4. 4-6 ключевых факторов (reasons) с evidence cards для каждого
5. Red flags — критические риски
6. Next steps — рекомендуемые действия
7. Agent content — резюме для клиента, ответы на возражения, вопросы продавцу

ПАРАМЕТРЫ АНАЛИЗА:
- Кадастровый статус и зонирование
- Транспортная доступность
- Экологическая обстановка (шум, воздух, затопляемость)
- Рыночная динамика (тренды цен, спрос/предложение)
- Арендная доходность
- Инфраструктура (школы, медицина, торговля)
- Юридические риски (обременения, сервитуты)
- Перспективы развития района (5 лет)
- Демография района
- Конкурентное предложение

Верни JSON:
{
  "score": number,
  "zone": "green"|"yellow"|"red",
  "subScores": { "risk": number, "return": number, "stability": number },
  "reasons": [
    {
      "title": "string",
      "description": "string",
      "evidence": [
        { "title": "string", "description": "string", "isExample": false }
      ]
    }
  ],
  "redFlags": [
    { "title": "string", "description": "string", "severity": "low"|"medium"|"high" }
  ],
  "nextSteps": [
    { "title": "string", "description": "string" }
  ],
  "agentContent": {
    "clientSummary": "string",
    "objectionKiller": "string",
    "questionsForSeller": ["string"]
  },
  "confidence": "low"|"medium"|"high",
  "displayName": "string"
}`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Ты эксперт по недвижимости. Отвечай ТОЛЬКО валидным JSON без markdown-обертки." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI Gateway error: ${response.status} ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("Empty AI response");

    // Parse JSON from response, handling potential markdown wrapping
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    const assessment = JSON.parse(jsonStr);

    return new Response(JSON.stringify({ success: true, assessment }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Assessment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
