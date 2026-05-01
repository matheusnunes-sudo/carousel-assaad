"use client";

import { useState } from "react";
import { useCarouselStore } from "@/lib/store";
import { exportAllSlides } from "@/lib/export";

export function ExportAllButton() {
  const { slides, style, profile } = useCarouselStore();
  const [loading, setLoading]     = useState(false);
  const [progress, setProgress]   = useState(0);

  const handleExportAll = async () => {
    setLoading(true);
    setProgress(0);
    try {
      await exportAllSlides(slides, style, profile, (current, total) => {
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
    <button
      onClick={handleExportAll}
      disabled={loading}
      className="btn-primary"
      style={{ fontSize: 13, padding: "7px 18px", gap: 6, display: "inline-flex", alignItems: "center" }}
    >
      {loading ? (
        <>
          <span
            style={{
              display: "inline-block", width: 12, height: 12,
              border: "2px solid rgba(255,255,255,0.4)",
              borderTopColor: "white", borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          {progress}%
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
