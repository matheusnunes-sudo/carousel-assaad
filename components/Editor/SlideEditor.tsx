"use client";

import { useState } from "react";
import { useCarouselStore } from "@/lib/store";
import type { Slide } from "@/types/carousel";
import clsx from "clsx";

const MAX_CHARS = 280;

interface SlideEditorProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
}

export default function SlideEditor({ slide, index, isActive, onClick, onRemove }: SlideEditorProps) {
  const { updateSlide, slides, style } = useCarouselStore();
  const [searching, setSearching] = useState(false);
  const bodyChars   = slide.body.length;
  const isOverLimit = bodyChars > MAX_CHARS;

  const handleSearchImage = async () => {
    const query = (slide.title || slide.body).slice(0, 80).trim();
    if (!query) return;
    setSearching(true);
    try {
      const res  = await fetch(`/api/search-image?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.imageUrl) updateSlide(slide.id, { imageUrl: data.imageUrl });
    } catch { /* fail silently */ }
    finally { setSearching(false); }
  };

  return (
    <div
      onClick={onClick}
      className={clsx("card cursor-pointer transition-all duration-150", isActive && "selected")}
      style={{ padding: "14px 14px 12px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span style={{
          fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)",
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          Slide {index + 1}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          disabled={slides.length <= 1}
          title="Remover slide"
          className="btn-destructive"
          style={{ opacity: slides.length <= 1 ? 0.3 : 1 }}
        >
          ×
        </button>
      </div>

      {/* Image field */}
      {style.withImages && (
        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
          <label className="label">Imagem</label>
          <div className="flex gap-1.5">
            <input
              type="url"
              value={slide.imageUrl ?? ""}
              onChange={(e) => updateSlide(slide.id, { imageUrl: e.target.value })}
              placeholder="URL da imagem…"
              className="input-base flex-1"
              style={{ fontSize: 12 }}
            />
            <button
              onClick={handleSearchImage}
              disabled={searching}
              title="Buscar no Unsplash"
              style={{
                flexShrink: 0, width: 36, height: 36,
                borderRadius: "var(--r-sm)",
                background: "var(--blue-tint)",
                color: "var(--blue)",
                border: "none", cursor: "pointer", fontSize: 15,
                opacity: searching ? 0.6 : 1,
              }}
            >
              {searching ? "…" : "🔍"}
            </button>
          </div>
          {slide.imageUrl && (
            <img
              src={slide.imageUrl} alt=""
              style={{ marginTop: 8, width: "100%", height: 72, objectFit: "cover", borderRadius: "var(--r-sm)" }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>
      )}

      {/* Title */}
      <div className="mb-2" onClick={(e) => e.stopPropagation()}>
        <label className="label" htmlFor={`title-${slide.id}`}>Título (opcional)</label>
        <input
          id={`title-${slide.id}`}
          type="text"
          value={slide.title ?? ""}
          onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
          placeholder="Título do slide"
          className="input-base"
        />
      </div>

      {/* Body */}
      <div className="mb-2" onClick={(e) => e.stopPropagation()}>
        <label className="label" htmlFor={`body-${slide.id}`}>Texto principal</label>
        <textarea
          id={`body-${slide.id}`}
          value={slide.body}
          onChange={(e) => updateSlide(slide.id, { body: e.target.value })}
          placeholder="Texto do slide…"
          rows={4}
          className="input-base resize-none"
          style={isOverLimit ? { borderColor: "var(--red)" } : {}}
        />
        <div style={{
          textAlign: "right", marginTop: 4, fontSize: 10,
          color: isOverLimit ? "var(--red)" : "var(--text-tertiary)",
          fontWeight: isOverLimit ? 600 : 400,
        }}>
          {bodyChars}/{MAX_CHARS}
        </div>
      </div>

      {/* Footer */}
      <div onClick={(e) => e.stopPropagation()}>
        <label className="label" htmlFor={`footer-${slide.id}`}>Rodapé (opcional)</label>
        <input
          id={`footer-${slide.id}`}
          type="text"
          value={slide.footer ?? ""}
          onChange={(e) => updateSlide(slide.id, { footer: e.target.value })}
          placeholder="Hashtag, CTA…"
          className="input-base"
        />
      </div>
    </div>
  );
}
