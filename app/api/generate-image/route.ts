import { NextRequest, NextResponse } from "next/server";

// Valid aspect ratios supported by Nano Banana
const ASPECT_RATIO_MAP: Record<string, string> = {
  "1:1": "1:1",
  "4:5": "9:16", // closest portrait fallback
  "9:16": "9:16",
  "16:9": "16:9",
};

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt") ?? "";
  const ratio  = req.nextUrl.searchParams.get("ratio")  ?? "1:1";

  if (!prompt.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const apiKey = process.env.NANOBANANA_API_KEY;
  if (!apiKey || apiKey.startsWith("SUBSTITUA")) {
    return NextResponse.json({ error: "NANOBANANA_API_KEY not configured" }, { status: 500 });
  }

  const enrichedPrompt = `${prompt.trim()}, high quality, modern, professional, social media visual`;
  const aspectRatio    = ASPECT_RATIO_MAP[ratio] ?? "1:1";

  // Try multiple base URLs in case one fails
  const endpoints = [
    "https://nanobanana.expert/api/v1/generate",
    "https://nanobananaapi.ai/api/v1/generate",
  ];

  let lastError = "";

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
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

      const text = await res.text();
      console.log(`[generate-image] ${endpoint} → ${res.status}:`, text.slice(0, 300));

      if (!res.ok) {
        lastError = `${endpoint}: HTTP ${res.status} — ${text.slice(0, 200)}`;
        continue; // try next endpoint
      }

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(text);
      } catch {
        lastError = `${endpoint}: invalid JSON — ${text.slice(0, 200)}`;
        continue;
      }

      // Nano Banana may return image_url or url
      const imageUrl =
        (data.image_url as string) ||
        (data.url      as string) ||
        (data.imageUrl as string);

      if (!imageUrl) {
        lastError = `${endpoint}: no image URL in response — ${text.slice(0, 200)}`;
        continue;
      }

      return NextResponse.json({ imageUrl, bananas_spent: data.bananas_spent ?? null });

    } catch (err) {
      lastError = `${endpoint}: ${String(err)}`;
      console.error("[generate-image] fetch error:", endpoint, err);
    }
  }

  console.error("[generate-image] all endpoints failed:", lastError);
  return NextResponse.json({ error: lastError }, { status: 502 });
}
