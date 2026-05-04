import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Slide, CarouselStyle, UserProfile, CarouselFormat } from "@/types/carousel";
import { DEFAULT_FONT_SIZE } from "@/types/carousel";

interface CarouselStore {
  slides: Slide[];
  style: CarouselStyle;
  profile: UserProfile;
  activeSlideId: string | null;

  // Bulk (used by generator)
  setSlides:  (slides: Slide[]) => void;
  setStyle:   (style: CarouselStyle) => void;
  setProfile: (profile: UserProfile) => void;

  // Slide actions
  addSlide:      () => void;
  removeSlide:   (id: string) => void;
  updateSlide:   (id: string, data: Partial<Omit<Slide, "id" | "order">>) => void;
  reorderSlides: (activeId: string, overId: string) => void;
  setActiveSlide:(id: string | null) => void;

  // Style actions
  setFormat:         (format: CarouselFormat) => void;
  setFontSize:       (size: number) => void;
  setShowSlideNumber:(show: boolean) => void;
  setDimensions:     (width: number, height: number) => void;
  setMode:           (dark: boolean) => void;

  // Profile actions
  setHandle:      (handle: string) => void;
  setDisplayName: (name: string) => void;
  setAvatarUrl:   (url: string) => void;
}

const defaultStyle: CarouselStyle = {
  format: "twitter",
  backgroundColor: "#15202B",
  textColor: "#FFFFFF",
  fontSize: DEFAULT_FONT_SIZE,
  showSlideNumber: true,
  withImages: false,
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

  setSlides:  (slides)  => set({ slides }),
  setStyle:   (style)   => set({ style }),
  setProfile: (profile) => set({ profile }),

  addSlide: () =>
    set((state) => ({ slides: [...state.slides, createSlide(state.slides.length)] })),

  removeSlide: (id) =>
    set((state) => {
      if (state.slides.length <= 1) return state;
      return {
        slides: state.slides
          .filter((s) => s.id !== id)
          .map((s, i) => ({ ...s, order: i })),
      };
    }),

  updateSlide: (id, data) =>
    set((state) => ({
      slides: state.slides.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),

  reorderSlides: (activeId, overId) =>
    set((state) => {
      const oldIdx = state.slides.findIndex((s) => s.id === activeId);
      const newIdx = state.slides.findIndex((s) => s.id === overId);
      if (oldIdx === -1 || newIdx === -1) return state;
      const reordered = [...state.slides];
      const [moved] = reordered.splice(oldIdx, 1);
      reordered.splice(newIdx, 0, moved);
      return { slides: reordered.map((s, i) => ({ ...s, order: i })) };
    }),

  setActiveSlide: (id) => set({ activeSlideId: id }),

  setFormat: (format) =>
    set((state) => ({ style: { ...state.style, format } })),

  setFontSize: (size) =>
    set((state) => ({ style: { ...state.style, fontSize: size } })),

  setShowSlideNumber: (show) =>
    set((state) => ({ style: { ...state.style, showSlideNumber: show } })),

  setDimensions: (width, height) =>
    set((state) => ({ style: { ...state.style, dimensions: { width, height } } })),

  setMode: (dark) =>
    set((state) => ({
      style: {
        ...state.style,
        backgroundColor: dark ? "#15202B" : "#FFFFFF",
        textColor:       dark ? "#FFFFFF" : "#0F1419",
      },
    })),

  setHandle:      (handle)      => set((state) => ({ profile: { ...state.profile, handle } })),
  setDisplayName: (displayName) => set((state) => ({ profile: { ...state.profile, displayName } })),
  setAvatarUrl:   (avatarUrl)   => set((state) => ({ profile: { ...state.profile, avatarUrl } })),
}));
