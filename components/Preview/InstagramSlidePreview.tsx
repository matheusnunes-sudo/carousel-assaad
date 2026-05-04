"use client";

import { CSSProperties } from "react";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";
import { FONT_FAMILY } from "@/types/carousel";
import {
  ASSAAD,
  ROLE_BG,
  ROLE_FG,
  getNarrativeRole,
  type NarrativeRole,
} from "@/lib/instagramSlide";

interface Props {
  slide: Slide;
  style: CarouselStyle;
  profile: UserProfile;
  index: number;
  total: number;
}

const PADDING = 64;

/* ── shared primitives ─────────────────────────────────────────────────── */

function Header({ profile, color, opacity = 1 }: { profile: UserProfile; color: string; opacity?: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0, position: "relative", zIndex: 2,
    }}>
      <span style={{ fontSize: 22, fontWeight: 600, color, opacity, letterSpacing: "-0.01em" }}>
        {profile.handle}
      </span>
      <Logo color={color} />
    </div>
  );
}

function Logo({ color }: { color: string }) {
  // Circular "A" badge — Assaad logo placeholder
  const isLight = color === ASSAAD.dark;
  const bg     = isLight ? ASSAAD.bluePrimary : "rgba(255,255,255,0.18)";
  const text   = isLight ? ASSAAD.white       : color;
  return (
    <div style={{
      width: 52, height: 52,
      borderRadius: "50%",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 26, fontWeight: 800, color: text,
      letterSpacing: "-0.02em",
    }}>
      A
    </div>
  );
}

function Footer({ index, total, color, opacity = 0.55 }: { index: number; total: number; color: string; opacity?: number }) {
  return (
    <div style={{
      display: "flex", justifyContent: "flex-end",
      flexShrink: 0, position: "relative", zIndex: 2,
    }}>
      <span style={{ fontSize: 18, fontWeight: 600, color, opacity, letterSpacing: "-0.01em" }}>
        {index + 1}/{total}
      </span>
    </div>
  );
}

function Pill({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      padding: "8px 20px",
      borderRadius: 9999,
      background: bg,
      color,
      fontSize: 16, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
      alignSelf: "flex-start",
    }}>
      {children}
    </div>
  );
}

/* ── role-specific renderers ───────────────────────────────────────────── */

function GanchoSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 32, position: "relative", zIndex: 1 }}>
      <Pill bg="rgba(255,255,255,0.20)" color={ASSAAD.white}>
        ENEM 2026
      </Pill>
      {slide.title && (
        <div style={{
          fontSize: 88, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em",
          color: ASSAAD.white,
        }}>
          {slide.title}
        </div>
      )}
      {slide.body && (
        <div style={{ fontSize: 28, lineHeight: 1.45, color: ASSAAD.white, opacity: 0.85 }}>
          {slide.body}
        </div>
      )}
    </div>
  );
}

function DadoSlide({ slide }: { slide: Slide }) {
  // Use title as the big number; body as the caption.
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, position: "relative", zIndex: 1 }}>
      {slide.title && (
        <div style={{
          fontSize: 280, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em",
          color: ASSAAD.red, fontFamily: FONT_FAMILY,
        }}>
          {slide.title}
        </div>
      )}
      {slide.body && (
        <div style={{
          fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: ASSAAD.white,
          letterSpacing: "-0.02em", marginTop: 12,
        }}>
          {slide.body}
        </div>
      )}
      {slide.footer && (
        <div style={{ fontSize: 22, color: ASSAAD.white, opacity: 0.6, lineHeight: 1.4 }}>
          {slide.footer}
        </div>
      )}
    </div>
  );
}

function ProblemaSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, position: "relative", zIndex: 1 }}>
      <div style={{ width: 6, height: 96, background: ASSAAD.magenta, borderRadius: 3 }} />
      {slide.title && (
        <div style={{
          fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em",
          color: ASSAAD.dark,
        }}>
          {slide.title}
        </div>
      )}
      {slide.body && (
        <div style={{ fontSize: 28, lineHeight: 1.5, color: ASSAAD.gray500 }}>
          {slide.body}
        </div>
      )}
    </div>
  );
}

function SolucaoSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 32, position: "relative", zIndex: 1 }}>
      <Pill bg="rgba(255,255,255,0.20)" color={ASSAAD.white}>
        A Solução
      </Pill>
      {slide.title && (
        <div style={{
          fontSize: 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em",
          color: ASSAAD.white,
        }}>
          {slide.title}
        </div>
      )}
      {slide.body && (
        <div style={{ fontSize: 28, lineHeight: 1.5, color: ASSAAD.white, opacity: 0.9 }}>
          {slide.body}
        </div>
      )}
    </div>
  );
}

function FeaturesSlide({ slide }: { slide: Slide }) {
  // Each line of body is a feature item.
  const items = (slide.body ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, position: "relative", zIndex: 1 }}>
      {slide.title && (
        <div style={{
          fontSize: 44, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em",
          color: ASSAAD.white, marginBottom: 12,
        }}>
          {slide.title}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.length === 0 && (
          <div style={{ fontSize: 24, color: ASSAAD.white, opacity: 0.5 }}>
            (uma feature por linha no campo &quot;Texto principal&quot;)
          </div>
        )}
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 700, color: ASSAAD.white, flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.18)",
            }}>+</div>
            <div style={{ fontSize: 26, fontWeight: 500, color: ASSAAD.white, lineHeight: 1.35 }}>
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProvaSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, position: "relative", zIndex: 1 }}>
      {slide.title && (
        <div style={{
          fontSize: 56, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em",
          color: ASSAAD.white,
        }}>
          {slide.title}
        </div>
      )}
      {slide.body && (
        <div style={{
          padding: "32px 36px",
          borderRadius: 20,
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.25)",
          fontSize: 26, lineHeight: 1.5, color: ASSAAD.white, fontStyle: "normal",
          fontWeight: 500,
        }}>
          {slide.body.startsWith("“") || slide.body.startsWith("\"") ? slide.body : `“${slide.body}”`}
        </div>
      )}
      {slide.footer && (
        <div style={{ fontSize: 20, color: ASSAAD.white, opacity: 0.85, fontWeight: 600 }}>
          — {slide.footer}
        </div>
      )}
    </div>
  );
}

function CtaSlide({ slide, profile }: { slide: Slide; profile: UserProfile }) {
  const cta = slide.footer || "Acesse a plataforma";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 32, position: "relative", zIndex: 1 }}>
      {slide.title && (
        <div style={{
          fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em",
          color: ASSAAD.white,
        }}>
          {slide.title}
        </div>
      )}
      {slide.body && (
        <div style={{ fontSize: 28, lineHeight: 1.45, color: ASSAAD.white, opacity: 0.9 }}>
          {slide.body}
        </div>
      )}
      <div style={{
        marginTop: 12,
        padding: "20px 36px",
        borderRadius: 14,
        background: ASSAAD.white,
        color: ASSAAD.bluePrimary,
        fontSize: 28, fontWeight: 700,
        alignSelf: "flex-start",
        letterSpacing: "-0.01em",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}>
        {cta} →
      </div>
      <div style={{ fontSize: 18, color: ASSAAD.white, opacity: 0.75, fontWeight: 500, letterSpacing: "0.02em" }}>
        Link na bio · {profile.handle}
      </div>
    </div>
  );
}

/* ── main component ────────────────────────────────────────────────────── */

export default function InstagramSlidePreview({ slide, style, profile, index, total }: Props) {
  const role: NarrativeRole = getNarrativeRole(index, total);
  const bg = ROLE_BG[role];
  const fg = ROLE_FG[role];
  const isGradient = bg.startsWith("linear-gradient");

  const container: CSSProperties = {
    width:  style.dimensions.width,
    height: style.dimensions.height,
    position: "relative",
    overflow: "hidden",
    fontFamily: FONT_FAMILY,
    color: fg,
    display: "flex",
    flexDirection: "column",
    padding: PADDING,
    background:      isGradient ? bg : undefined,
    backgroundColor: !isGradient ? bg : undefined,
  };

  const headerColor = role === "problema" ? ASSAAD.gray500 : ASSAAD.white;
  const footerColor = role === "problema" ? ASSAAD.gray500 : ASSAAD.white;
  const footerOpacity = role === "problema" ? 0.5 : 0.55;

  return (
    <div style={container}>
      <Header profile={profile} color={headerColor} opacity={role === "problema" ? 0.7 : 0.7} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: 28, marginBottom: 16 }}>
        {role === "gancho"   && <GanchoSlide   slide={slide} />}
        {role === "dado"     && <DadoSlide     slide={slide} />}
        {role === "problema" && <ProblemaSlide slide={slide} />}
        {role === "solucao"  && <SolucaoSlide  slide={slide} />}
        {role === "features" && <FeaturesSlide slide={slide} />}
        {role === "prova"    && <ProvaSlide    slide={slide} />}
        {role === "cta"      && <CtaSlide      slide={slide} profile={profile} />}
      </div>

      {style.showSlideNumber && (
        <Footer index={index} total={total} color={footerColor} opacity={footerOpacity} />
      )}
    </div>
  );
}
