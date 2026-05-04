import type { Slide, UserProfile } from "@/types/carousel";
import {
  ASSAAD,
  GRADIENT_PRIMARY,
  GRADIENT_ENERGY,
  ROLE_BG,
  type NarrativeRole,
} from "@/lib/instagramSlide";

/* ── helpers ─────────────────────────────────────────────────────────────── */

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function font(family: string, weight: number, size: number) {
  return `${weight} ${size}px "${family}", sans-serif`;
}

/** Wrap text to lines that fit `maxWidth`, returns array of lines. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    if (!para.trim()) { lines.push(""); continue; }
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

/** Draw multi-line text. Returns the y just after the last line. */
function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number, maxWidth: number,
  lineHeight: number, color: string,
  alpha = 1
): number {
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.textBaseline = "top";
  const lines = wrap(ctx, text, maxWidth);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  ctx.globalAlpha = 1;
  return y;
}

function fillBackground(ctx: CanvasRenderingContext2D, role: NarrativeRole, w: number, h: number) {
  const bg = ROLE_BG[role];

  if (bg === GRADIENT_PRIMARY) {
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, ASSAAD.bluePrimary);
    grd.addColorStop(1, ASSAAD.blueLight);
    ctx.fillStyle = grd;
  } else if (bg === GRADIENT_ENERGY) {
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, ASSAAD.orange);
    grd.addColorStop(1, ASSAAD.red);
    ctx.fillStyle = grd;
  } else {
    ctx.fillStyle = bg;
  }
  ctx.fillRect(0, 0, w, h);
}

/* ── header (handle + circular "A") ──────────────────────────────────────── */

function drawHeader(
  ctx: CanvasRenderingContext2D,
  profile: UserProfile,
  pad: number,
  scale: number,
  textColor: string,
  isLight: boolean,
) {
  const fam = "Inter";
  const handleSize = 22 * scale;
  const yHandle = pad + 12 * scale;

  // Handle (top-left)
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.7;
  ctx.font = font(fam, 600, handleSize);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(profile.handle, pad, yHandle);
  ctx.globalAlpha = 1;

  // Circular "A" logo (top-right)
  const logoSize = 52 * scale;
  const logoX = ctx.canvas.width - pad - logoSize;
  const logoY = pad;

  if (isLight) {
    // Light bg: solid blue circle, white "A"
    ctx.fillStyle = ASSAAD.bluePrimary;
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ASSAAD.white;
  } else {
    // Dark/colored bg: semi-transparent white circle, white "A"
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = textColor;
  }
  ctx.font = font(fam, 800, 26 * scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A", logoX + logoSize / 2, logoY + logoSize / 2 + 1 * scale);
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
}

/* ── footer (page number) ─────────────────────────────────────────────────── */

function drawPageNumber(
  ctx: CanvasRenderingContext2D,
  index: number, total: number,
  pad: number, scale: number,
  textColor: string,
  alpha: number,
) {
  ctx.font = font("Inter", 600, 18 * scale);
  ctx.fillStyle = textColor;
  ctx.globalAlpha = alpha;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(`${index + 1}/${total}`, ctx.canvas.width - pad, ctx.canvas.height - pad);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
}

/* ── pill badge ───────────────────────────────────────────────────────────── */

function drawPill(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number, scale: number,
  bg: string, color: string,
): { width: number; height: number } {
  const fam = "Inter";
  const fontSize = 16 * scale;
  ctx.font = font(fam, 600, fontSize);
  const padX = 20 * scale;
  const padY = 8 * scale;
  const upper = text.toUpperCase();
  const measured = ctx.measureText(upper);
  // Add letter-spacing simulation: increase width slightly
  const tracking = upper.length * (fontSize * 0.06);
  const w = measured.width + tracking + padX * 2;
  const h = fontSize * 1.4 + padY * 2;
  ctx.fillStyle = bg;
  rect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = color;
  // Render text with manual letter-spacing
  ctx.textBaseline = "middle";
  let cx = x + padX;
  for (const ch of upper) {
    ctx.fillText(ch, cx, y + h / 2);
    cx += ctx.measureText(ch).width + fontSize * 0.06;
  }
  ctx.textBaseline = "top";
  return { width: w, height: h };
}

/* ── per-role renderers ───────────────────────────────────────────────────── */

interface DrawCtx {
  ctx: CanvasRenderingContext2D;
  slide: Slide;
  profile: UserProfile;
  pad: number;
  scale: number;
  contentX: number;
  contentY: number;
  contentW: number;
  contentH: number;
}

function drawGancho({ ctx, slide, pad, scale, contentX, contentY, contentW, contentH }: DrawCtx) {
  const fam = "Inter";
  // Tag
  let y = contentY + Math.max(0, (contentH - 600 * scale) / 2);
  const pill = drawPill(ctx, "ENEM 2026", contentX, y, scale, "rgba(255,255,255,0.20)", ASSAAD.white);
  y += pill.height + 32 * scale;

  // Title
  if (slide.title) {
    ctx.font = font(fam, 800, 88 * scale);
    y = drawWrapped(ctx, slide.title, contentX, y, contentW, 88 * 1.05 * scale, ASSAAD.white, 1);
    y += 24 * scale;
  }
  // Body
  if (slide.body) {
    ctx.font = font(fam, 400, 28 * scale);
    drawWrapped(ctx, slide.body, contentX, y, contentW, 28 * 1.45 * scale, ASSAAD.white, 0.85);
  }
  // Suppress unused-vars warning
  void pad;
}

function drawDado({ ctx, slide, pad, scale, contentX, contentY, contentW, contentH }: DrawCtx) {
  const fam = "Inter";
  let y = contentY + Math.max(0, (contentH - 500 * scale) / 2);
  // Big red number (title)
  if (slide.title) {
    ctx.font = font(fam, 900, 280 * scale);
    ctx.fillStyle = ASSAAD.red;
    ctx.textBaseline = "top";
    ctx.fillText(slide.title, contentX, y);
    y += 280 * 0.95 * scale;
  }
  // Subtitle (body)
  if (slide.body) {
    y += 16 * scale;
    ctx.font = font(fam, 700, 36 * scale);
    y = drawWrapped(ctx, slide.body, contentX, y, contentW, 36 * 1.2 * scale, ASSAAD.white, 1);
  }
  // Footer text (caption)
  if (slide.footer) {
    y += 8 * scale;
    ctx.font = font(fam, 400, 22 * scale);
    drawWrapped(ctx, slide.footer, contentX, y, contentW, 22 * 1.4 * scale, ASSAAD.white, 0.6);
  }
  void pad;
}

function drawProblema({ ctx, slide, pad, scale, contentX, contentY, contentW, contentH }: DrawCtx) {
  const fam = "Inter";
  let y = contentY + Math.max(0, (contentH - 500 * scale) / 2);
  // Magenta accent bar
  ctx.fillStyle = ASSAAD.magenta;
  rect(ctx, contentX, y, 6 * scale, 96 * scale, 3 * scale);
  ctx.fill();
  y += 96 * scale + 24 * scale;
  // Title
  if (slide.title) {
    ctx.font = font(fam, 800, 72 * scale);
    y = drawWrapped(ctx, slide.title, contentX, y, contentW, 72 * 1.1 * scale, ASSAAD.dark, 1);
    y += 24 * scale;
  }
  // Body
  if (slide.body) {
    ctx.font = font(fam, 400, 28 * scale);
    drawWrapped(ctx, slide.body, contentX, y, contentW, 28 * 1.5 * scale, ASSAAD.gray500, 1);
  }
  void pad;
}

function drawSolucao({ ctx, slide, pad, scale, contentX, contentY, contentW, contentH }: DrawCtx) {
  const fam = "Inter";
  let y = contentY + Math.max(0, (contentH - 600 * scale) / 2);
  const pill = drawPill(ctx, "A SOLUÇÃO", contentX, y, scale, "rgba(255,255,255,0.20)", ASSAAD.white);
  y += pill.height + 32 * scale;
  if (slide.title) {
    ctx.font = font(fam, 800, 80 * scale);
    y = drawWrapped(ctx, slide.title, contentX, y, contentW, 80 * 1.05 * scale, ASSAAD.white, 1);
    y += 24 * scale;
  }
  if (slide.body) {
    ctx.font = font(fam, 400, 28 * scale);
    drawWrapped(ctx, slide.body, contentX, y, contentW, 28 * 1.5 * scale, ASSAAD.white, 0.9);
  }
  void pad;
}

function drawFeatures({ ctx, slide, pad, scale, contentX, contentY, contentW, contentH }: DrawCtx) {
  const fam = "Inter";
  const items = (slide.body ?? "").split("\n").map(s => s.trim()).filter(Boolean);
  const itemH = 60 * scale;
  const gap = 18 * scale;
  const titleH = slide.title ? 52 * scale + 28 * scale : 0;
  const totalH = titleH + items.length * (itemH + gap);
  let y = contentY + Math.max(0, (contentH - totalH) / 2);

  if (slide.title) {
    ctx.font = font(fam, 800, 44 * scale);
    y = drawWrapped(ctx, slide.title, contentX, y, contentW, 44 * 1.15 * scale, ASSAAD.white, 1);
    y += 28 * scale;
  }

  for (const item of items) {
    // + circle
    const cx = contentX + 22 * scale;
    const cy = y + itemH / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 22 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.20)";
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.fillStyle = ASSAAD.white;
    ctx.font = font(fam, 700, 28 * scale);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("+", cx, cy + 1 * scale);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    // Item label
    ctx.font = font(fam, 500, 26 * scale);
    ctx.fillStyle = ASSAAD.white;
    ctx.fillText(item, contentX + 64 * scale, y + (itemH - 26 * scale) / 2);
    y += itemH + gap;
  }
  void pad;
}

function drawProva({ ctx, slide, pad, scale, contentX, contentY, contentW, contentH }: DrawCtx) {
  const fam = "Inter";
  let y = contentY + Math.max(0, (contentH - 600 * scale) / 2);
  if (slide.title) {
    ctx.font = font(fam, 800, 56 * scale);
    y = drawWrapped(ctx, slide.title, contentX, y, contentW, 56 * 1.1 * scale, ASSAAD.white, 1);
    y += 28 * scale;
  }
  if (slide.body) {
    // Testimonial box
    ctx.font = font(fam, 500, 26 * scale);
    const lines = wrap(ctx, slide.body, contentW - 72 * scale);
    const boxPadX = 36 * scale, boxPadY = 32 * scale;
    const boxH = lines.length * 26 * 1.5 * scale + boxPadY * 2;
    rect(ctx, contentX, y, contentW, boxH, 20 * scale);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    // Render quote with smart quotes
    let displayBody = slide.body;
    if (!displayBody.startsWith("“") && !displayBody.startsWith("\"")) {
      displayBody = `“${displayBody}”`;
    }
    const quoteLines = wrap(ctx, displayBody, contentW - 72 * scale);
    let qy = y + boxPadY;
    ctx.fillStyle = ASSAAD.white;
    for (const line of quoteLines) {
      ctx.fillText(line, contentX + boxPadX, qy);
      qy += 26 * 1.5 * scale;
    }
    y += boxH + 16 * scale;
  }
  if (slide.footer) {
    ctx.font = font(fam, 600, 20 * scale);
    drawWrapped(ctx, `— ${slide.footer}`, contentX, y, contentW, 20 * 1.3 * scale, ASSAAD.white, 0.85);
  }
  void pad;
}

function drawCta({ ctx, slide, profile, pad, scale, contentX, contentY, contentW, contentH }: DrawCtx) {
  const fam = "Inter";
  let y = contentY + Math.max(0, (contentH - 600 * scale) / 2);

  if (slide.title) {
    ctx.font = font(fam, 800, 84 * scale);
    y = drawWrapped(ctx, slide.title, contentX, y, contentW, 84 * 1.05 * scale, ASSAAD.white, 1);
    y += 24 * scale;
  }
  if (slide.body) {
    ctx.font = font(fam, 400, 28 * scale);
    y = drawWrapped(ctx, slide.body, contentX, y, contentW, 28 * 1.45 * scale, ASSAAD.white, 0.9);
    y += 16 * scale;
  }

  // CTA button
  const ctaText = slide.footer || "Acesse a plataforma";
  ctx.font = font(fam, 700, 28 * scale);
  const labelMeasured = ctx.measureText(`${ctaText} →`);
  const btnPadX = 36 * scale, btnPadY = 20 * scale;
  const btnW = labelMeasured.width + btnPadX * 2;
  const btnH = 28 * scale + btnPadY * 2;
  rect(ctx, contentX, y, btnW, btnH, 14 * scale);
  // Soft shadow
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = ASSAAD.white;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = ASSAAD.bluePrimary;
  ctx.textBaseline = "middle";
  ctx.fillText(`${ctaText} →`, contentX + btnPadX, y + btnH / 2);
  ctx.textBaseline = "top";
  y += btnH + 24 * scale;

  // Link na bio · @handle
  ctx.font = font(fam, 500, 18 * scale);
  ctx.fillStyle = ASSAAD.white;
  ctx.globalAlpha = 0.75;
  ctx.fillText(`Link na bio · ${profile.handle}`, contentX, y);
  ctx.globalAlpha = 1;
  void pad;
}

const RENDERERS: Record<NarrativeRole, (d: DrawCtx) => void> = {
  gancho:   drawGancho,
  dado:     drawDado,
  problema: drawProblema,
  solucao:  drawSolucao,
  features: drawFeatures,
  prova:    drawProva,
  cta:      drawCta,
};

/* ── public entry point ───────────────────────────────────────────────────── */

export async function drawInstagramSlide(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  role: NarrativeRole,
  profile: UserProfile,
  index: number,
  total: number,
  showSlideNumber: boolean,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const scale = w / 1080; // base layout designed at 1080px
  const pad = 64 * scale;

  // Background
  fillBackground(ctx, role, w, h);

  // Decide chrome (handle + page number) color based on role
  const isLightBg = role === "problema";
  const chromeColor = isLightBg ? ASSAAD.gray500 : ASSAAD.white;
  const chromeAlpha = isLightBg ? 0.6 : 0.55;

  // Header (handle + circle "A")
  drawHeader(ctx, profile, pad, scale, chromeColor, isLightBg);

  // Content area is below the header (~64 + 64 = 128 padding from top)
  const headerH = 60 * scale + 24 * scale;
  const contentX = pad;
  const contentY = pad + headerH;
  const contentW = w - pad * 2;
  const contentH = h - contentY - pad - 40 * scale; // leave room for page number

  RENDERERS[role]({ ctx, slide, profile, pad, scale, contentX, contentY, contentW, contentH });

  // Page number (footer)
  if (showSlideNumber) {
    drawPageNumber(ctx, index, total, pad, scale, chromeColor, chromeAlpha);
  }
}
