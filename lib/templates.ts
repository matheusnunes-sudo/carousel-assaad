import type { Template } from "@/types/carousel";

export const TEMPLATES: Template[] = [
  {
    id: "twitter-dark",
    name: "Twitter Dark",
    description: "Fundo escuro estilo Twitter/X, texto branco",
    style: {
      backgroundColor: "#15202B",
      textColor: "#FFFFFF",
      fontFamily: "Inter",
      fontSize: "medium",
      textAlign: "left",
      showSlideNumber: true,
      dimensions: { width: 1080, height: 1080 },
    },
  },
  {
    id: "clean-white",
    name: "Clean",
    description: "Minimalista, fundo branco, texto escuro",
    style: {
      backgroundColor: "#FFFFFF",
      textColor: "#111827",
      fontFamily: "Inter",
      fontSize: "medium",
      textAlign: "left",
      showSlideNumber: true,
      dimensions: { width: 1080, height: 1080 },
    },
  },
  {
    id: "gradient",
    name: "Gradiente",
    description: "Gradiente azul suave, texto branco",
    style: {
      backgroundColor: "linear-gradient(135deg, #4F5FE6, #7B8CF8)",
      textColor: "#FFFFFF",
      fontFamily: "Space Grotesk",
      fontSize: "medium",
      textAlign: "center",
      showSlideNumber: true,
      dimensions: { width: 1080, height: 1080 },
    },
  },
  {
    id: "brand-assaad",
    name: "Assaad Brand",
    description: "Identidade visual Assaad Educação",
    style: {
      backgroundColor: "#4F5FE6",
      textColor: "#FFFFFF",
      fontFamily: "Inter",
      fontSize: "medium",
      textAlign: "left",
      showSlideNumber: true,
      dimensions: { width: 1080, height: 1080 },
    },
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
