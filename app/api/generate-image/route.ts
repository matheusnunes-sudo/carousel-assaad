import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Confirmed available image-generation models. Newest/fastest first;
// fall back to legacy if the newest is temporarily unavailable.
const MODEL_CANDIDATES = [
  "gemini-3.1-flash-image-preview",
  "gemini-3-pro-image-preview",
  "gemini-2.5-flash-image",
];

async function tryGenerate(model: string, apiKey: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });

  const text = await res.text();
  return { status: res.status, text, model };
}

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt") ?? "";

  if (!prompt.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey.startsWith("SUBSTITUA")) {
    return NextResponse.json({ error: "GOOGLE_AI_API_KEY não configurada" }, { status: 500 });
  }

  const enrichedPrompt = `Generate an image: ${prompt.trim()}. High quality, modern, clean, professional social media visual, no text or words in the image.`;

  let lastError = "";

  for (const model of MODEL_CANDIDATES) {
    try {
      const { status, text } = await tryGenerate(model, apiKey, enrichedPrompt);
      console.log(`[generate-image] ${model} → ${status}: ${text.slice(0, 200)}`);

      // Skip on "not found" errors and try next model
      if (status === 404) {
        lastError = `${model}: 404 not found`;
        continue;
      }

      if (status !== 200) {
        lastError = `${model} (${status}): ${text.slice(0, 250)}`;
        continue;
      }

      const json = JSON.parse(text);
      const parts = json?.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find(
        (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData
      );

      if (!imagePart?.inlineData) {
        lastError = `${model}: sem inlineData na resposta`;
        continue;
      }

      const { data: b64, mimeType } = imagePart.inlineData;
      const imageUrl = `data:${mimeType};base64,${b64}`;
      return NextResponse.json({ imageUrl, model });

    } catch (err) {
      lastError = `${model}: ${String(err)}`;
      console.error(`[generate-image] ${model} threw:`, err);
    }
  }

  return NextResponse.json(
    { error: `Nenhum modelo funcionou. Último erro: ${lastError}` },
    { status: 502 }
  );
}
