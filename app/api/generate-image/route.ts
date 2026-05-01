import { NextRequest, NextResponse } from "next/server";

// Tell Vercel to allow up to 110 seconds for this serverless function
export const maxDuration = 110;

const BASE = "https://api.nanobananaapi.ai";
const GENERATE_URL = `${BASE}/api/v1/nanobanana/generate`;
const STATUS_URL   = `${BASE}/api/v1/nanobanana/record-info`;

// successFlag values returned by the polling endpoint
const FLAG_PENDING  = 0;
const FLAG_DONE     = 1;
const FLAG_FAILED_CREATION = 2;
const FLAG_FAILED_GEN      = 3;

const POLL_INTERVAL_MS = 3000;  // poll every 3s
const POLL_TIMEOUT_MS  = 90000; // give up after 90s

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt") ?? "";

  if (!prompt.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const apiKey = process.env.NANOBANANA_API_KEY;
  if (!apiKey || apiKey.startsWith("SUBSTITUA")) {
    return NextResponse.json({ error: "NANOBANANA_API_KEY não configurada" }, { status: 500 });
  }

  const enrichedPrompt = `${prompt.trim()}, high quality, modern, professional, social media visual`;

  // ── Step 1: Submit generation job ──────────────────────────────────────────
  let taskId: string;
  try {
    const res = await fetch(GENERATE_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt:     enrichedPrompt,
        type:       "TEXTTOIAMGE",   // NB API typo — must be exactly this
        numImages:  1,
        callBackUrl: "https://placeholder.invalid/noop", // required field, not used
      }),
    });

    const text = await res.text();
    console.log("[generate-image] submit:", res.status, text.slice(0, 400));

    if (!res.ok) {
      return NextResponse.json(
        { error: `Submissão falhou (${res.status}): ${text.slice(0, 200)}` },
        { status: res.status }
      );
    }

    const json = JSON.parse(text);
    taskId = json?.data?.taskId;

    if (!taskId) {
      return NextResponse.json(
        { error: `taskId não encontrado na resposta: ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[generate-image] submit error:", err);
    return NextResponse.json({ error: `Erro na submissão: ${String(err)}` }, { status: 500 });
  }

  // ── Step 2: Poll until image is ready ──────────────────────────────────────
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    try {
      const res = await fetch(`${STATUS_URL}?taskId=${encodeURIComponent(taskId)}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });

      const text = await res.text();
      console.log("[generate-image] poll:", res.status, text.slice(0, 400));

      if (!res.ok) continue; // transient error, keep polling

      const json = JSON.parse(text);
      const flag: number = json?.data?.successFlag ?? json?.successFlag ?? FLAG_PENDING;

      if (flag === FLAG_DONE) {
        const imageUrl: string =
          json?.data?.resultImageUrl ??
          json?.resultImageUrl ??
          json?.data?.imageUrl;

        if (!imageUrl) {
          return NextResponse.json(
            { error: `Imagem gerada mas URL ausente: ${text.slice(0, 200)}` },
            { status: 502 }
          );
        }
        return NextResponse.json({ imageUrl });
      }

      if (flag === FLAG_FAILED_CREATION || flag === FLAG_FAILED_GEN) {
        return NextResponse.json(
          { error: `Geração falhou (successFlag=${flag})` },
          { status: 502 }
        );
      }

      // flag === FLAG_PENDING → keep polling
    } catch (err) {
      console.error("[generate-image] poll error:", err);
      // transient — keep polling
    }
  }

  return NextResponse.json(
    { error: "Timeout: a imagem demorou mais de 90s para gerar" },
    { status: 504 }
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
