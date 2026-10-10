// Claim validator. Flags broad or unsubstantiated environmental/health/safety wording in copy.
// Used for concept copy, seller listings, and page-level tests. See FTC Green Guides (16 CFR 260).

export interface ClaimMatch {
  term: string;
  index: number;
  reason: string;
}

const BROAD_ENV = [
  "eco-friendly", "eco friendly", "environmentally friendly", "earth-friendly", "earth friendly", "planet-safe",
  "planet safe", "planet-friendly", "sustainable", "sustainably", "green product", "zero waste", "zero-waste",
  "low waste", "low-waste", "biodegradable", "compostable", "recyclable", "carbon neutral", "carbon-neutral",
  "climate neutral", "plastic-free", "plastic free", "organic",
];
const HEALTH_SAFETY = [
  "non-toxic", "nontoxic", "chemical-free", "chemical free", "all natural", "all-natural", "hypoallergenic",
  "antibacterial", "antimicrobial", "safe for people and planet", "cruelty-free", "cruelty free", "vegan",
  "clean ingredients",
];
const MARKETING = ["best seller", "best-seller", "bestseller", "#1", "number one", "guaranteed", "in demand", "high profit"];
/** Material-behavior words that need proof for concepts (can't claim reuse before materials are tested). */
const CONCEPT_ONLY = ["reusable", "reuse", "durable", "long-lasting", "refillable"];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\#]/g, "\$&");

export function findClaims(text: string, opts: { concept?: boolean } = {}): ClaimMatch[] {
  const groups: [string[], string][] = [
    [BROAD_ENV, "Broad environmental claim: needs specific, documented substantiation"],
    [HEALTH_SAFETY, "Health/safety/ethics claim: needs documentation and review"],
    [MARKETING, "Unverifiable marketing claim"],
  ];
  if (opts.concept) groups.push([CONCEPT_ONLY, "Material/performance claim not yet validated for a concept"]);
  const lower = text.toLowerCase();
  const out: ClaimMatch[] = [];
  for (const [terms, reason] of groups) {
    for (const term of terms) {
      const re = new RegExp(`(^|[^a-z])${escape(term)}(?=$|[^a-z])`, "g");
      let m: RegExpExecArray | null;
      while ((m = re.exec(lower))) out.push({ term, index: m.index + m[1].length, reason });
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

export const hasClaims = (text: string, opts?: { concept?: boolean }) => findClaims(text, opts).length > 0;
