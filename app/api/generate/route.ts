import { NextRequest, NextResponse } from "next/server";

// Uses Groq (free tier) — no SDK needed, plain fetch against OpenAI-compatible API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // fast + free

export async function POST(req: NextRequest) {
  try {
    const { topic, slideCount, mode, withImages } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Tema obrigatório" }, { status: 400 });
    }

    const modeNote = mode === "dark"
      ? "estilo Twitter/X dark mode — linguagem direta, impacto alto"
      : "estilo Twitter/X light mode — linguagem direta, impacto alto";

    const imageNote = withImages
      ? `Para cada slide, inclua também o campo "imagePrompt" com uma descrição em inglês de uma imagem fotográfica ideal para ilustrar aquele slide (seja específico: cena, composição, iluminação, estilo).`
      : `Não inclua imagens.`;

    const prompt = `Você é um especialista em criação de carrosséis virais para redes sociais.

Crie um carrossel de ${slideCount} slides sobre o tema: "${topic}"
Estilo: ${modeNote}
Idioma: Português brasileiro

${imageNote}

Retorne APENAS um array JSON válido (sem markdown, sem explicações) com exatamente ${slideCount} objetos neste formato:
[
  {
    "title": "Título curto e impactante (máx 8 palavras)",
    "body": "Texto do slide. Máx 3-4 linhas. Seja direto e valioso.",
    "footer": "Rodapé opcional (ex: hashtag, CTA curto)"${withImages ? `,\n    "imagePrompt": "Descrição da imagem ideal em inglês"` : ""}
  }
]

Regras de conteúdo:
- Slide 1: hook poderoso que prende atenção — título impactante, body curto ou vazio
- Slides 2 a ${slideCount - 1}: um ponto de valor por slide, body com no máx 3-4 linhas
- Slide ${slideCount}: call to action claro (salvar, seguir, comentar)
- Linguagem: clara, sem jargão desnecessário, crie urgência ou curiosidade
- Body: use quebras de linha \\n para separar ideias dentro do mesmo slide
- Retorne SOMENTE o array JSON, nada mais`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "Erro na API de IA" }, { status: 500 });
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON array found in response:", text);
      return NextResponse.json({ error: "Resposta inválida da IA" }, { status: 500 });
    }

    let slides: unknown[];
    try {
      slides = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("JSON parse failed:", jsonMatch[0]);
      return NextResponse.json({ error: "Erro ao interpretar resposta da IA" }, { status: 500 });
    }

    return NextResponse.json({ slides });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
