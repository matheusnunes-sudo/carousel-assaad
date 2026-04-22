import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";

// Pixel sizes used by Canvas (no "px" suffix)
const FONT_SIZE_PX: Record<string, { title: number; body: number; footer: number }> = {
  small:  { title: 56, body: 36, footer: 28 },
  medium: { title: 72, body: 44, footer: 32 },
  large:  { title: 96, body: 56, footer: 36 },
};

const PADDING = 128; // 64px * 2x pixelRatio

function getFontCSS(family: string, weight: number, size: number): string {
  return `${weight} ${size}px "${family}", sans-serif`;
}

function parseGradient(
  ctx: CanvasRenderingContext2D,
  gradient: string,
  w: number,
  h: number
): CanvasGradient | null {
  // Parse "linear-gradient(135deg, #4F5FE6, #7B8CF8)"
  const match = gradient.match(
    /linear-gradient\(\s*(\d+)deg\s*,\s*(#\w+)\s*,\s*(#\w+)\s*\)/
  );
  if (!match) return null;
  const angle = (parseFloat(match[1]) * Math.PI) / 180;
  const cx = w / 2;
  const cy = h / 2;
  const len = Math.max(w, h);
  const x0 = cx - Math.cos(angle) * len;
  const y0 = cy - Math.sin(angle) * len;
  const x1 = cx + Math.cos(angle) * len;
  const y1 = cy + Math.sin(angle) * len;
  const grd = ctx.createLinearGradient(x0, y0, x1, y1);
  grd.addColorStop(0, match[2]);
  grd.addColorStop(1, match[3]);
  return grd;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (para === "") {
      lines.push("");
      continue;
    }
    const words = para.split(" ");
    let currentLine = words[0] ?? "";
    for (let i = 1; i < words.length; i++) {
      const test = currentLine + " " + words[i];
      if (ctx.measureText(test).width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = test;
      }
    }
    lines.push(currentLine);
  }
  return lines;
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function renderSlideToCanvas(
  slide: Slide,
  style: CarouselStyle,
  profile: UserProfile,
  index: number,
  total: number
): Promise<HTMLCanvasElement> {
  const { width, height } = style.dimensions;
  const scale = 2; // 2x for high-res
  const w = width * scale;
  const h = height * scale;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const isGradient = style.backgroundColor.startsWith("linear-gradient");
  const isAssaadBrand = style.backgroundColor === "#4F5FE6";
  const sizes = FONT_SIZE_PX[style.fontSize] ?? FONT_SIZE_PX.medium;
  const font = style.fontFamily;
  const textAlign = style.textAlign;
  const pad = PADDING;
  const contentWidth = w - pad * 2;

  // --- Background ---
  if (isGradient) {
    const grd = parseGradient(ctx, style.backgroundColor, w, h);
    if (grd) {
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = "#4F5FE6";
    }
  } else {
    ctx.fillStyle = style.backgroundColor;
  }
  ctx.fillRect(0, 0, w, h);

  // --- Decorative elements ---
  if (isAssaadBrand) {
    ctx.beginPath();
    ctx.arc(w - 100, -100, 400, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(123, 140, 248, 0.25)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-60, h + 60, 250, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fill();
  }

  if (isGradient) {
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.2, w * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fill();
  }

  // --- Profile header ---
  let cursorY = pad;
  const avatarSize = 128; // 64px * 2

  // Avatar
  if (profile.avatarUrl) {
    try {
      const img = await loadImage(profile.avatarUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pad + avatarSize / 2, cursorY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, pad, cursorY, avatarSize, avatarSize);
      ctx.restore();
      // Border
      ctx.beginPath();
      ctx.arc(pad + avatarSize / 2, cursorY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = style.textColor;
      ctx.lineWidth = 6;
      ctx.stroke();
    } catch {
      // Draw placeholder on avatar load failure
      drawAvatarPlaceholder(ctx, pad, cursorY, avatarSize, style, profile);
    }
  } else {
    drawAvatarPlaceholder(ctx, pad, cursorY, avatarSize, style, profile);
  }

  // Name + handle text
  const textX = pad + avatarSize + 32;
  ctx.fillStyle = style.textColor;

  if (profile.displayName) {
    ctx.font = getFontCSS(font, 700, 44);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(profile.displayName, textX, cursorY + 16);
  }

  ctx.globalAlpha = 0.7;
  ctx.font = getFontCSS(font, 400, 36);
  ctx.fillText(profile.handle, textX, cursorY + (profile.displayName ? 68 : 46));
  ctx.globalAlpha = 1;

  cursorY += avatarSize + 96;

  // --- Main content ---
  ctx.fillStyle = style.textColor;
  ctx.textAlign = textAlign;
  const textX2 = textAlign === "center" ? w / 2 : pad;

  // Title
  if (slide.title) {
    ctx.font = getFontCSS(font, 700, sizes.title);
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, slide.title, contentWidth);
    const titleLineHeight = sizes.title * 1.2;
    for (const line of titleLines) {
      ctx.fillText(line, textX2, cursorY);
      cursorY += titleLineHeight;
    }
    cursorY += 48;
  }

  // Body
  if (slide.body) {
    ctx.font = getFontCSS(font, 400, sizes.body);
    ctx.textBaseline = "top";
    if (slide.title) ctx.globalAlpha = 0.9;
    const bodyLines = wrapText(ctx, slide.body, contentWidth);
    const bodyLineHeight = sizes.body * 1.65;
    for (const line of bodyLines) {
      ctx.fillText(line, textX2, cursorY);
      cursorY += bodyLineHeight;
    }
    ctx.globalAlpha = 1;
  }

  // --- Footer ---
  const footerY = h - pad;

  if (slide.footer) {
    ctx.font = getFontCSS(font, 400, sizes.footer);
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = style.textColor;
    ctx.fillText(slide.footer, pad, footerY, contentWidth * 0.75);
    ctx.globalAlpha = 1;
  }

  if (style.showSlideNumber) {
    ctx.font = getFontCSS(font, 600, sizes.footer);
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = style.textColor;
    ctx.fillText(`${index + 1}/${total}`, w - pad, footerY);
    ctx.globalAlpha = 1;
  }

  return canvas;
}

function drawAvatarPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: CarouselStyle,
  profile: UserProfile
) {
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 6;
  ctx.stroke();

  const letter = (profile.displayName || profile.handle)[0]?.toUpperCase() ?? "U";
  ctx.fillStyle = style.textColor;
  ctx.font = getFontCSS(style.fontFamily, 700, 48);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, x + size / 2, y + size / 2);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png", 1);
  });
}

export async function exportSlide(
  slide: Slide,
  style: CarouselStyle,
  profile: UserProfile,
  index: number,
  total: number,
  filename: string
): Promise<void> {
  const canvas = await renderSlideToCanvas(slide, style, profile, index, total);
  const blob = await canvasToBlob(canvas);
  saveAs(blob, filename);
}

export async function exportAllSlides(
  slides: Slide[],
  style: CarouselStyle,
  profile: UserProfile,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < slides.length; i++) {
    onProgress?.(i + 1, slides.length);
    const canvas = await renderSlideToCanvas(slides[i], style, profile, i, slides.length);
    const blob = await canvasToBlob(canvas);
    const padded = String(i + 1).padStart(2, "0");
    zip.file(`slide-${padded}.png`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "carousel.zip");
}
