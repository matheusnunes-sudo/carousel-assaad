import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const PNG_OPTIONS = {
  pixelRatio: 2,
  quality: 1,
  cacheBust: true,
  skipFonts: false,
};

// html-to-image fails to embed external fonts on the first call due to CORS.
// Calling twice ensures fonts are cached and the second render is complete.
async function capturePng(node: HTMLElement): Promise<string> {
  await toPng(node, PNG_OPTIONS); // warm up font cache
  return toPng(node, PNG_OPTIONS);
}

export async function exportSlide(elementId: string, filename: string): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element #${elementId} not found`);

  const dataUrl = await capturePng(node);

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

  // Warm up font cache on the first element before looping
  const firstNode = document.getElementById(slideIds[0]);
  if (firstNode) await toPng(firstNode, PNG_OPTIONS);

  for (let i = 0; i < slideIds.length; i++) {
    onProgress?.(i + 1, slideIds.length);

    const node = document.getElementById(slideIds[i]);
    if (!node) continue;

    const dataUrl = await toPng(node, PNG_OPTIONS);
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
