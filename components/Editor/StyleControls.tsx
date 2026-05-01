"use client";

import { useCarouselStore } from "@/lib/store";
import { getFontSizes } from "@/types/carousel";
import clsx from "clsx";

export default function StyleControls() {
  const { style, setMode, setFontSize, setShowSlideNumber, setDimensions } = useCarouselStore();

  const isDark = style.backgroundColor === "#15202B";
  const sizes  = getFontSizes(style.fontSize);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 4 }}>

      {/* Mode */}
      <section>
        <p className="section-title">Modo</p>
        <div className="seg-ctrl" style={{ width: "100%" }}>
          <button onClick={() => setMode(true)}  className={clsx("tab flex-1 text-center", isDark  && "active")}>🌙 Dark</button>
          <button onClick={() => setMode(false)} className={clsx("tab flex-1 text-center", !isDark && "active")}>☀️ Light</button>
        </div>
      </section>

      {/* Font size */}
      <section>
        <p className="section-title">Tamanho da fonte</p>
        <input
          type="range" min={14} max={40} step={1}
          value={style.fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--blue)", cursor: "pointer" }}
        />
        <div className="flex justify-between items-center mt-2">
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>14px</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", background: "var(--bg-secondary)", borderRadius: "var(--r-pill)", padding: "3px 10px" }}>
            Corpo {style.fontSize}px · Título {sizes.title}px · Rodapé {sizes.footer}px
          </span>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>40px</span>
        </div>
      </section>

      {/* Slide number toggle */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Numeração de slides</p>
            <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>Ex: 1/5, 2/5…</p>
          </div>
          <button
            role="switch" aria-checked={style.showSlideNumber}
            onClick={() => setShowSlideNumber(!style.showSlideNumber)}
            className={clsx("toggle", style.showSlideNumber && "on")}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </section>

      {/* Dimensions */}
      <section>
        <p className="section-title">Dimensões</p>
        <div className="seg-ctrl" style={{ width: "100%" }}>
          {[
            { label: "1080 × 1080", w: 1080, h: 1080 },
            { label: "1080 × 1350", w: 1080, h: 1350 },
          ].map((dim) => {
            const isActive = style.dimensions.width === dim.w && style.dimensions.height === dim.h;
            return (
              <button
                key={`${dim.w}x${dim.h}`}
                onClick={() => setDimensions(dim.w, dim.h)}
                className={clsx("tab flex-1 text-center text-xs", isActive && "active")}
              >
                {dim.label}
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}
