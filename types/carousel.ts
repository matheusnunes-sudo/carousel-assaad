export type CarouselFormat = "twitter" | "instagram";

export interface Slide {
  id: string;
  title?: string;
  body: string;
  footer?: string;
  imageUrl?: string;
  order: number;
}

export interface CarouselStyle {
  format: CarouselFormat;
  backgroundColor: string;
  textColor: string;
  fontSize: number;       // body font size in px (preview CSS scale)
  showSlideNumber: boolean;
  withImages: boolean;
  dimensions: { width: number; height: number };
}

export interface UserProfile {
  handle: string;
  displayName: string;
  avatarUrl?: string;
}

/** Compute title / body / footer sizes from a single body size value */
export function getFontSizes(bodyPx: number) {
  return {
    title:  Math.round(bodyPx * 1.6),
    body:   bodyPx,
    footer: Math.round(bodyPx * 0.65),
  };
}

export const TWITTER_DARK  = { backgroundColor: "#15202B", textColor: "#FFFFFF" } as const;
export const TWITTER_LIGHT = { backgroundColor: "#FFFFFF", textColor: "#0F1419" } as const;

export const FONT_FAMILY = "'Inter', sans-serif";
export const DEFAULT_FONT_SIZE = 22; // px
