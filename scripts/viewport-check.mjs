// Usage: node scripts/viewport-check.mjs <baseUrl> [outDir]
// Loads core routes at phone/tablet/desktop widths with installed Chrome, reports horizontal overflow,
// failed requests, and console errors, and saves full-page screenshots.
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3];
const routes = (process.env.ROUTES ?? "/,/shop,/about,/contact,/cart,/privacy-policy").split(",");
const widths = [375, 768, 1440];

const browser = await chromium.launch({ channel: "chrome" });
let problems = 0;
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()} ${r.url()}`));
  for (const route of routes) {
    errors.length = 0;
    await page.goto(base + route, { waitUntil: "networkidle" });
    const { sw, cw, offenders } = await page.evaluate(() => {
      const cw = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > cw + 1)
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
      return { sw: document.documentElement.scrollWidth, cw, offenders };
    });
    const overflow = sw > cw;
    if (overflow || errors.length) problems++;
    console.log(`${width}px ${route.padEnd(16)} ${overflow ? `OVERFLOW ${sw}>${cw} ${offenders.join(" | ")}` : "ok"}${errors.length ? "  " + [...new Set(errors)].join("; ") : ""}`);
    // Force lazy images to load, then wait until every <img> has decoded (incomplete images count as broken).
    await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
    await page.waitForLoadState("networkidle");
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 20000 })
      .catch(() => {});
    const broken = await page.evaluate(() =>
      [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src)
    );
    if (broken.length) {
      problems++;
      console.log(`   BROKEN IMAGES on ${route}: ${broken.join(", ")}`);
    }
    if (out) await page.screenshot({ path: `${out}/${width}${route.replace(/\W+/g, "_") || "_home"}.png`, fullPage: true, timeout: 60000 });
  }
  await page.close();
}
await browser.close();
process.exit(problems ? 1 : 0);
