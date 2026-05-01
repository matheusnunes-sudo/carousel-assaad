"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCarouselStore } from "@/lib/store";
import SlideEditor from "./SlideEditor";
import type { Slide } from "@/types/carousel";

function SortableSlide({
  slide,
  index,
  isActive,
  onActivate,
  onRemove,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        title="Arrastar para reordenar"
        style={{
          position: "absolute",
          left: -20,
          top: "50%",
          transform: "translateY(-50%)",
          width: 16,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "grab",
          color: "var(--text-tertiary)",
          fontSize: 12,
          padding: 0,
        }}
      >
        ⠿
      </button>
      <SlideEditor
        slide={slide}
        index={index}
        isActive={isActive}
        onClick={onActivate}
        onRemove={onRemove}
      />
    </div>
  );
}

export default function SlideList() {
  const { slides, activeSlideId, addSlide, removeSlide, reorderSlides, setActiveSlide } =
    useCarouselStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSlides(String(active.id), String(over.id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 24 }}>
            {slides.map((slide, index) => (
              <SortableSlide
                key={slide.id}
                slide={slide}
                index={index}
                isActive={activeSlideId === slide.id}
                onActivate={() => setActiveSlide(slide.id)}
                onRemove={() => removeSlide(slide.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={addSlide}
        className="btn-secondary"
        style={{ width: "100%", fontSize: 13, marginTop: 4 }}
      >
        + Adicionar slide
      </button>
    </div>
  );
}
