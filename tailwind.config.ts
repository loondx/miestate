import type { Config } from "tailwindcss";

/**
 * Brand palette is derived directly from the miestate logo:
 *   - deep teal of the "MI" mark + wordmark  → `forest` scale
 *   - the green house outline                 → `gold` scale
 *
 * The historic key names (`forest`, `gold`) are kept so every existing
 * class keeps working — only the values changed. Semantically:
 *   forest = primary brand teal (buttons, hero, nav, footer)
 *   gold   = secondary brand green (verified, accents, positive)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep teal — the trust colour. Matches the logo lettering.
        forest: {
          950: "#042129",
          900: "#063540", // hero / footer
          800: "#0A4F5F",
          700: "#0E6476", // primary button / brand
          600: "#127A8F",
          500: "#1894AC",
          100: "#CDE9EE",
          50: "#ECF7F9",
        },
        danger: "#DC2626",
        // Brand green — the "go / safe / verified" colour from the house mark.
        gold: {
          600: "#3A8A53",
          500: "#4BA468", // logo green
          400: "#67BF84",
          100: "#D8F1DF",
          50: "#EFF9F2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        // Soft, layered shadows — the depth that removes the "flat & bordered" look.
        card: "0 1px 2px rgba(6, 53, 64, 0.04), 0 4px 16px -4px rgba(6, 53, 64, 0.08)",
        "card-hover":
          "0 2px 6px rgba(6, 53, 64, 0.06), 0 18px 40px -12px rgba(6, 53, 64, 0.18)",
        soft: "0 10px 40px -12px rgba(6, 53, 64, 0.18)",
        cta: "0 8px 24px -8px rgba(14, 100, 118, 0.45)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 50px -20px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "hero-teal":
          "radial-gradient(120% 120% at 85% 0%, #0E6476 0%, #063540 55%, #042129 100%)",
        "teal-sheen":
          "linear-gradient(135deg, #0E6476 0%, #063540 100%)",
        "green-sheen":
          "linear-gradient(135deg, #67BF84 0%, #4BA468 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
