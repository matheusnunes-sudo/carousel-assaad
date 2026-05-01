import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const json = JSON.parse(text);
  // Only return models that support generateContent and look image-related
  const all = (json.models ?? []).map((m: { name: string; supportedGenerationMethods?: string[] }) => ({
    name: m.name,
    methods: m.supportedGenerationMethods ?? [],
  }));

  const imageModels = all.filter((m: { name: string }) =>
    m.name.toLowerCase().includes("image") || m.name.toLowerCase().includes("imagen")
  );

  return NextResponse.json({ imageModels, allCount: all.length, all });
}
