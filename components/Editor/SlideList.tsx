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
import Button from "@/components/ui/Button";
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
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        title="Arrastar para reordenar"
        className="absolute -left-1 top-1/2 -translate-y-1/2 -translate-x-full w-5 h-10 flex items-center justify-center text-assaad-gray-200 hover:text-assaad-gray-500 cursor-grab active:cursor-grabbing transition-colors"
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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSlides(String(active.id), String(over.id));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={slides.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 pl-6">
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

      <Button
        variant="outline"
        onClick={addSlide}
        className="w-full"
      >
        + Adicionar slide
      </Button>
    </div>
  );
}
