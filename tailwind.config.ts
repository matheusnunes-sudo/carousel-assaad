import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "Inter",
          "sans-serif",
        ],
      },
      colors: {
        apple: {
          blue:      "#0066CC",
          "blue-h":  "#0077ED",
          bg:        "#FFFFFF",
          "bg-2":    "#F5F5F7",
          "bg-3":    "#FBFBFD",
          text:      "#1D1D1F",
          "text-2":  "#6E6E73",
          "text-3":  "#86868B",
          sep:       "#D2D2D7",
          red:       "#FF3B30",
          green:     "#34C759",
        },
      },
      borderRadius: {
        pill: "980px",
      },
      boxShadow: {
        xs:  "0 1px 2px rgba(0,0,0,0.04)",
        sm:  "0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md:  "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        lg:  "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
