/**
 * Assaad-brand Instagram carousel narrative roles + design tokens.
 *
 * Each slide of an Instagram carousel maps to a narrative role:
 *   gancho → dado → problema → solução → features → prova → cta
 *
 * For carousels with fewer than 7 slides, we map the first N-1 roles
 * and reserve the last slot for CTA. For carousels with more than 7
 * slides, extra slides default to the FEATURES style (the most list-friendly).
 */

export type NarrativeRole =
  | "gancho"
  | "dado"
  | "problema"
  | "solucao"
  | "features"
  | "prova"
  | "cta";

const FULL_ARC: NarrativeRole[] = [
  "gancho",
  "dado",
  "problema",
  "solucao",
  "features",
  "prova",
  "cta",
];

/**
 * Returns the narrative role for the slide at `index` of a carousel
 * with `total` slides.
 */
export function getNarrativeRole(index: number, total: number): NarrativeRole {
  if (total <= 0)            return "gancho";
  if (total === 1)           return "gancho";
  if (index === 0)           return "gancho";
  if (index === total - 1)   return "cta";

  if (total <= 7) {
    // Take the first (total - 1) roles, then CTA at the end.
    const slots = [...FULL_ARC.slice(0, total - 1), "cta"] as NarrativeRole[];
    return slots[index] ?? "features";
  }

  // total > 7 — keep first 4 fixed, last 2 fixed, fill middle with features
  if (index === 1)           return "dado";
  if (index === 2)           return "problema";
  if (index === 3)           return "solucao";
  if (index === total - 2)   return "prova";
  return "features";
}

/* ── Assaad design tokens ─────────────────────────────────────────────── */

export const ASSAAD = {
  bluePrimary: "#4F5FE6",
  blueLight:   "#7B8CF8",
  blueBg:      "#E8EAFD",
  blueDark:    "#3A48B5",
  orange:      "#F97316",
  magenta:     "#E91E63",
  red:         "#EF4444",
  green:       "#22C55E",
  white:       "#FFFFFF",
  gray50:      "#F7F7F8",
  gray200:     "#E5E7EB",
  gray500:     "#6B7280",
  dark:        "#111827",
  sidebarDark: "#1A1A2E",
  twitterDark: "#15202B",
} as const;

export const GRADIENT_PRIMARY = "linear-gradient(135deg, #4F5FE6, #7B8CF8)";
export const GRADIENT_ENERGY  = "linear-gradient(135deg, #F97316, #EF4444)";

/** Background per narrative role. */
export const ROLE_BG: Record<NarrativeRole, string> = {
  gancho:   ASSAAD.bluePrimary,
  dado:     ASSAAD.twitterDark,
  problema: ASSAAD.white,
  solucao:  GRADIENT_PRIMARY,
  features: ASSAAD.sidebarDark,
  prova:    GRADIENT_ENERGY,
  cta:      ASSAAD.bluePrimary,
};

/** Primary text color per narrative role. */
export const ROLE_FG: Record<NarrativeRole, string> = {
  gancho:   ASSAAD.white,
  dado:     ASSAAD.white,
  problema: ASSAAD.dark,
  solucao:  ASSAAD.white,
  features: ASSAAD.white,
  prova:    ASSAAD.white,
  cta:      ASSAAD.white,
};

/** Human-readable label for the role (used in UI hints). */
export const ROLE_LABEL: Record<NarrativeRole, string> = {
  gancho:   "Gancho",
  dado:     "Dado",
  problema: "Problema",
  solucao:  "Solução",
  features: "Features",
  prova:    "Prova social",
  cta:      "CTA",
};
