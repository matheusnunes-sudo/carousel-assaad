export interface ParsedSlide {
  title: string;
  body: string;
}

/**
 * Parse raw user text into slides.
 *
 * Supported formats (auto-detected):
 *   "Slide 1: text"  /  "Slide 1 - text"
 *   "1 - text"  /  "1. text"  /  "1) text"
 *   Paragraphs separated by blank lines
 *   One line per slide (fallback)
 */
export function parseContent(raw: string): ParsedSlide[] {
  const text = raw.trim();
  if (!text) return [];

  // ── "Slide N:" / "Slide N -" format (Portuguese style) ──────────────────────
  // e.g. "Slide 1: texto"  or  "Slide 2 - texto"
  if (/^slide\s*\d+\s*[:.-]/im.test(text)) {
    return text
      .split(/\n(?=slide\s*\d+\s*[:.-])/i)
      .map(part => part.replace(/^slide\s*\d+\s*[:.-]\s*/i, '').trim())
      .filter(Boolean)
      .map(block => linesToSlide(block.split('\n')));
  }

  // ── "1 -" / "1." / "1)" numeric format ─────────────────────────────────────
  if (/^\d+\s*[-.)]\s*.+/m.test(text)) {
    return text
      .split(/\n(?=\d+\s*[-.)]\s*)/)
      .map(part => part.replace(/^\d+\s*[-.)]\s*/, '').trim())
      .filter(Boolean)
      .map(block => linesToSlide(block.split('\n')));
  }

  // ── Paragraph format (blank lines between blocks) ───────────────────────────
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  if (blocks.length > 1) {
    return blocks.map(block => linesToSlide(block.split('\n')));
  }

  // ── Single line per slide (newline-separated, no blanks) ────────────────────
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [{ title: '', body: text }];
  return lines.map(line => ({ title: '', body: line }));
}

function linesToSlide(rawLines: string[]): ParsedSlide {
  const lines = rawLines.map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: '', body: '' };
  if (lines.length === 1) return { title: '', body: lines[0] };
  return { title: lines[0], body: lines.slice(1).join('\n') };
}
