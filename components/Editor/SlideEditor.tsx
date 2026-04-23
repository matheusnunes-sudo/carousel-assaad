"use client";

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
  const bodyChars = slide.body.length;
  const isOverLimit = bodyChars > MAX_CHARS;

  return (
    <div
      className={clsx(
        "card cursor-pointer transition-all duration-200",
        isActive && "selected ring-1 ring-assaad-primary"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-assaad-gray-500">
          Slide {index + 1}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          disabled={slides.length <= 1}
          title="Remover slide"
          className={clsx(
            "w-5 h-5 rounded flex items-center justify-center text-xs transition-colors duration-200",
            slides.length <= 1
              ? "text-assaad-gray-200 cursor-not-allowed"
              : "text-assaad-gray-500 hover:bg-red-50 hover:text-red-500 cursor-pointer"
          )}
        >
          ×
        </button>
      </div>

      {/* Image field — only when carousel has images enabled */}
      {style.withImages && (
        <div className="mb-3">
          {slide.imagePrompt && (
            <p className="text-[10px] text-assaad-gray-400 mb-1 italic leading-snug">
              💡 {slide.imagePrompt}
            </p>
          )}
          <label className="label" htmlFor={`img-${slide.id}`}>
            URL da imagem
          </label>
          <input
            id={`img-${slide.id}`}
            type="url"
            value={slide.imageUrl ?? ""}
            onChange={(e) => updateSlide(slide.id, { imageUrl: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            placeholder="https://..."
            className="input-base"
          />
        </div>
      )}

      {/* Title field */}
      <div className="mb-2">
        <label className="label" htmlFor={`title-${slide.id}`}>
          Título (opcional)
        </label>
        <input
          id={`title-${slide.id}`}
          type="text"
          value={slide.title ?? ""}
          onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Título do slide"
          className="input-base"
        />
      </div>

      {/* Body field */}
      <div className="mb-2">
        <label className="label" htmlFor={`body-${slide.id}`}>
          Texto principal
        </label>
        <textarea
          id={`body-${slide.id}`}
          value={slide.body}
          onChange={(e) => updateSlide(slide.id, { body: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Escreva o conteúdo do slide..."
          rows={4}
          className={clsx(
            "input-base resize-none",
            isOverLimit && "border-red-400 focus:border-red-500"
          )}
        />
        <div className={clsx(
          "text-right text-[10px] mt-0.5",
          isOverLimit ? "text-red-500 font-medium" : "text-assaad-gray-500"
        )}>
          {bodyChars}/{MAX_CHARS}
        </div>
      </div>

      {/* Footer field */}
      <div>
        <label className="label" htmlFor={`footer-${slide.id}`}>
          Rodapé (opcional)
        </label>
        <input
          id={`footer-${slide.id}`}
          type="text"
          value={slide.footer ?? ""}
          onChange={(e) => updateSlide(slide.id, { footer: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Hashtag, CTA..."
          className="input-base"
        />
      </div>
    </div>
  );
}
