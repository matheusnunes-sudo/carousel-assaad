export interface ParsedSlide {
  title: string;
  body: string;
}

/**
 * Parse raw user text into slides.
 *
 * Supports two formats:
 *   Numbered  →  "1 - text", "2 - text", …  (each number = one slide)
 *   Free text →  paragraphs separated by blank lines, or one line per slide
 *
 * Within each block: first line = title (if multiple lines), rest = body.
 */
export function parseContent(raw: string): ParsedSlide[] {
  const text = raw.trim();
  if (!text) return [];

  // ── Numbered format ─────────────────────────────────────────────────────────
  // Detects lines starting with:  1 -   1.   1)
  if (/^\d+\s*[-.)]\s*.+/m.test(text)) {
    return text
      .split(/\n(?=\d+\s*[-.)]\s*)/)          // split before each number
      .map(part => part.replace(/^\d+\s*[-.)]\s*/, '').trim())
      .filter(Boolean)
      .map(block => linesToSlide(block.split('\n')));
  }

  // ── Paragraph format (blank lines between blocks) ───────────────────────────
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  if (blocks.length > 1) {
    return blocks.map(block => linesToSlide(block.split('\n')));
  }

  // ── Single-line-per-slide (no blank separators) ─────────────────────────────
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
