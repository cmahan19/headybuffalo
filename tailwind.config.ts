import type { Config } from "tailwindcss";

// Heady Buffalo design tokens: a warm natural base (bone, sand, stone, sage, moss, clay), black chrome
// surfaces, and color accents. Green is a brand color only; it must never be used to imply an
// environmental claim (badges, leaf icons, "eco" seals) the business can't substantiate.
// Tokens live in src/app/globals.css as RGB channels (--hb-*) and are exposed as `hb-*` classes,
// e.g. `bg-hb-moss text-white`, `text-hb-teal-deep`, `border-hb-stone`.
const hbTokens = [
  "bone", "sand", "stone", "sage", "moss", "olive", "clay",
  "charcoal", "chrome-light", "chrome-mid", "chrome-dark",
  "blue", "cobalt", "aqua", "teal", "lime", "yellow", "orange", "coral", "pink", "berry", "violet", "indigo",
  "blue-deep", "teal-deep", "orange-deep", "pink-deep", "violet-deep", "lime-deep",
  "cream", "ink", "surface", "surface-muted", "border", "success", "warning", "error",
];
const hb = Object.fromEntries(hbTokens.map((t) => [t, `rgb(var(--hb-${t}) / <alpha-value>)`]));

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hb,
        ink: { DEFAULT: "#0b0b0b", soft: "#1a1a1a" },
        cream: "#faf7f0",
        kraft: "#e9dcc4",
        forest: { DEFAULT: "#1f5f3a", dark: "#174a2d", light: "#e3efe6" },
        ember: { DEFAULT: "#f08a2c", light: "#f6a24f", dark: "#b85a0e" },
        sky: { brand: "#3b82c4" },
        danger: { DEFAULT: "#b42318", light: "#fef3f2" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        // Display scale for headings; body text uses Tailwind defaults (sm/base/lg).
        "display-sm": ["1.875rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-lg": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.035em", fontWeight: "800" }],
        eyebrow: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.2em", fontWeight: "600" }],
      },
      borderRadius: {
        card: "1rem",
        panel: "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgb(11 11 11 / 0.06), 0 1px 1px rgb(11 11 11 / 0.04)",
        raised: "0 12px 32px -12px rgb(11 11 11 / 0.25)",
        drawer: "0 0 48px rgb(11 11 11 / 0.3)",
        soft: "var(--hb-shadow-soft)",
        lift: "var(--hb-shadow-lift)",
      },
      maxWidth: {
        page: "72rem",
        prose: "42rem",
      },
      keyframes: {
        "slide-in-right": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "slide-in-left": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "slide-in-right": "slide-in-right 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        "slide-in-left": "slide-in-left 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        "fade-in": "fade-in 180ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
