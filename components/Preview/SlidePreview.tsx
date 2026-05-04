"use client";

import { CSSProperties, forwardRef } from "react";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";
import { getFontSizes, FONT_FAMILY } from "@/types/carousel";
import InstagramSlidePreview from "./InstagramSlidePreview";

interface SlidePreviewProps {
  slide: Slide;
  style: CarouselStyle;
  profile: UserProfile;
  index: number;
  total: number;
}

const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(
  ({ slide, style, profile, index, total }, _ref) => {

    // ── Instagram (Assaad brand) format ────────────────────────────────────
    if (style.format === "instagram") {
      return <InstagramSlidePreview slide={slide} style={style} profile={profile} index={index} total={total} />;
    }

    // ── Twitter Thread (default/legacy) format ─────────────────────────────
    const { width, height } = style.dimensions;
    const fs  = getFontSizes(style.fontSize);
    const isGradient  = style.backgroundColor.startsWith("linear-gradient");
    const hasImage    = style.withImages;
    const imageHeight = Math.round(height * 0.35);

    const container: CSSProperties = {
      width, height,
      position: "relative",
      overflow: "hidden",
      fontFamily: FONT_FAMILY,
      color: style.textColor,
      display: "flex",
      flexDirection: "column",
      padding: 64,
      background: isGradient ? style.backgroundColor : undefined,
      backgroundColor: !isGradient ? style.backgroundColor : undefined,
    };

    return (
      <div style={container}>

        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: hasImage ? 24 : 48, flexShrink: 0, position: "relative", zIndex: 1 }}>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={profile.displayName} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `3px solid ${style.textColor}`, flexShrink: 0 }} />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: style.textColor, border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>
              {(profile.displayName || profile.handle)[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            {profile.displayName && (
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: style.textColor }}>{profile.displayName}</div>
            )}
            <div style={{ fontSize: 18, opacity: 0.7, color: style.textColor }}>{profile.handle}</div>
          </div>
        </div>

        {/* Image area */}
        {hasImage && (
          <div style={{ flexShrink: 0, marginBottom: 20, height: imageHeight, borderRadius: 12, overflow: "hidden", position: "relative", zIndex: 1 }}>
            {slide.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.08)", border: `1px dashed ${style.textColor}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`${style.textColor}50`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left", position: "relative", zIndex: 1, overflow: "hidden" }}>
          {slide.title && (
            <div style={{ fontSize: fs.title, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: style.textColor }}>
              {slide.title}
            </div>
          )}
          {slide.body && (
            <div style={{ fontSize: fs.body, lineHeight: 1.65, whiteSpace: "pre-wrap", color: style.textColor, opacity: slide.title ? 0.9 : 1 }}>
              {slide.body}
            </div>
          )}
          {!slide.title && !slide.body && (
            <div style={{ fontSize: fs.body, opacity: 0.3, color: style.textColor }}>Slide vazio</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1, marginTop: 24, flexShrink: 0 }}>
          <div style={{ fontSize: fs.footer, opacity: 0.6, color: style.textColor, maxWidth: "75%" }}>{slide.footer}</div>
          {style.showSlideNumber && (
            <div style={{ fontSize: fs.footer, fontWeight: 600, opacity: 0.7, color: style.textColor }}>{index + 1}/{total}</div>
          )}
        </div>

      </div>
    );
  }
);

SlidePreview.displayName = "SlidePreview";
export default SlidePreview;

export function SlidePreviewScaled({
  slide, style, profile, index, total,
  scale = 1, onClick, isActive,
}: SlidePreviewProps & { scale?: number; onClick?: () => void; isActive?: boolean }) {
  const { width, height } = style.dimensions;

  return (
    <div className="relative cursor-pointer" onClick={onClick} style={{ width: width * scale, height: height * scale }}>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: "0 0 0 3px #4F5FE6", borderRadius: 8 }} />
      )}
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width, height, borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
        <SlidePreview slide={slide} style={style} profile={profile} index={index} total={total} />
      </div>
    </div>
  );
}
