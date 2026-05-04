import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";
import { getFontSizes } from "@/types/carousel";
import { getNarrativeRole } from "@/lib/instagramSlide";
import { drawInstagramSlide } from "@/lib/instagramExport";

const PADDING = 128; // 64px * 2x retina

function css(family: string, weight: number, size: number) {
  return `${weight} ${size}px "${family}", sans-serif`;
}

function parseGradient(ctx: CanvasRenderingContext2D, gradient: string, w: number, h: number): CanvasGradient | null {
  const m = gradient.match(/linear-gradient\(\s*(\d+)deg\s*,\s*(#\w+)\s*,\s*(#\w+)\s*\)/);
  if (!m) return null;
  const angle = (parseFloat(m[1]) * Math.PI) / 180;
  const cx = w / 2, cy = h / 2, len = Math.max(w, h);
  const grd = ctx.createLinearGradient(cx - Math.cos(angle) * len, cy - Math.sin(angle) * len, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
  grd.addColorStop(0, m[2]);
  grd.addColorStop(1, m[3]);
  return grd;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    if (!para) { lines.push(""); continue; }
    const words = para.split(" ");
    let cur = words[0] ?? "";
    for (let i = 1; i < words.length; i++) {
      const test = cur + " " + words[i];
      if (ctx.measureText(test).width > maxWidth) { lines.push(cur); cur = words[i]; }
      else cur = test;
    }
    lines.push(cur);
  }
  return lines;
}

async function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function renderSlide(
  slide: Slide,
  style: CarouselStyle,
  profile: UserProfile,
  index: number,
  total: number
): Promise<HTMLCanvasElement> {
  const { width, height } = style.dimensions;
  const scale = 2;
  const w = width * scale;
  const h = height * scale;

  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // ── Instagram (Assaad) format: dispatch to dedicated renderer ──────────────
  if (style.format === "instagram") {
    const role = getNarrativeRole(index, total);
    await drawInstagramSlide(ctx, slide, role, profile, index, total, style.showSlideNumber);
    return canvas;
  }

  // Font sizes at 2x canvas scale
  const previewSizes = getFontSizes(style.fontSize);
  const sz = {
    title:  previewSizes.title  * scale,
    body:   previewSizes.body   * scale,
    footer: previewSizes.footer * scale,
  };
  const titleLineH = sz.title  * 1.2;
  const bodyLineH  = sz.body   * 1.65;

  const isGradient = style.backgroundColor.startsWith("linear-gradient");
  const pad = PADDING;
  const cw  = w - pad * 2; // content width
  const font = "Inter";

  // Background
  if (isGradient) {
    const grd = parseGradient(ctx, style.backgroundColor, w, h);
    ctx.fillStyle = grd ?? "#15202B";
  } else {
    ctx.fillStyle = style.backgroundColor;
  }
  ctx.fillRect(0, 0, w, h);

  // ── Profile header ──────────────────────────────────────────────────────────
  let curY = pad;
  const avatarSize = 128;

  if (profile.avatarUrl) {
    try {
      const img = await loadImg(profile.avatarUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pad + avatarSize / 2, curY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, pad, curY, avatarSize, avatarSize);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(pad + avatarSize / 2, curY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = style.textColor; ctx.lineWidth = 6; ctx.stroke();
    } catch {
      drawAvatarPlaceholder(ctx, pad, curY, avatarSize, style, profile, font);
    }
  } else {
    drawAvatarPlaceholder(ctx, pad, curY, avatarSize, style, profile, font);
  }

  const nameX = pad + avatarSize + 32;
  ctx.fillStyle = style.textColor;
  if (profile.displayName) {
    ctx.font = css(font, 700, 44); ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText(profile.displayName, nameX, curY + 16);
  }
  ctx.globalAlpha = 0.7;
  ctx.font = css(font, 400, 36);
  ctx.fillText(profile.handle, nameX, curY + (profile.displayName ? 68 : 46));
  ctx.globalAlpha = 1;

  const headerBottom = curY + avatarSize + 64;

  // ── Image area ──────────────────────────────────────────────────────────────
  let imageBottom = headerBottom;
  if (style.withImages) {
    const ih = Math.round(h * 0.35);
    const ix = pad, iy = headerBottom, iw = cw, r = 24;

    if (slide.imageUrl) {
      try {
        const img = await loadImg(slide.imageUrl);
        ctx.save();
        roundedRect(ctx, ix, iy, iw, ih, r);
        ctx.clip();
        const ir = img.width / img.height, ar = iw / ih;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (ir > ar) { sw = img.height * ar; sx = (img.width - sw) / 2; }
        else          { sh = img.width / ar;  sy = (img.height - sh) / 2; }
        ctx.drawImage(img, sx, sy, sw, sh, ix, iy, iw, ih);
        ctx.restore();
      } catch {
        drawImagePlaceholder(ctx, ix, iy, iw, ih, style, r);
      }
    } else {
      drawImagePlaceholder(ctx, ix, iy, iw, ih, style, r);
    }
    imageBottom = headerBottom + ih + 48;
  }

  // ── Content (vertically centred) ────────────────────────────────────────────
  const footerZone = sz.footer * 2 + 32;
  const areaTop    = imageBottom;
  const areaBot    = h - pad - footerZone;
  const areaH      = areaBot - areaTop;

  ctx.font = css(font, 700, sz.title);
  const titleLines = slide.title ? wrapText(ctx, slide.title, cw) : [];
  ctx.font = css(font, 400, sz.body);
  const bodyLines  = slide.body  ? wrapText(ctx, slide.body,  cw) : [];

  const titleBlockH = titleLines.length > 0 ? titleLines.length * titleLineH + 48 : 0;
  const bodyBlockH  = bodyLines.length * bodyLineH;
  const totalH      = titleBlockH + bodyBlockH;

  curY = areaTop + Math.max(0, (areaH - totalH) / 2);

  ctx.fillStyle = style.textColor;
  ctx.textAlign = "left";

  if (titleLines.length > 0) {
    ctx.font = css(font, 700, sz.title); ctx.textBaseline = "top";
    for (const line of titleLines) { ctx.fillText(line, pad, curY); curY += titleLineH; }
    curY += 48;
  }
  if (bodyLines.length > 0) {
    ctx.font = css(font, 400, sz.body); ctx.textBaseline = "top";
    if (titleLines.length > 0) ctx.globalAlpha = 0.9;
    for (const line of bodyLines) { ctx.fillText(line, pad, curY); curY += bodyLineH; }
    ctx.globalAlpha = 1;
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const fy = h - pad;
  if (slide.footer) {
    ctx.font = css(font, 400, sz.footer); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    ctx.globalAlpha = 0.6; ctx.fillStyle = style.textColor;
    ctx.fillText(slide.footer, pad, fy, cw * 0.75);
    ctx.globalAlpha = 1;
  }
  if (style.showSlideNumber) {
    ctx.font = css(font, 600, sz.footer); ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    ctx.globalAlpha = 0.7; ctx.fillStyle = style.textColor;
    ctx.fillText(`${index + 1}/${total}`, w - pad, fy);
    ctx.globalAlpha = 1;
  }

  return canvas;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawAvatarPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: CarouselStyle, profile: UserProfile, font: string) {
  ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 6; ctx.stroke();
  const letter = (profile.displayName || profile.handle)[0]?.toUpperCase() ?? "U";
  ctx.fillStyle = style.textColor; ctx.font = `700 48px "${font}", sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(letter, x + size / 2, y + size / 2);
}

function drawImagePlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, style: CarouselStyle, r: number) {
  ctx.save();
  roundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fill();
  ctx.strokeStyle = style.textColor + "30"; ctx.lineWidth = 3;
  ctx.setLineDash([16, 12]); ctx.stroke(); ctx.setLineDash([]);
  const cx = x + w / 2, cy = y + h / 2;
  ctx.strokeStyle = style.textColor + "50"; ctx.lineWidth = 6;
  ctx.strokeRect(cx - 48, cy - 40, 96, 80);
  ctx.beginPath(); ctx.arc(cx - 20, cy - 12, 14, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 48, cy + 40); ctx.lineTo(cx - 10, cy); ctx.lineTo(cx + 20, cy + 24); ctx.lineTo(cx + 40, cy + 8); ctx.lineTo(cx + 48, cy + 20); ctx.stroke();
  ctx.restore();
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/png", 1));
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function exportSlide(slide: Slide, style: CarouselStyle, profile: UserProfile, index: number, total: number, filename: string): Promise<void> {
  const canvas = await renderSlide(slide, style, profile, index, total);
  saveAs(await toBlob(canvas), filename);
}

export async function exportAllSlides(slides: Slide[], style: CarouselStyle, profile: UserProfile, onProgress?: (c: number, t: number) => void): Promise<void> {
  const zip = new JSZip();
  for (let i = 0; i < slides.length; i++) {
    onProgress?.(i + 1, slides.length);
    const canvas = await renderSlide(slides[i], style, profile, i, slides.length);
    zip.file(`slide-${String(i + 1).padStart(2, "0")}.png`, await toBlob(canvas));
  }
  saveAs(await zip.generateAsync({ type: "blob" }), "carousel.zip");
}
