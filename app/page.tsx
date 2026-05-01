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
import { ThemeToggle } from "@/components/ThemeProvider";
import clsx from "clsx";

type EditorTab = "slides" | "style" | "profile";

const TABS: { id: EditorTab; label: string }[] = [
  { id: "slides",  label: "Slides"  },
  { id: "style",   label: "Estilo"  },
  { id: "profile", label: "Perfil"  },
];

export default function HomePage() {
  const [activeTab, setActiveTab]         = useState<EditorTab>("slides");
  const [isEditing, setIsEditing]         = useState(false);
  const [searchingImages, setSearchingImages] = useState(false);

  const { slides, style, setSlides, setStyle, setProfile, updateSlide } = useCarouselStore();

  const handleCreated = async (newSlides: Slide[], newStyle: CarouselStyle, newProfile: UserProfile) => {
    setSlides(newSlides);
    setStyle(newStyle);
    setProfile(newProfile);
    setActiveTab("slides");
    setIsEditing(true);

    if (newStyle.withImages) {
      setSearchingImages(true);
      for (const slide of newSlides) {
        const query = (slide.title || slide.body).slice(0, 80).trim();
        if (!query) continue;
        try {
          const res  = await fetch(`/api/search-image?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data.imageUrl) updateSlide(slide.id, { imageUrl: data.imageUrl });
        } catch { /* silently skip */ }
      }
      setSearchingImages(false);
    }
  };

  if (!isEditing) return <GeneratorScreen onCreated={handleCreated} />;

  const previewScale = style.dimensions.height === 1350 ? 0.22 : 0.28;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg-secondary)" }}>

      {/* ── Nav bar ─────────────────────────────────────────────────── */}
      <header
        className="nav-glass flex items-center justify-between px-6 flex-shrink-0"
        style={{ height: 48 }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-[7px] flex items-center justify-center text-white font-bold text-[11px]"
            style={{ background: "var(--blue)" }}
          >C</div>
          <span className="text-sm font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>CarrosselGen</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {searchingImages && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin opacity-70" />
              Buscando imagens…
            </span>
          )}
          <span className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.4)" }}>
            {slides.length} slide{slides.length !== 1 ? "s" : ""} · {style.dimensions.width}×{style.dimensions.height}
          </span>
          <button
            onClick={() => setIsEditing(false)}
            className="btn-ghost text-xs"
            style={{ color: "rgba(255,255,255,0.6)", padding: "5px 12px" }}
          >
            ← Novo
          </button>
          <ThemeToggle />
          <ExportAllButton />
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{
            width: 304,
            background: "var(--bg)",
            borderRight: "1px solid var(--sep)",
          }}
        >
          {/* Segmented tab bar */}
          <div className="flex-shrink-0 px-3 pt-3 pb-0">
            <div className="seg-ctrl" style={{ width: "100%" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx("tab flex-1 text-center", activeTab === tab.id && "active")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 pt-3">
            {activeTab === "slides"  && <SlideList />}
            {activeTab === "style"   && <StyleControls />}
            {activeTab === "profile" && <ProfileEditor />}
          </div>
        </aside>

        {/* Preview */}
        <main className="flex-1 overflow-y-auto scrollbar-thin" style={{ background: "var(--bg-secondary)" }}>
          <div className="min-h-full flex flex-col items-center py-8 px-6">
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between mb-5">
                <h2 className="section-title mb-0">Preview</h2>
                <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
                  {style.dimensions.width}×{style.dimensions.height}px · {Math.round(previewScale * 100)}%
                </span>
              </div>
              <CarouselPreview scale={previewScale} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
