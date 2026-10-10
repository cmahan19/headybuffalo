// Product illustrations for Heady Buffalo's handmade line.
//
// Clean, consistent flat-vector illustrations (one per product) rendered to WebP. They are clearly
// illustrations, labeled as such on the site, and are replaced by real photos as products launch.
// No text, logos, labels, or claims are drawn on any item.
//
// Usage: node scripts/generate-product-illustrations.mjs

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "products", "illustrations");
mkdirSync(outDir, { recursive: true });

const P = {
  bone: "#f7f4ed", sand: "#e7dcc7", kraft: "#c9a77c", cream: "#fbf8f1", stone: "#d6d0c4",
  sage: "#8fa386", moss: "#3f5d3a", olive: "#6b703b", clay: "#a85a3a", ochre: "#c8913a", rust: "#b5532f",
  charcoal: "#26272b", ink: "#18181b", teal: "#0f766e", aqua: "#5fc9d6", cobalt: "#2c55b8", navy: "#22345c",
  coral: "#e8846f", berry: "#a3285e", plum: "#6d3a6b", mustard: "#d9a62e", wood: "#b98a5a", woodDark: "#8a6239",
  cord: "#efe6d4", cordShade: "#d8cbb0", glass: "#dfeef0",
};

// ---------- color + gradient helpers ----------
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const light = (c, t = 0.18) => mix(c, "#ffffff", t);
const dark = (c, t = 0.18) => mix(c, "#000000", t);

let defs = "";
let gid = 0;
/** Vertical shading gradient: lighter top, darker bottom. */
function sh(color, amount = 0.14) {
  const id = `s${gid++}`;
  defs += `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light(color, amount)}"/><stop offset="1" stop-color="${dark(color, amount)}"/></linearGradient>`;
  return `url(#${id})`;
}
/** Horizontal shading (for cylinders). */
function cyl(color) {
  const id = `c${gid++}`;
  defs += `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${dark(color, 0.16)}"/><stop offset="0.35" stop-color="${light(color, 0.14)}"/><stop offset="1" stop-color="${dark(color, 0.22)}"/></linearGradient>`;
  return `url(#${id})`;
}
const f = (n) => Number(n.toFixed(1));

// ---------- shape helpers ----------
const rect = (x, y, w, h, r, fill, extra = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}" ${extra}/>`;
const circ = (cx, cy, r, fill, extra = "") => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
const ell = (cx, cy, rx, ry, fill, extra = "") => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${extra}/>`;
const path = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, w = 4, extra = "") =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const stroke = (d, color, w = 4, extra = "") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const shadow = (cx, cy, rx, ry = rx * 0.12, op = 0.22) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="#000" fill-opacity="${op}" filter="url(#blur)"/>`;
const g = (inner, t = "") => `<g ${t ? `transform="${t}"` : ""}>${inner}</g>`;

/** Simple leaf. */
const leaf = (x, y, len, rot, color) =>
  g(path(`M0,0 C${len * 0.35},${-len * 0.3} ${len * 0.75},${-len * 0.25} ${len},0 C${len * 0.75},${len * 0.25} ${len * 0.35},${len * 0.3} 0,0Z`, sh(color, 0.12)) + line(0, 0, len * 0.85, 0, dark(color, 0.25), 2), `translate(${x} ${y}) rotate(${rot})`);

/** Knot bump (macramé square knot). */
const knot = (x, y, w, color) => ell(x, y, w / 2, w * 0.32, sh(color, 0.2)) + ell(x, y - w * 0.05, w / 2.8, w * 0.16, light(color, 0.25), 'fill-opacity="0.6"');

/** Small stamp motifs (abstract, no text). */
function motif(kind, x, y, s, color) {
  switch (kind) {
    case "sun":
      return g(circ(0, 0, s * 0.42, color) + Array.from({ length: 8 }, (_, i) => line(0, -s * 0.62, 0, -s * 0.85, color, s * 0.1, `transform="rotate(${i * 45})"`)).join(""), `translate(${x} ${y})`);
    case "mountain":
      return g(path(`M${-s},${s * 0.55} L${-s * 0.25},${-s * 0.55} L${s * 0.15},0 L${s * 0.45},${-s * 0.3} L${s},${s * 0.55}Z`, color), `translate(${x} ${y})`);
    case "leaf":
      return leaf(x - s * 0.6, y + s * 0.3, s * 1.3, -40, color);
    case "tri":
      return g(path(`M0,${-s * 0.7} L${s * 0.75},${s * 0.55} L${-s * 0.75},${s * 0.55}Z`, color), `translate(${x} ${y})`);
    case "dot":
      return circ(x, y, s * 0.45, color);
    case "wave":
      return stroke(`M${x - s},${y} q${s / 2},${-s * 0.6} ${s},0 t${s},0`, color, s * 0.22);
    default:
      return "";
  }
}

// ---------- scene ----------
function scene({ bg = "light", accent = P.sage }, body) {
  const W = 1200;
  const top = bg === "sage" ? "#e3e9de" : bg === "warm" ? "#efe4d2" : "#f3efe6";
  const bottom = bg === "sage" ? "#cfd8c8" : bg === "warm" ? "#dccbb0" : "#e2dacb";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="${accent}" stop-opacity="0.32"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.05"/></feComponentTransfer></filter>
    <pattern id="mesh" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="none"/><path d="M0,0 L0,22 M0,0 L22,0" stroke="#ffffff" stroke-opacity="0.75" stroke-width="3"/></pattern>
    <pattern id="weave" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="none"/><path d="M0,9 L18,9" stroke="#000" stroke-opacity="0.07" stroke-width="2"/></pattern>
    ${defs}
  </defs>
  <rect width="${W}" height="${W}" fill="url(#bg)"/>
  <rect y="880" width="${W}" height="320" fill="${bottom}" fill-opacity="0.55"/>
  <circle cx="600" cy="560" r="470" fill="url(#glow)"/>
  ${body}
  <rect width="${W}" height="${W}" filter="url(#grain)"/>
</svg>`;
}

// ---------- reusable objects ----------
function tote(x, y, w, h, color, pattern = "") {
  const handle = stroke(`M${x + w * 0.28},${y + 6} C${x + w * 0.28},${y - h * 0.42} ${x + w * 0.72},${y - h * 0.42} ${x + w * 0.72},${y + 6}`, dark(color, 0.12), w * 0.06);
  const body = path(`M${x},${y} L${x + w},${y} L${x + w * 0.97},${y + h} L${x + w * 0.03},${y + h}Z`, sh(color, 0.1));
  const seam = line(x + 8, y + 22, x + w - 8, y + 22, dark(color, 0.12), 3, 'stroke-dasharray="10 8"');
  return handle + body + rect(x, y, w, h, 0, "url(#weave)") + seam + pattern;
}
function jar(x, y, w, h, lid, glassTint = P.glass, fillLayers = []) {
  let layers = "";
  let yy = y + h;
  for (const [color, lh] of fillLayers) {
    yy -= lh;
    layers += rect(x + 10, yy, w - 20, lh, 0, sh(color, 0.1));
  }
  return (
    rect(x, y, w, h, w * 0.16, glassTint, 'fill-opacity="0.75"') +
    layers +
    rect(x + w * 0.12, y + h * 0.1, w * 0.08, h * 0.7, 6, "#fff", 'fill-opacity="0.55"') +
    rect(x - 6, y - h * 0.12, w + 12, h * 0.14, 10, sh(lid, 0.15))
  );
}
function plant(x, y, scale = 1, pot = P.clay) {
  const s = scale;
  return (
    leaf(x, y - 40 * s, 120 * s, -110, P.moss) +
    leaf(x, y - 40 * s, 110 * s, -60, P.sage) +
    leaf(x, y - 40 * s, 100 * s, -150, "#5f7a58") +
    leaf(x, y - 40 * s, 90 * s, -20, P.olive) +
    path(`M${x - 80 * s},${y - 40 * s} L${x + 80 * s},${y - 40 * s} L${x + 62 * s},${y + 90 * s} L${x - 62 * s},${y + 90 * s}Z`, sh(pot, 0.12)) +
    rect(x - 90 * s, y - 58 * s, 180 * s, 26 * s, 8 * s, sh(light(pot, 0.08), 0.1))
  );
}

// ---------- product drawings (keyed by slug) ----------
const draw = {
  "embroidered-patch-set": () =>
    scene({ accent: P.ochre }, [
      shadow(600, 880, 380),
      // round patch: mountain
      g(circ(0, 0, 150, P.charcoal) + circ(0, 0, 132, sh(P.navy, 0.12)) + motif("sun", 40, -40, 40, P.mustard) + motif("mountain", 0, 50, 90, P.sage) + circ(0, 0, 132, "none", `stroke="${P.cream}" stroke-width="6" stroke-dasharray="3 7"`), "translate(400 560) rotate(-8)"),
      // shield patch: leaf
      g(path("M0,-150 L120,-110 L110,40 C95,110 40,145 0,160 C-40,145 -95,110 -110,40 L-120,-110Z", P.moss) + path("M0,-130 L102,-96 L94,34 C80,96 36,126 0,140 C-36,126 -80,96 -94,34 L-102,-96Z", sh(P.cream, 0.08)) + motif("leaf", 0, 0, 80, P.moss), "translate(760 520) rotate(6)"),
      // small round sun patch
      g(circ(0, 0, 92, P.clay) + circ(0, 0, 78, sh(P.mustard, 0.12)) + motif("sun", 0, 0, 52, P.cream), "translate(640 780)"),
    ].join("")),

  "hand-stamped-canvas-tote": () =>
    scene({ accent: P.clay }, [
      shadow(600, 950, 300),
      tote(330, 380, 540, 560, P.cream, [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => motif(["sun", "mountain", "leaf"][(r + c) % 3], 430 + c * 170, 520 + r * 150, 46, (r + c) % 2 ? P.clay : P.navy))).join("")),
    ].join("")),

  "macrame-plant-hanger": () =>
    scene({ bg: "sage", accent: P.moss }, [
      shadow(600, 1010, 180),
      circ(600, 120, 46, "none", `stroke="${P.wood}" stroke-width="16"`),
      ...[-1, 1].map((sd) => stroke(`M${600 + sd * 14},160 C${600 + sd * 40},360 ${600 + sd * 150},520 ${600 + sd * 170},720`, P.cordShade, 12)),
      stroke("M590,160 C580,360 540,520 520,720", P.cord, 12),
      stroke("M610,160 C620,360 660,520 680,720", P.cord, 12),
      knot(600, 190, 70, P.cord),
      ...[300, 380, 460].flatMap((y) => [knot(600 - (y - 160) * 0.28, y, 46, P.cord), knot(600 + (y - 160) * 0.28, y, 46, P.cord)]),
      plant(600, 760, 1.1, P.clay),
      knot(600, 950, 64, P.cord),
      ...[-18, -6, 6, 18].map((dx) => line(600 + dx, 970, 600 + dx * 1.8, 1060, P.cordShade, 8)),
    ].join("")),

  "pressed-flower-bookmarks": () =>
    scene({ bg: "warm", accent: P.coral }, [
      shadow(600, 940, 320),
      ...[
        [-170, -8, P.cream, P.coral],
        [0, 0, "#f3ede1", P.mustard],
        [170, 8, P.cream, P.berry],
      ].map(([dx, rot, card, flower]) =>
        g(
          rect(-80, -300, 160, 560, 18, sh(card, 0.06)) +
            rect(-80, -300, 160, 560, 18, "#fff", 'fill-opacity="0.25"') +
            circ(0, -250, 10, P.stone) +
            stroke("M0,-250 C-20,-340 30,-380 10,-430", P.clay, 5) +
            [0, 1, 2, 3, 4].map((i) => ell(0, 30, 16, 40, flower, `transform="rotate(${i * 72} 0 30) translate(0 -36)" fill-opacity="0.9"`)).join("") +
            circ(0, 30, 14, P.mustard) +
            stroke("M0,60 C10,120 -10,160 0,220", P.olive, 5) +
            leaf(0, 150, 60, -40, P.sage),
          `translate(${600 + dx} 600) rotate(${rot})`
        )
      ),
    ].join("")),

  "rope-coil-basket": () =>
    scene({ accent: P.ochre }, [
      shadow(600, 930, 330),
      path("M300,470 L900,470 L860,900 C860,920 340,920 340,900Z", sh(P.cord, 0.1)),
      ...Array.from({ length: 13 }, (_, i) => stroke(`M${304 + i * 3},${500 + i * 32} L${896 - i * 3},${500 + i * 32}`, P.cordShade, 6)),
      ...[2, 3, 9].map((i) => stroke(`M${304 + i * 3},${500 + i * 32} L${896 - i * 3},${500 + i * 32}`, i === 9 ? P.clay : P.teal, 14)),
      ell(600, 470, 300, 46, sh(P.cord, 0.12)),
      ell(600, 474, 270, 34, dark(P.cord, 0.25)),
      ...[-1, 1].map((sd) => stroke(`M${600 + sd * 300},530 c${sd * 70},0 ${sd * 70},90 0,90`, P.cordShade, 18)),
    ].join("")),

  "hand-bound-notebook": () =>
    scene({ accent: P.teal }, [
      shadow(600, 900, 300),
      g(
        rect(-230, -300, 460, 600, 16, sh(P.teal, 0.12)) +
          rect(-230, -300, 36, 600, 8, dark(P.teal, 0.2)) +
          Array.from({ length: 6 }, (_, i) => line(-212, -240 + i * 96, -212, -200 + i * 96, P.cream, 6)).join("") +
          rect(-150, -170, 300, 120, 10, P.cream, 'fill-opacity="0.9"') +
          motif("mountain", 0, -110, 60, P.teal) +
          rect(220, -290, 18, 580, 4, P.cream),
        "translate(600 570) rotate(-6)"
      ),
    ].join("")),

  "woven-wall-hanging": () =>
    scene({ bg: "warm", accent: P.clay }, [
      line(330, 220, 870, 220, P.woodDark, 26),
      stroke("M360,220 C460,120 740,120 840,220", P.cordShade, 6),
      rect(380, 230, 440, 470, 10, sh(P.cream, 0.06)),
      ...[[P.clay, 300], [P.mustard, 350], [P.sage, 410], [P.cream, 470], [P.teal, 520], [P.rust, 580], [P.cream, 640]].map(([c, y]) =>
        stroke(`M380,${y} q55,-22 110,0 t110,0 t110,0 t110,0`, c, 46)
      ),
      rect(380, 230, 440, 470, 10, "url(#weave)"),
      ...Array.from({ length: 22 }, (_, i) => line(390 + i * 20, 700, 386 + i * 20 + (i % 3) * 4, 840 + (i % 4) * 14, i % 5 === 0 ? P.clay : P.cordShade, 7)),
    ].join("")),

  "painted-wood-coasters": () =>
    scene({ accent: P.ochre }, [
      shadow(600, 900, 360),
      ...[0, 1, 2].map((i) => ell(470, 830 - i * 34, 190, 60, sh(P.woodDark, 0.12)) + ell(470, 812 - i * 34, 190, 60, sh(P.wood, 0.08))),
      ell(470, 744, 190, 60, sh(P.wood, 0.06)),
      g(motif("sun", 0, 0, 50, P.clay) + motif("dot", 110, 10, 26, P.teal) + motif("dot", -110, 10, 26, P.teal), "translate(470 744) scale(1 0.32)"),
      g(circ(0, 0, 190, sh(P.wood, 0.06)) + circ(0, 0, 170, sh(P.teal, 0.1)) + motif("mountain", 0, 20, 110, P.cream) + motif("sun", 60, -70, 34, P.mustard), "translate(790 560) rotate(8)"),
    ].join("")),

  "fabric-storage-bin": () =>
    scene({ bg: "sage", accent: P.sage }, [
      shadow(600, 930, 330),
      path("M330,420 L870,420 L850,910 L350,910Z", sh(P.sage, 0.1)),
      rect(330, 420, 540, 490, 0, "url(#weave)"),
      path("M320,400 L880,400 L870,520 L330,520Z", sh(P.cream, 0.08)),
      ...[-1, 1].map((sd) => rect(600 + sd * 190 - 50, 600, 100, 26, 13, dark(P.sage, 0.3))),
      line(340, 520, 860, 520, dark(P.cream, 0.15), 3, 'stroke-dasharray="10 8"'),
    ].join("")),

  "jar-display-kit": () =>
    scene({ accent: P.aqua }, [
      shadow(600, 930, 220),
      jar(430, 400, 340, 520, P.wood, P.glass, [[P.charcoal, 60], [P.ochre, 70], [P.sand, 90], [P.stone, 60]]),
      ...[[500, 680], [560, 690], [640, 676], [700, 688]].map(([x, y]) => ell(x, y, 22, 14, sh(P.stone, 0.2))),
      g(path("M0,0 L-12,-60 L0,-90 L12,-60Z", P.moss) + path("M-20,0 L-34,-48 L-20,-60Z", P.sage), "translate(600 650)"),
    ].join("")),

  "produce-bag-starter-set": () =>
    scene({ bg: "sage", accent: P.moss }, [
      shadow(600, 930, 360),
      ...[[-180, -6, light(P.sage, 0.25)], [0, 0, light(P.ochre, 0.35)], [180, 6, light(P.teal, 0.45)]].map(([dx, rot, c]) =>
        g(
          path("M-120,-250 L120,-250 L140,250 C140,270 -140,270 -140,250Z", c) +
            path("M-120,-250 L120,-250 L140,250 C140,270 -140,270 -140,250Z", "url(#mesh)") +
            rect(-128, -270, 256, 40, 12, sh(dark(c, 0.25), 0.1)) +
            stroke("M-40,-250 C-60,-330 40,-330 30,-260", P.clay, 6) +
            circ(-8, -310, 12, P.wood),
          `translate(${600 + dx} 620) rotate(${rot})`
        )
      ),
    ].join("")),

  "fold-up-tote-pouch": () =>
    scene({ accent: P.teal }, [
      shadow(600, 930, 340),
      tote(470, 360, 400, 470, P.teal),
      g(rect(-110, -80, 220, 160, 30, sh(P.teal, 0.12)) + stroke("M-90,-40 L90,-40", P.cream, 6, 'stroke-dasharray="12 10"') + rect(-30, 60, 60, 26, 8, P.cream), "translate(400 800) rotate(-8)"),
    ].join("")),

  "pantry-label-kit": () =>
    scene({ bg: "warm", accent: P.ochre }, [
      shadow(600, 920, 360),
      jar(330, 470, 230, 420, P.charcoal, P.glass, [[P.ochre, 220]]),
      rect(355, 640, 180, 90, 45, P.cream),
      jar(620, 400, 260, 490, P.wood, P.glass, [[P.sand, 260]]),
      rect(645, 590, 210, 100, 50, sh(P.sage, 0.06)),
      g(rect(-14, -120, 28, 240, 12, P.charcoal) + path("M-14,120 L0,160 L14,120Z", P.stone), "translate(840 800) rotate(70)"),
    ].join("")),

  "refill-station-organizer": () =>
    scene({ accent: P.teal }, [
      shadow(600, 920, 400),
      ...[[380, P.teal, 300], [560, P.clay, 350], [740, P.sage, 280]].map(([x, c, h]) =>
        rect(x - 70, 860 - h, 140, h, 34, sh(c, 0.12)) + rect(x - 30, 860 - h - 50, 60, 56, 10, P.charcoal) + rect(x - 54, 860 - h * 0.62, 108, 70, 35, P.cream, 'fill-opacity="0.92"')
      ),
      path("M240,840 L960,840 L940,920 L260,920Z", sh(P.wood, 0.12)),
    ].join("")),

  "utensil-straw-travel-pouch": () =>
    scene({ accent: P.clay }, [
      shadow(600, 900, 340),
      ...[-60, -20, 20, 60].map((dx, i) => g(rect(-12, -260, 24, 340, 12, i === 3 ? sh(P.teal, 0.2) : sh(P.stone, 0.25)) + (i === 0 ? ell(0, -270, 30, 44, sh(P.stone, 0.25)) : i === 1 ? rect(-22, -300, 44, 60, 10, sh(P.stone, 0.25)) : ""), `translate(${600 + dx} 640) rotate(${dx / 8})`)),
      path("M330,560 L870,560 L860,860 L340,860Z", sh(P.clay, 0.1)),
      rect(330, 560, 540, 300, 0, "url(#weave)"),
      ...[440, 540, 640, 740].map((x) => line(x, 570, x, 850, dark(P.clay, 0.2), 3, 'stroke-dasharray="10 8"')),
      stroke("M870,690 C960,690 960,760 900,780", P.cream, 10),
    ].join("")),

  "cloth-gift-wrap-set": () =>
    scene({ bg: "warm", accent: P.berry }, [
      shadow(600, 920, 360),
      g(rect(-210, -170, 420, 340, 30, sh(P.berry, 0.1)) + Array.from({ length: 5 }, (_, i) => motif("dot", -150 + i * 75, -90 + (i % 2) * 120, 18, P.cream)).join("") + path("M-60,-170 C-120,-280 -10,-300 0,-190 C10,-300 120,-280 60,-170Z", sh(P.berry, 0.18)) + ell(0, -175, 40, 26, dark(P.berry, 0.2)), "translate(500 680)"),
      g(path("M-110,-150 L110,-150 L120,180 L-120,180Z", sh(P.sage, 0.1)) + stroke("M-80,-120 C-40,-90 40,-90 80,-120", P.cream, 8) + stroke("M60,-110 L90,-30", P.cream, 6), "translate(820 720) rotate(6)"),
    ].join("")),

  "plant-label-organizer-kit": () =>
    scene({ bg: "sage", accent: P.moss }, [
      shadow(600, 930, 300),
      plant(600, 760, 1.5, P.clay),
      ...[[470, -12, P.mustard], [720, 10, P.coral], [600, 0, P.cream]].map(([x, r, c]) =>
        g(rect(-26, -220, 52, 300, 8, sh(P.wood, 0.1)) + rect(-40, -260, 80, 80, 14, c), `translate(${x} 700) rotate(${r})`)
      ),
    ].join("")),

  "beverage-sleeve-set": () =>
    scene({ accent: P.coral }, [
      shadow(600, 920, 340),
      path("M400,420 L620,420 L600,900 L420,900Z", sh(P.cream, 0.08)),
      path("M405,560 L615,560 L608,740 L412,740Z", sh(P.coral, 0.12)),
      ...Array.from({ length: 6 }, (_, i) => line(410 + i * 38, 570, 410 + i * 38, 730, dark(P.coral, 0.15), 4)),
      rect(394, 400, 232, 30, 12, P.charcoal),
      g(path("M-110,-90 L110,-90 L100,90 L-100,90Z", sh(P.teal, 0.12)) + Array.from({ length: 6 }, (_, i) => line(-96 + i * 38, -84, -92 + i * 36, 84, dark(P.teal, 0.15), 4)).join(""), "translate(800 800) rotate(-14)"),
    ].join("")),

  "home-organization-digital-kit": () =>
    scene({ accent: P.cobalt }, [
      shadow(600, 900, 360),
      g(rect(-230, -310, 460, 620, 30, P.charcoal) + rect(-206, -282, 412, 564, 10, P.cream) + Array.from({ length: 6 }, (_, i) => rect(-170, -230 + i * 80, 40, 40, 8, "none", `stroke="${P.sage}" stroke-width="5"`) + line(-110, -210 + i * 80, 150, -210 + i * 80, P.stone, 10)).join(""), "translate(520 590) rotate(-4)"),
      ...[[820, 520, P.mustard], [860, 650, P.coral], [810, 770, P.teal]].map(([x, y, c]) => rect(x - 80, y - 40, 160, 80, 40, c)),
    ].join("")),

  "everyday-routine-starter-bundle": () =>
    scene({ bg: "warm", accent: P.sage }, [
      shadow(600, 930, 380),
      path("M290,560 L910,560 L880,910 L320,910Z", sh(P.kraft, 0.1)),
      tote(380, 360, 260, 300, P.cream, motif("sun", 510, 470, 40, P.clay)),
      g(rect(-90, -60, 180, 120, 24, sh(P.teal, 0.1)), "translate(760 530) rotate(10)"),
      path("M280,540 L920,540 L910,600 L290,600Z", sh(light(P.kraft, 0.1), 0.06)),
      stroke("M600,540 L600,910", P.clay, 16),
    ].join("")),

  "macrame-keychain": () =>
    scene({ bg: "sage", accent: P.teal }, [
      shadow(600, 960, 140),
      circ(600, 230, 70, "none", `stroke="${P.stone}" stroke-width="14"`),
      circ(600, 230, 70, "none", `stroke="#fff" stroke-width="4" stroke-opacity="0.6"`),
      ...[0, 1, 2, 3].map((i) => knot(600, 340 + i * 80, 120 - i * 6, i % 2 ? P.cord : P.teal)),
      circ(600, 690, 34, sh(P.wood, 0.15)),
      knot(600, 760, 90, P.teal),
      ...Array.from({ length: 9 }, (_, i) => line(570 + i * 8, 790, 550 + i * 13, 950, P.teal, 7)),
    ].join("")),

  "braided-cord-bracelet": () =>
    scene({ bg: "warm", accent: P.coral }, [
      shadow(600, 900, 360),
      ...[[460, P.coral, P.cream], [620, P.teal, P.sand], [780, P.mustard, P.moss]].map(([x, a, b], k) =>
        g(ell(0, 0, 150, 70, "none", `stroke="${a}" stroke-width="30"`) + ell(0, 0, 150, 70, "none", `stroke="${b}" stroke-width="10" stroke-dasharray="18 22"`) + knot(0, 70, 54, a), `translate(${x} ${720 - k * 50}) rotate(${-10 + k * 8})`)
      ),
    ].join("")),

  "block-printed-greeting-cards": () =>
    scene({ accent: P.clay }, [
      shadow(600, 920, 380),
      g(rect(-170, -120, 340, 240, 6, sh(P.cream, 0.05)) + path("M-170,-120 L0,10 L170,-120", "none", `stroke="${P.stone}" stroke-width="5"`), "translate(760 780) rotate(6)"),
      g(rect(-160, -220, 320, 440, 8, sh("#fbf7ee", 0.05)) + rect(-110, -160, 220, 220, 6, P.clay, 'fill-opacity="0.12"') + motif("mountain", 0, -50, 90, P.clay) + motif("sun", 60, -130, 34, P.navy) + Array.from({ length: 3 }, (_, i) => motif("dot", -60 + i * 60, 120, 14, P.navy)).join(""), "translate(480 600) rotate(-5)"),
    ].join("")),

  "stamped-cotton-bandana": () =>
    scene({ accent: P.cobalt }, [
      shadow(600, 900, 380),
      g(rect(-300, -300, 600, 600, 8, sh(P.navy, 0.08)) + rect(-270, -270, 540, 540, 4, "none", `stroke="${P.cream}" stroke-width="6" stroke-dasharray="4 12"`) + Array.from({ length: 16 }, (_, i) => motif(["sun", "leaf", "tri", "dot"][i % 4], -180 + (i % 4) * 120, -180 + Math.floor(i / 4) * 120, 32, P.cream)).join(""), "translate(600 580) rotate(45) scale(0.86)"),
    ].join("")),

  "embroidered-tea-towel": () =>
    scene({ bg: "warm", accent: P.sage }, [
      line(320, 210, 880, 210, P.woodDark, 22),
      path("M380,220 L820,220 L820,940 L380,940Z", sh(P.cream, 0.05)),
      rect(380, 220, 440, 720, 0, "url(#weave)"),
      rect(380, 300, 440, 22, 0, P.teal),
      rect(380, 336, 440, 10, 0, P.teal),
      g(leaf(-60, 20, 120, -30, P.moss) + leaf(-40, 40, 100, -70, P.sage) + motif("dot", 30, -20, 18, P.coral) + motif("dot", 60, 10, 14, P.mustard), "translate(700 820)"),
      stroke("M600,210 L600,150", P.cordShade, 6),
    ].join("")),

  "fabric-scrunchie-set": () =>
    scene({ accent: P.berry }, [
      shadow(600, 900, 360),
      ...[[430, 700, P.berry], [640, 740, P.sage], [800, 620, P.mustard]].map(([x, y, c]) =>
        g(Array.from({ length: 14 }, (_, i) => ell(0, -78, 46, 34, sh(c, 0.16), `transform="rotate(${i * (360 / 14)})"`)).join("") + circ(0, 0, 48, dark(c, 0.25)) + circ(0, 0, 38, light(P.bone, 0)), `translate(${x} ${y})`)
      ),
    ].join("")),

  "canvas-zipper-pouch": () =>
    scene({ accent: P.ochre }, [
      shadow(600, 880, 330),
      rect(300, 460, 600, 380, 40, sh(P.kraft, 0.1)),
      rect(300, 460, 600, 380, 40, "url(#weave)"),
      rect(320, 470, 560, 26, 8, P.charcoal),
      ...Array.from({ length: 28 }, (_, i) => line(330 + i * 20, 476, 330 + i * 20, 490, P.stone, 4)),
      rect(820, 460, 34, 60, 8, P.stone),
      g(circ(0, 0, 70, P.charcoal) + circ(0, 0, 58, sh(P.mustard, 0.12)) + motif("sun", 0, 0, 36, P.charcoal), "translate(600 670)"),
    ].join("")),

  "painted-wood-ornaments": () =>
    scene({ bg: "sage", accent: P.mustard }, [
      line(260, 200, 940, 230, P.cordShade, 6),
      ...[
        [380, 420, "circle", P.teal],
        [600, 480, "star", P.mustard],
        [820, 430, "tree", P.moss],
      ].map(([x, y, shape, c]) => {
        const hang = line(x, 210 + (x - 260) * 0.044, x, y - 120, P.cordShade, 4);
        const body =
          shape === "circle"
            ? circ(x, y, 110, sh(P.wood, 0.1)) + circ(x, y, 96, sh(c, 0.12)) + motif("mountain", x, y + 20, 56, P.cream)
            : shape === "star"
              ? path(Array.from({ length: 10 }, (_, i) => `${i ? "L" : "M"}${f(x + Math.cos((i * Math.PI) / 5 - Math.PI / 2) * (i % 2 ? 54 : 124))},${f(y + Math.sin((i * Math.PI) / 5 - Math.PI / 2) * (i % 2 ? 54 : 124))}`).join(" ") + "Z", sh(c, 0.12)) + circ(x, y, 20, P.cream)
              : path(`M${x},${y - 130} L${x + 110},${y + 100} L${x - 110},${y + 100}Z`, sh(c, 0.12)) + rect(x - 18, y + 100, 36, 40, 4, P.woodDark) + motif("dot", x, y, 14, P.coral) + motif("dot", x - 36, y + 50, 12, P.mustard) + motif("dot", x + 34, y + 54, 12, P.cream);
        return hang + body;
      }),
      shadow(600, 930, 300, 30, 0.12),
    ].join("")),

  "pet-bandana": () =>
    scene({ bg: "warm", accent: P.clay }, [
      shadow(600, 900, 300),
      ell(600, 380, 260, 70, "none", `stroke="${P.charcoal}" stroke-width="36"`),
      rect(578, 430, 44, 40, 10, P.stone),
      path("M330,420 L870,420 L600,840Z", sh(P.clay, 0.12)),
      ...Array.from({ length: 6 }, (_, i) => motif(["sun", "dot", "leaf"][i % 3], 430 + (i % 3) * 140 + (i > 2 ? 70 : 0), 510 + (i > 2 ? 130 : 0), 34, P.cream)),
      ...[-1, 1].map((sd) => path(`M${600 + sd * 270},420 c${sd * 50},-10 ${sd * 90},20 ${sd * 110},70 l${-sd * 30},16Z`, dark(P.clay, 0.08))),
    ].join("")),

  "hand-lettered-art-print": () =>
    scene({ accent: P.navy }, [
      shadow(600, 950, 300),
      rect(330, 220, 540, 700, 8, sh(P.woodDark, 0.15)),
      rect(360, 250, 480, 640, 4, "#fbf8f1"),
      stroke("M420,420 c40,-80 90,40 130,-30 s80,-60 110,10 s70,20 110,-30", P.navy, 16),
      stroke("M440,520 c60,40 120,-40 180,0 s100,40 160,-10", P.clay, 12),
      motif("sun", 600, 680, 70, P.mustard),
      leaf(470, 760, 110, -30, P.sage),
      leaf(730, 760, 110, -150, P.sage),
    ].join("")),
};

// ---------- render ----------
const products = JSON.parse(readFileSync(join(root, "scripts", "product-slugs.json"), "utf8"));
const missing = products.filter((s) => !draw[s]);
if (missing.length) throw new Error(`No illustration for: ${missing.join(", ")}`);

const out = [];
for (const slug of products) {
  defs = "";
  gid = 0;
  const svg = draw[slug]();
  const file = join(outDir, `${slug}.webp`);
  const info = await sharp(Buffer.from(svg)).webp({ quality: 82, effort: 6 }).toFile(file);
  out.push({ slug, file: `/products/illustrations/${slug}.webp`, width: 1200, height: 1200, bytes: info.size });
  console.log(`${slug.padEnd(34)} ${(info.size / 1024).toFixed(0)} KB`);
}
writeFileSync(join(root, "src", "data", "product-illustrations.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`\n${out.length} illustrations → public/products/illustrations`);
