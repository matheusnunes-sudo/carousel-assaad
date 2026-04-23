"use client";

import { CSSProperties, forwardRef } from "react";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";
import { FONT_SIZE_MAP, FONT_FAMILY_MAP } from "@/types/carousel";

interface SlidePreviewProps {
  slide: Slide;
  style: CarouselStyle;
  profile: UserProfile;
  index: number;
  total: number;
  scale?: number;
}

const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(
  ({ slide, style, profile, index, total }, _ref) => {
    const { width, height } = style.dimensions;
    const fontSizes = FONT_SIZE_MAP[style.fontSize];
    const fontFamily = FONT_FAMILY_MAP[style.fontFamily];
    const isGradient = style.backgroundColor.startsWith("linear-gradient");
    const hasImage = style.withImages;
    const imageHeight = Math.round(height * 0.35);

    const containerStyle: CSSProperties = {
      width,
      height,
      position: "relative",
      overflow: "hidden",
      fontFamily,
      color: style.textColor,
      display: "flex",
      flexDirection: "column",
      padding: "64px",
      background: isGradient ? style.backgroundColor : undefined,
      backgroundColor: !isGradient ? style.backgroundColor : undefined,
    };

    const isAssaadBrand = style.backgroundColor === "#4F5FE6";

    return (
      <div style={containerStyle}>
        {/* Decorative — Assaad brand */}
        {isAssaadBrand && (
          <>
            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(123,140,248,0.25)" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          </>
        )}

        {/* Decorative — gradient */}
        {isGradient && (
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
        )}

        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: hasImage ? "28px" : "48px", position: "relative", zIndex: 1, flexShrink: 0 }}>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `3px solid ${style.textColor}`, flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: style.textColor, border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>
              {(profile.displayName || profile.handle)[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            {profile.displayName && (
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: style.textColor }}>
                {profile.displayName}
              </div>
            )}
            <div style={{ fontSize: 18, fontWeight: 400, opacity: 0.7, color: style.textColor }}>
              {profile.handle}
            </div>
          </div>
        </div>

        {/* Image area */}
        {hasImage && (
          <div style={{ flexShrink: 0, marginBottom: "20px", position: "relative", zIndex: 1, height: imageHeight, borderRadius: 12, overflow: "hidden" }}>
            {slide.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.08)", border: `1px dashed ${style.textColor}40`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`${style.textColor}60`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {slide.imagePrompt && (
                  <p style={{ fontSize: 11, color: `${style.textColor}50`, textAlign: "center", lineHeight: 1.4, maxWidth: "80%" }}>
                    {slide.imagePrompt}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: style.textAlign, position: "relative", zIndex: 1, overflow: "hidden" }}>
          {slide.title && (
            <div style={{ fontSize: fontSizes.title, fontWeight: 700, lineHeight: 1.2, marginBottom: "16px", color: style.textColor }}>
              {slide.title}
            </div>
          )}
          {slide.body && (
            <div style={{ fontSize: fontSizes.body, fontWeight: 400, lineHeight: 1.65, whiteSpace: "pre-wrap", color: style.textColor, opacity: slide.title ? 0.9 : 1 }}>
              {slide.body}
            </div>
          )}
          {!slide.title && !slide.body && (
            <div style={{ fontSize: fontSizes.body, opacity: 0.3, color: style.textColor }}>
              Slide vazio
            </div>
          )}
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1, marginTop: "24px", flexShrink: 0 }}>
          <div style={{ fontSize: fontSizes.footer, opacity: 0.6, color: style.textColor, maxWidth: "75%" }}>
            {slide.footer}
          </div>
          {style.showSlideNumber && (
            <div style={{ fontSize: fontSizes.footer, fontWeight: 600, opacity: 0.7, color: style.textColor }}>
              {index + 1}/{total}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SlidePreview.displayName = "SlidePreview";
export default SlidePreview;

/* Scaled wrapper for display in the UI */
export function SlidePreviewScaled({
  slide,
  style,
  profile,
  index,
  total,
  scale = 1,
  onClick,
  isActive,
}: SlidePreviewProps & { onClick?: () => void; isActive?: boolean }) {
  const { width, height } = style.dimensions;

  return (
    <div
      className="relative cursor-pointer group"
      onClick={onClick}
      style={{ width: width * scale, height: height * scale }}
    >
      {isActive && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none z-10"
          style={{ boxShadow: "0 0 0 3px #4F5FE6", borderRadius: 8 }}
        />
      )}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width,
          height,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        <SlidePreview
          slide={slide}
          style={style}
          profile={profile}
          index={index}
          total={total}
        />
      </div>
    </div>
  );
}
