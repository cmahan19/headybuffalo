// Verifies WCAG contrast for the Heady Buffalo color tokens defined in src/app/globals.css.
// Usage: node scripts/check-contrast.mjs   (exits 1 if a required pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const tokens = Object.fromEntries(
  [...css.matchAll(/--hb-([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+);/g)].map((m) => [m[1], [m[2], m[3], m[4]].map(Number)])
);

const lum = ([r, g, b]) =>
  [r, g, b]
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [x, y] = [lum(tokens[a]), lum(tokens[b])].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum, usage]
const required = [
  // Natural foundation
  ["ink", "bone", 4.5, "body text on the page background"],
  ["ink", "surface", 4.5, "body text on cards"],
  ["ink", "sand", 4.5, "body text on sand panels"],
  ["ink", "surface-muted", 4.5, "body text on muted panels"],
  ["moss", "bone", 4.5, "moss links/eyebrows on bone"],
  ["moss", "surface", 4.5, "moss links on white"],
  ["clay", "bone", 4.5, "clay accent text on bone"],
  ["surface", "moss", 4.5, "white text on moss buttons"],
  ["surface", "clay", 4.5, "white text on clay fills"],
  ["surface", "olive", 4.5, "white text on olive hover"],
  // Black chrome
  ["surface", "charcoal", 4.5, "white text on chrome panels"],
  ["chrome-light", "charcoal", 4.5, "light chrome text on charcoal"],
  ["chrome-mid", "charcoal", 4.5, "secondary text on charcoal"],
  ["surface", "chrome-dark", 4.5, "white text on chrome highlights"],
  ["sage", "charcoal", 4.5, "sage accent text on charcoal"],
  ["aqua", "charcoal", 4.5, "aqua accent text on charcoal"],
  ["yellow", "charcoal", 4.5, "yellow accent text on charcoal"],
  // Deep accent text on light surfaces
  ...["blue-deep", "teal-deep", "orange-deep", "pink-deep", "violet-deep", "lime-deep"].flatMap((c) => [
    [c, "bone", 4.5, "colored text/links on bone"],
    [c, "surface", 4.5, "colored text/links on white"],
  ]),
  ["success", "surface", 4.5, "status text"],
  ["warning", "surface", 4.5, "status text"],
  ["error", "surface", 4.5, "status text"],
  // Accent fills
  ...["aqua", "lime", "yellow", "sand"].map((c) => ["ink", c, 4.5, `ink text on ${c} fill`]),
  ...["cobalt", "teal-deep", "berry", "violet-deep", "indigo"].map((c) => ["surface", c, 4.5, `white text on ${c} fill`]),
  // Non-text UI (borders, icons, focus rings) need 3:1
  ["moss", "bone", 3, "focus ring on bone"],
];

let failed = 0;
for (const [fg, bg, min, usage] of required) {
  if (!tokens[fg] || !tokens[bg]) {
    console.log(`MISSING  --hb-${fg} or --hb-${bg}`);
    failed++;
    continue;
  }
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg}  — ${usage}`);
}
console.log(failed ? `\n${failed} pair(s) failed` : "\nAll required pairs pass.");
process.exit(failed ? 1 : 0);
