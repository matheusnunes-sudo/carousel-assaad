"use client";

import { useCarouselStore } from "@/lib/store";
import SlidePreview from "@/components/Preview/SlidePreview";
import { getSlideElementId } from "@/lib/export";

// Renders all slides at full 1080×1080 off-screen so html-to-image can
// capture them without interference from the scaled preview container.
export default function ExportLayer() {
  const { slides, style, profile } = useCarouselStore();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: "-9999px",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      {slides.map((slide, index) => (
        <SlidePreview
          key={slide.id}
          slide={slide}
          style={style}
          profile={profile}
          index={index}
          total={slides.length}
          exportId={getSlideElementId(slide.id)}
        />
      ))}
    </div>
  );
}
