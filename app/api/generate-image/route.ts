import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt") ?? "";
  const ratio  = req.nextUrl.searchParams.get("ratio")  ?? "1:1"; // "1:1" or "4:5"

  if (!prompt.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const apiKey = process.env.NANOBANANA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NANOBANANA_API_KEY not set" }, { status: 500 });
  }

  // Enrich the prompt for social media carousel use
  const enrichedPrompt = `${prompt.trim()}, high quality, modern, professional, social media post visual`;

  // Map our dimension ratio to Nano Banana aspect_ratio values
  const aspectRatio = ratio === "4:5" ? "4:5" : "1:1";

  try {
    const res = await fetch("https://nanobanana.expert/api/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt:        enrichedPrompt,
        model:         "nb2",
        quality:       "medium",
        aspect_ratio:  aspectRatio,
        resolution:    "1k",
        output_format: "webp",
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Nano Banana error:", res.status, body);
      return NextResponse.json({ error: `API error ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    const imageUrl: string | undefined = data.image_url;

    if (!imageUrl) {
      return NextResponse.json({ error: "No image_url in response" }, { status: 502 });
    }

    return NextResponse.json({ imageUrl, bananas_spent: data.bananas_spent ?? null });
  } catch (err) {
    console.error("generate-image error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
