"use client";

import { useCarouselStore } from "@/lib/store";
import { SlidePreviewScaled } from "./SlidePreview";

interface CarouselPreviewProps {
  scale?: number;
}

export default function CarouselPreview({ scale = 0.28 }: CarouselPreviewProps) {
  const { slides, style, profile, setActiveSlide, activeSlideId } = useCarouselStore();

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      {slides.map((slide, index) => (
        <div key={slide.id} className="flex flex-col items-center gap-2">
          <SlidePreviewScaled
            slide={slide}
            style={style}
            profile={profile}
            index={index}
            total={slides.length}
            scale={scale}
            isActive={activeSlideId === slide.id}
            onClick={() => setActiveSlide(slide.id)}
          />
          <span className="text-xs text-assaad-gray-500 font-medium">
            Slide {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}
