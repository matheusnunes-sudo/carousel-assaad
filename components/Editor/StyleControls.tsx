"use client";

import { useCarouselStore } from "@/lib/store";
import { getFontSizes } from "@/types/carousel";
import clsx from "clsx";

export default function StyleControls() {
  const { style, setMode, setFontSize, setShowSlideNumber, setDimensions } = useCarouselStore();

  const isDark = style.backgroundColor === "#15202B";
  const sizes  = getFontSizes(style.fontSize);

  return (
    <div className="space-y-6">

      {/* Mode */}
      <div>
        <label className="label">Modo</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(true)}
            className={clsx(
              "flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all border",
              isDark ? "bg-[#15202B] text-white border-transparent" : "bg-white text-assaad-gray-500 border-assaad-gray-200 hover:border-assaad-gray-300"
            )}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => setMode(false)}
            className={clsx(
              "flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all border",
              !isDark ? "bg-[#F7F9F9] text-[#0F1419] border-[#CFD9DE]" : "bg-white text-assaad-gray-500 border-assaad-gray-200 hover:border-assaad-gray-300"
            )}
          >
            ☀️ Light
          </button>
        </div>
      </div>

      {/* Font size slider */}
      <div>
        <label className="label">
          Tamanho da fonte
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={14}
            max={40}
            step={1}
            value={style.fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-assaad-primary"
          />
          <div className="flex justify-between text-[10px] text-assaad-gray-400">
            <span>14px</span>
            <span className="font-semibold text-assaad-dark text-xs">
              Corpo {style.fontSize}px · Título {sizes.title}px · Rodapé {sizes.footer}px
            </span>
            <span>40px</span>
          </div>
        </div>
      </div>

      {/* Slide number toggle */}
      <div className="flex items-center justify-between">
        <label className="label mb-0">Numeração de slides</label>
        <button
          role="switch"
          aria-checked={style.showSlideNumber}
          onClick={() => setShowSlideNumber(!style.showSlideNumber)}
          className={clsx(
            "relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0",
            style.showSlideNumber ? "bg-assaad-primary" : "bg-assaad-gray-200"
          )}
        >
          <span className={clsx(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
            style.showSlideNumber ? "left-5" : "left-0.5"
          )} />
        </button>
      </div>

      {/* Dimensions */}
      <div>
        <label className="label">Dimensões</label>
        <div className="flex gap-1.5">
          {[
            { label: "1080 × 1080", w: 1080, h: 1080 },
            { label: "1080 × 1350", w: 1080, h: 1350 },
          ].map((dim) => (
            <button
              key={`${dim.w}x${dim.h}`}
              onClick={() => setDimensions(dim.w, dim.h)}
              className={clsx(
                "flex-1 text-[11px] py-2 px-2 rounded-lg transition-all cursor-pointer",
                style.dimensions.width === dim.w && style.dimensions.height === dim.h
                  ? "text-white font-medium"
                  : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-200"
              )}
              style={
                style.dimensions.width === dim.w && style.dimensions.height === dim.h
                  ? { background: "var(--assaad-gradient-primary)" }
                  : {}
              }
            >
              {dim.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
