"use client";

import { useState } from "react";
import { useCarouselStore } from "@/lib/store";
import type { Slide } from "@/types/carousel";
import clsx from "clsx";

const MAX_CHARS = 280;

function Spinner({ white }: { white?: boolean }) {
  return (
    <span style={{
      display: "inline-block", width: 10, height: 10,
      border: `2px solid ${white ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.15)"}`,
      borderTopColor: white ? "white" : "var(--text-secondary)",
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
    }} />
  );
}

interface SlideEditorProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
}

export default function SlideEditor({ slide, index, isActive, onClick, onRemove }: SlideEditorProps) {
  const { updateSlide, slides, style } = useCarouselStore();
  const [generating, setGenerating] = useState(false);
  const bodyChars   = slide.body.length;
  const isOverLimit = bodyChars > MAX_CHARS;


  /** Generate an AI image with Nano Banana */
  const handleGenerateImage = async () => {
    const prompt = [slide.title, slide.body].filter(Boolean).join(" — ").slice(0, 200).trim();
    if (!prompt) return;
    setGenerating(true);
    try {
      const ratio = style.dimensions.height === 1350 ? "4:5" : "1:1";
      const res   = await fetch(`/api/generate-image?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`);
      const data  = await res.json();
      if (data.imageUrl) updateSlide(slide.id, { imageUrl: data.imageUrl });
    } catch { /* fail silently */ }
    finally { setGenerating(false); }
  };

  const busy = generating;

  return (
    <div
      onClick={onClick}
      className={clsx("card cursor-pointer transition-all duration-150", isActive && "selected")}
      style={{ padding: "14px 14px 12px" }}
    >
      {/* ── @keyframes (injected once per instance; deduplicated by browser) ── */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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

      {/* ── Image section ──────────────────────────────────────────────── */}
      <div className="mb-3" onClick={(e) => e.stopPropagation()}>
        <label className="label">Imagem</label>

        {/* URL input */}
        <input
          type="url"
          value={slide.imageUrl ?? ""}
          onChange={(e) => updateSlide(slide.id, { imageUrl: e.target.value })}
          placeholder="Cole uma URL ou use os botões abaixo…"
          className="input-base"
          style={{ fontSize: 12, marginBottom: 6 }}
        />

        {/* Generate button */}
        <button
          onClick={handleGenerateImage}
          disabled={busy}
          title="Gerar imagem com Nano Banana IA"
          style={{
            width: "100%", height: 32, borderRadius: "var(--r-sm)",
            background: "var(--blue)", border: "none",
            color: "white", cursor: busy ? "not-allowed" : "pointer",
            fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            opacity: busy ? 0.65 : 1, transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = "var(--blue-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--blue)"; }}
        >
          {generating ? <Spinner white /> : "🍌"} Gerar imagem com IA
        </button>

        {/* Preview thumbnail */}
        {slide.imageUrl && (
          <img
            src={slide.imageUrl} alt=""
            style={{ marginTop: 8, width: "100%", height: 72, objectFit: "cover", borderRadius: "var(--r-sm)" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      {/* ── Title ──────────────────────────────────────────────────────── */}
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

      {/* ── Body ───────────────────────────────────────────────────────── */}
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

      {/* ── Footer ─────────────────────────────────────────────────────── */}
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
