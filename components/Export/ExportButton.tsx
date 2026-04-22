"use client";

import { useState } from "react";
import { useCarouselStore } from "@/lib/store";
import { exportSlide, exportAllSlides, getSlideElementId } from "@/lib/export";
import Button from "@/components/ui/Button";

export function ExportSingleButton({ slideId, index }: { slideId: string; index: number }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const padded = String(index + 1).padStart(2, "0");
      await exportSlide(getSlideElementId(slideId), `slide-${padded}.png`);
    } catch (err) {
      console.error("Erro ao exportar slide:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      title="Exportar este slide como PNG"
    >
      {loading ? "..." : "↓ PNG"}
    </Button>
  );
}

export function ExportAllButton() {
  const { slides } = useCarouselStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExportAll = async () => {
    setLoading(true);
    setProgress(0);
    try {
      const slideIds = slides.map((s) => s.id);
      await exportAllSlides(slideIds, (current, total) => {
        setProgress(Math.round((current / total) * 100));
      });
    } catch (err) {
      console.error("Erro ao exportar carrossel:", err);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleExportAll}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {progress}%
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar tudo
        </>
      )}
    </Button>
  );
}
