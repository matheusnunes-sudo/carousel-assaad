import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function exportSlide(elementId: string, filename: string): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element #${elementId} not found`);

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    quality: 1,
    skipFonts: false,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function exportAllSlides(
  slideIds: string[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < slideIds.length; i++) {
    onProgress?.(i + 1, slideIds.length);

    const node = document.getElementById(slideIds[i]);
    if (!node) continue;

    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      quality: 1,
      skipFonts: false,
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const padded = String(i + 1).padStart(2, "0");
    zip.file(`slide-${padded}.png`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "carousel.zip");
}

export function getSlideElementId(slideId: string): string {
  return `slide-render-${slideId}`;
}
