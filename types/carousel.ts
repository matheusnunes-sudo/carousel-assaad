export interface Slide {
  id: string;
  title?: string;
  body: string;
  footer?: string;
  order: number;
}

export interface CarouselStyle {
  backgroundColor: string;
  textColor: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
  textAlign: TextAlign;
  showSlideNumber: boolean;
  dimensions: { width: number; height: number };
}

export interface UserProfile {
  handle: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  style: CarouselStyle;
}

export interface CarouselProject {
  id: string;
  slides: Slide[];
  style: CarouselStyle;
  profile: UserProfile;
  templateId: string;
  createdAt: Date;
}

export type FontFamily =
  | "Inter"
  | "Space Grotesk"
  | "Playfair Display"
  | "JetBrains Mono"
  | "Outfit";

export type FontSize = "small" | "medium" | "large";
export type TextAlign = "left" | "center";

export const FONT_SIZE_MAP: Record<FontSize, { title: string; body: string; footer: string }> = {
  small: { title: "28px", body: "18px", footer: "14px" },
  medium: { title: "36px", body: "22px", footer: "16px" },
  large: { title: "48px", body: "28px", footer: "18px" },
};

export const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  "Inter": "'Inter', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  "JetBrains Mono": "'JetBrains Mono', monospace",
  "Outfit": "'Outfit', sans-serif",
};
