import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
- Body: use quebras de linha \\n para separar ideias dentro do mesmo slide`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

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
