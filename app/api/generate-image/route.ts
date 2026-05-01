import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Gemini 2.0 Flash image generation — works with Google AI Studio keys
const MODEL = "gemini-2.0-flash-preview-image-generation";

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt") ?? "";

  if (!prompt.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey.startsWith("SUBSTITUA")) {
    return NextResponse.json({ error: "GOOGLE_AI_API_KEY não configurada" }, { status: 500 });
  }

  const enrichedPrompt = `${prompt.trim()}, high quality, modern, clean, professional social media visual, no text, no words`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: enrichedPrompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    });

    const text = await res.text();
    console.log("[generate-image] response:", res.status, text.slice(0, 400));

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google AI error (${res.status}): ${text.slice(0, 300)}` },
        { status: res.status }
      );
    }

    const json = JSON.parse(text);

    // Image is in candidates[0].content.parts[].inlineData
    const parts = json?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData);

    if (!imagePart?.inlineData) {
      return NextResponse.json(
        { error: `Sem imagem na resposta: ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const { data: b64, mimeType } = imagePart.inlineData;
    const imageUrl = `data:${mimeType};base64,${b64}`;

    return NextResponse.json({ imageUrl });

  } catch (err) {
    console.error("[generate-image] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
