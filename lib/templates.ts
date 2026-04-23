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
      withImages: false,
      dimensions: { width: 1080, height: 1080 },
    },
  },
  {
    id: "twitter-light",
    name: "Twitter Light",
    description: "Fundo branco estilo Twitter/X, texto escuro",
    style: {
      backgroundColor: "#FFFFFF",
      textColor: "#0F1419",
      fontFamily: "Inter",
      fontSize: "medium",
      textAlign: "left",
      showSlideNumber: true,
      withImages: false,
      dimensions: { width: 1080, height: 1080 },
    },
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
