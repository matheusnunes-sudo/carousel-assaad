"use client";

import { useCarouselStore } from "@/lib/store";
import type { FontFamily, FontSize, TextAlign } from "@/types/carousel";
import ColorPicker from "@/components/ui/ColorPicker";
import clsx from "clsx";

const FONTS: FontFamily[] = [
  "Inter",
  "Space Grotesk",
  "Playfair Display",
  "JetBrains Mono",
  "Outfit",
];

const FONT_SIZE_LABELS: Record<FontSize, string> = {
  small: "P",
  medium: "M",
  large: "G",
};

export default function StyleControls() {
  const {
    style,
    setBackgroundColor,
    setTextColor,
    setFontFamily,
    setFontSize,
    setTextAlign,
    setShowSlideNumber,
    setDimensions,
  } = useCarouselStore();

  return (
    <div className="space-y-5">
      {/* Background Color */}
      <ColorPicker
        label="Cor de fundo"
        value={style.backgroundColor}
        onChange={setBackgroundColor}
      />

      {/* Text Color */}
      <ColorPicker
        label="Cor do texto"
        value={style.textColor}
        onChange={setTextColor}
        presets={["#FFFFFF", "#111827", "#4F5FE6", "#F97316", "#22C55E", "#8B5CF6", "#EF4444", "#E91E63", "#6B7280", "#1A1A2E", "#E8EAFD", "#7B8CF8"]}
      />

      {/* Font Family */}
      <div>
        <label className="label">Fonte</label>
        <select
          value={style.fontFamily}
          onChange={(e) => setFontFamily(e.target.value as FontFamily)}
          className="input-base"
          style={{ fontFamily: style.fontFamily }}
        >
          {FONTS.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="label">Tamanho do texto</label>
        <div className="flex gap-1.5">
          {(["small", "medium", "large"] as FontSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={clsx(
                "flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                style.fontSize === size
                  ? "bg-assaad-primary text-white"
                  : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-200"
              )}
            >
              {FONT_SIZE_LABELS[size]}
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="label">Alinhamento</label>
        <div className="flex gap-1.5">
          {([
            { value: "left", icon: "≡", label: "Esquerda" },
            { value: "center", icon: "☰", label: "Centro" },
          ] as { value: TextAlign; icon: string; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTextAlign(opt.value)}
              title={opt.label}
              className={clsx(
                "flex-1 py-2 rounded-lg text-base transition-all duration-200 cursor-pointer",
                style.textAlign === opt.value
                  ? "bg-assaad-primary text-white"
                  : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-200"
              )}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Number Toggle */}
      <div className="flex items-center justify-between">
        <label className="label mb-0 cursor-pointer" htmlFor="slide-number-toggle">
          Numeração de slides
        </label>
        <button
          id="slide-number-toggle"
          role="switch"
          aria-checked={style.showSlideNumber}
          onClick={() => setShowSlideNumber(!style.showSlideNumber)}
          className={clsx(
            "relative w-10 h-5 rounded-pill transition-colors duration-200 cursor-pointer",
            style.showSlideNumber ? "bg-assaad-primary" : "bg-assaad-gray-200"
          )}
        >
          <span
            className={clsx(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
              style.showSlideNumber ? "left-5" : "left-0.5"
            )}
          />
        </button>
      </div>

      {/* Dimensions */}
      <div>
        <label className="label">Dimensões</label>
        <div className="flex gap-1.5">
          {[
            { label: "1:1 (1080×1080)", w: 1080, h: 1080 },
            { label: "4:5 (1080×1350)", w: 1080, h: 1350 },
          ].map((dim) => (
            <button
              key={`${dim.w}x${dim.h}`}
              onClick={() => setDimensions(dim.w, dim.h)}
              className={clsx(
                "flex-1 text-[11px] py-1.5 px-2 rounded-lg transition-all duration-200 cursor-pointer",
                style.dimensions.width === dim.w && style.dimensions.height === dim.h
                  ? "bg-assaad-primary text-white font-medium"
                  : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-200"
              )}
            >
              {dim.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
