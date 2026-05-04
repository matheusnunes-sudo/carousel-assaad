// Templates are no longer used in the UI — kept for reference only.
import type { CarouselStyle } from "@/types/carousel";
import { DEFAULT_FONT_SIZE } from "@/types/carousel";

export const TWITTER_DARK_STYLE: CarouselStyle = {
  format: "twitter",
  backgroundColor: "#15202B",
  textColor: "#FFFFFF",
  fontSize: DEFAULT_FONT_SIZE,
  showSlideNumber: true,
  withImages: false,
  dimensions: { width: 1080, height: 1080 },
};

export const TWITTER_LIGHT_STYLE: CarouselStyle = {
  format: "twitter",
  backgroundColor: "#FFFFFF",
  textColor: "#0F1419",
  fontSize: DEFAULT_FONT_SIZE,
  showSlideNumber: true,
  withImages: false,
  dimensions: { width: 1080, height: 1080 },
};
