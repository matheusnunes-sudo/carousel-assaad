import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const PNG_OPTIONS = {
  pixelRatio: 2,
  quality: 1,
  cacheBust: true,
  skipFonts: true, // avoids CORS failure fetching Google Fonts at capture time
};

// Converts a base64 data URL to Blob without using fetch() (which can be
// blocked by CSP on hosted environments like Vercel).
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export async function exportSlide(elementId: string, filename: string): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element #${elementId} not found`);

  const dataUrl = await toPng(node, PNG_OPTIONS);
  const blob = dataUrlToBlob(dataUrl);

  saveAs(blob, filename);
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

    const dataUrl = await toPng(node, PNG_OPTIONS);
    const blob = dataUrlToBlob(dataUrl);
    const padded = String(i + 1).padStart(2, "0");
    zip.file(`slide-${padded}.png`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "carousel.zip");
}

export function getSlideElementId(slideId: string): string {
  return `slide-render-${slideId}`;
}
