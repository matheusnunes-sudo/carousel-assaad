"use client";

import { useState } from "react";
import { useCarouselStore } from "@/lib/store";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";
import SlideList from "@/components/Editor/SlideList";
import StyleControls from "@/components/Editor/StyleControls";
import ProfileEditor from "@/components/Editor/ProfileEditor";
import CarouselPreview from "@/components/Preview/CarouselPreview";
import { ExportAllButton } from "@/components/Export/ExportButton";
import GeneratorScreen from "@/components/Generator/GeneratorScreen";
import clsx from "clsx";

type EditorTab = "slides" | "style" | "profile";

const TABS: { id: EditorTab; label: string }[] = [
  { id: "slides",  label: "Slides" },
  { id: "style",   label: "Estilo" },
  { id: "profile", label: "Perfil" },
];

export default function HomePage() {
  const [activeTab, setActiveTab]   = useState<EditorTab>("slides");
  const [isEditing, setIsEditing]   = useState(false);
  const [searchingImages, setSearchingImages] = useState(false);

  const { slides, style, setSlides, setStyle, setProfile, updateSlide } = useCarouselStore();

  const handleCreated = async (
    newSlides: Slide[],
    newStyle: CarouselStyle,
    newProfile: UserProfile
  ) => {
    setSlides(newSlides);
    setStyle(newStyle);
    setProfile(newProfile);
    setActiveTab("slides");
    setIsEditing(true);

    // Auto-search Unsplash images if enabled
    if (newStyle.withImages) {
      setSearchingImages(true);
      for (const slide of newSlides) {
        const query = (slide.title || slide.body).slice(0, 80).trim();
        if (!query) continue;
        try {
          const res  = await fetch(`/api/search-image?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data.imageUrl) updateSlide(slide.id, { imageUrl: data.imageUrl });
        } catch {
          // silently skip
        }
      }
      setSearchingImages(false);
    }
  };

  // ── Generator screen ─────────────────────────────────────────────────────────
  if (!isEditing) {
    return <GeneratorScreen onCreated={handleCreated} />;
  }

  // ── Editor screen ────────────────────────────────────────────────────────────
  const previewScale = style.dimensions.height === 1350 ? 0.22 : 0.28;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-assaad-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b flex-shrink-0" style={{ borderColor: "var(--assaad-gray-200)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--assaad-gradient-primary)" }}>C</div>
          <span className="font-semibold text-assaad-dark text-sm">CarrosselGen</span>
        </div>

        <div className="flex items-center gap-3">
          {searchingImages && (
            <span className="text-xs text-assaad-gray-500 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border-2 border-assaad-primary border-t-transparent rounded-full animate-spin" />
              Buscando imagens...
            </span>
          )}
          <span className="text-xs text-assaad-gray-500">
            {slides.length} slide{slides.length !== 1 ? "s" : ""} · {style.dimensions.width}×{style.dimensions.height}
          </span>
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs text-assaad-gray-500 hover:text-assaad-dark border border-assaad-gray-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            ← Novo carrossel
          </button>
          <ExportAllButton />
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <aside className="w-80 flex-shrink-0 flex flex-col bg-white border-r overflow-hidden" style={{ borderColor: "var(--assaad-gray-200)" }}>
          <div className="flex gap-1 p-3 pb-0 flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx("tab flex-1 text-center cursor-pointer", activeTab === tab.id && "active")}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {activeTab === "slides"  && <SlideList />}
            {activeTab === "style"   && <StyleControls />}
            {activeTab === "profile" && <ProfileEditor />}
          </div>
        </aside>

        {/* Preview */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-assaad-gray-50">
          <div className="min-h-full flex flex-col items-center py-6 px-8">
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider">Preview</h2>
                <span className="text-[10px] text-assaad-gray-500">
                  {style.dimensions.width}×{style.dimensions.height}px ({Math.round(previewScale * 100)}%)
                </span>
              </div>
              <CarouselPreview scale={previewScale} />
            </div>
          </div>
        </main>
      </div>

      <footer className="px-6 py-2 text-center text-[11px] text-assaad-gray-500 bg-white border-t flex-shrink-0" style={{ borderColor: "var(--assaad-gray-200)" }}>
        Feito com CarrosselGen · Assaad Educação
      </footer>
    </div>
  );
}
