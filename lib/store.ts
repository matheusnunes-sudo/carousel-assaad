import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Slide, CarouselStyle, UserProfile, FontFamily, FontSize, TextAlign } from "@/types/carousel";

interface CarouselStore {
  slides: Slide[];
  style: CarouselStyle;
  profile: UserProfile;
  activeSlideId: string | null;
  templateId: string;

  // Slide actions
  addSlide: () => void;
  removeSlide: (id: string) => void;
  updateSlide: (id: string, data: Partial<Omit<Slide, "id" | "order">>) => void;
  reorderSlides: (activeId: string, overId: string) => void;
  setActiveSlide: (id: string | null) => void;

  // Style actions
  setBackgroundColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
  setTextAlign: (align: TextAlign) => void;
  setShowSlideNumber: (show: boolean) => void;
  setDimensions: (width: number, height: number) => void;

  // Profile actions
  setHandle: (handle: string) => void;
  setDisplayName: (name: string) => void;
  setAvatarUrl: (url: string) => void;

  // Template actions
  applyTemplate: (templateId: string, style: CarouselStyle) => void;
}

const defaultStyle: CarouselStyle = {
  backgroundColor: "#15202B",
  textColor: "#FFFFFF",
  fontFamily: "Inter",
  fontSize: "medium",
  textAlign: "left",
  showSlideNumber: true,
  dimensions: { width: 1080, height: 1080 },
};

const createSlide = (order: number): Slide => ({
  id: uuidv4(),
  title: "",
  body: "",
  footer: "",
  order,
});

export const useCarouselStore = create<CarouselStore>((set) => ({
  slides: [createSlide(0)],
  style: defaultStyle,
  profile: { handle: "@usuario", displayName: "Usuário" },
  activeSlideId: null,
  templateId: "twitter-dark",

  addSlide: () =>
    set((state) => ({
      slides: [
        ...state.slides,
        createSlide(state.slides.length),
      ],
    })),

  removeSlide: (id) =>
    set((state) => {
      if (state.slides.length <= 1) return state;
      const filtered = state.slides
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i }));
      return { slides: filtered };
    }),

  updateSlide: (id, data) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),

  reorderSlides: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.slides.findIndex((s) => s.id === activeId);
      const newIndex = state.slides.findIndex((s) => s.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;

      const reordered = [...state.slides];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      return {
        slides: reordered.map((s, i) => ({ ...s, order: i })),
      };
    }),

  setActiveSlide: (id) => set({ activeSlideId: id }),

  setBackgroundColor: (color) =>
    set((state) => ({ style: { ...state.style, backgroundColor: color } })),

  setTextColor: (color) =>
    set((state) => ({ style: { ...state.style, textColor: color } })),

  setFontFamily: (font) =>
    set((state) => ({ style: { ...state.style, fontFamily: font } })),

  setFontSize: (size) =>
    set((state) => ({ style: { ...state.style, fontSize: size } })),

  setTextAlign: (align) =>
    set((state) => ({ style: { ...state.style, textAlign: align } })),

  setShowSlideNumber: (show) =>
    set((state) => ({ style: { ...state.style, showSlideNumber: show } })),

  setDimensions: (width, height) =>
    set((state) => ({ style: { ...state.style, dimensions: { width, height } } })),

  setHandle: (handle) =>
    set((state) => ({ profile: { ...state.profile, handle } })),

  setDisplayName: (displayName) =>
    set((state) => ({ profile: { ...state.profile, displayName } })),

  setAvatarUrl: (avatarUrl) =>
    set((state) => ({ profile: { ...state.profile, avatarUrl } })),

  applyTemplate: (templateId, style) =>
    set({ templateId, style }),
}));
