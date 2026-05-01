import { NextRequest, NextResponse } from "next/server";

// Imagen 3 is synchronous — no polling needed, response comes back in seconds
export const maxDuration = 60;

const MODEL = "imagen-3.0-generate-002";

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt") ?? "";
  const ratio  = req.nextUrl.searchParams.get("ratio")  ?? "1:1";

  if (!prompt.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey.startsWith("SUBSTITUA")) {
    return NextResponse.json({ error: "GOOGLE_AI_API_KEY não configurada" }, { status: 500 });
  }

  // Map carousel dimensions to Imagen 3 aspect ratios
  // Valid values: "1:1" | "3:4" | "4:3" | "9:16" | "16:9"
  const aspectRatio = ratio === "4:5" ? "3:4" : "1:1";

  const enrichedPrompt = `${prompt.trim()}, high quality, modern, clean design, professional, social media visual`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: enrichedPrompt }],
        parameters: {
          sampleCount:  1,
          aspectRatio,
          personGeneration: "dont_allow",
        },
      }),
    });

    const text = await res.text();
    console.log("[generate-image] Imagen response:", res.status, text.slice(0, 300));

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Imagen error (${res.status}): ${text.slice(0, 300)}` },
        { status: res.status }
      );
    }

    const json = JSON.parse(text);
    const prediction = json?.predictions?.[0];
    const b64: string | undefined = prediction?.bytesBase64Encoded;
    const mime: string = prediction?.mimeType ?? "image/jpeg";

    if (!b64) {
      return NextResponse.json(
        { error: `Sem imagem na resposta: ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    // Return as a data URL — works in <img> tags and canvas drawImage()
    const imageUrl = `data:${mime};base64,${b64}`;
    return NextResponse.json({ imageUrl });

  } catch (err) {
    console.error("[generate-image] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
