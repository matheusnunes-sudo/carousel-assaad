import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        assaad: {
          primary: "#4F5FE6",
          "primary-light": "#7B8CF8",
          "primary-bg": "#E8EAFD",
          "primary-dark": "#3A48B5",
          orange: "#F97316",
          magenta: "#E91E63",
          teal: "#00BFA5",
          red: "#EF4444",
          green: "#22C55E",
          purple: "#8B5CF6",
          dark: "#111827",
          "sidebar-dark": "#1A1A2E",
          "gray-50": "#F7F7F8",
          "gray-200": "#E5E7EB",
          "gray-500": "#6B7280",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        "jetbrains-mono": ["JetBrains Mono", "monospace"],
        outfit: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
