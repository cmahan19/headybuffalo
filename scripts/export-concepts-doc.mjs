// Regenerates docs/DIY_PRODUCT_CONCEPTS.md from src/lib/concepts.ts so the doc can't drift from code.
// Usage: node scripts/export-concepts-doc.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/lib/concepts.ts"), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const { concepts, conceptCategories, CONCEPT_LABELS, STANDARD_LAUNCH_REQUIREMENTS, STANDARD_VALIDATION_QUESTIONS } = mod;

let md = `# Product concepts (${concepts.length}), including hand-made DIY products

> **${CONCEPT_LABELS.internal}**
>
> These are ideas to validate, not products. None has a price, stock, supplier, or claim. Nothing here says a
> concept is profitable or in demand; that is what the validation scorecard is for.
> Source of truth: \`src/lib/concepts.ts\` (regenerate with \`node scripts/export-concepts-doc.mjs\`).

**Where they appear**
- **Private:** \`/admin/product-concepts\` shows status, readiness gate, supplier and material fields, owner
  decisions, the scorecard, approve/reject/archive controls, and the audit trail.
- **Public:** \`/ideas\` and the homepage "Ideas we're exploring" module. Both are \`noindex\` and show the
  "Concept Only / ${CONCEPT_LABELS.notForSale} / ${CONCEPT_LABELS.research}" labels. They have no price, cart,
  stock, rating, or Product schema. Public names drop words like "reusable" until materials are tested.
- **Interest list:** not shown, because no email capture exists. Cards say "${CONCEPT_LABELS.noCapture}"

**Excluded by design:** cosmetics, food, supplements, homemade cleaners, medical products, children's products,
and chemical formulations.

## Launch requirements (every concept)

${STANDARD_LAUNCH_REQUIREMENTS.map((r) => `- [ ] ${r}`).join("\n")}

Plus the readiness gate in \`src/lib/readiness.ts\` (15 activation checks, and 8 more for DIY kits),
a real price, a real photo (never generated art), and copy that passes the claim validator.

## Validation questions (every concept)

${STANDARD_VALIDATION_QUESTIONS.map((q) => `- ${q}`).join("\n")}

## Validation scorecard (tracked per concept in admin)

Customer interviews · supplier quotes · cost of goods · shipping cost · fulfillment feasibility · safety review ·
claim review · sample tested · MOQ known · contribution margin · return risk · product image ready · listing ready.
`;

for (const c of concepts) {
  md += `
---

## ${c.number}. ${c.internalName}

**${CONCEPT_LABELS.internal}** · Status: \`${c.initialStatus}\`

| | |
| --- | --- |
| Public name | ${c.publicName} |
| Description | ${c.publicDescription} |
| Category | ${conceptCategories[c.category].name} |
| Product type | ${c.formats.join(", ")} |
| DIY kit (extra requirements) | ${c.isDiy ? "Yes" : "No"} |
| Cross-sell | ${c.crossSell} |
| Subscription suitability | ${c.subscription} |
| Marketplace suitability | ${c.marketplace} |
| Affiliate suitability | ${c.affiliate} |
| Concept art | \`${c.backgroundId}\` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
${c.validationNotes.map((n) => `- ${n}`).join("\n")}

**Owner decision needed:** ${c.ownerDecision}
${c.diy ? diyGuide(c.diy) : ""}`;
}

function diyGuide(d) {
  const list = (items) => items.map((x) => `- ${x}`).join("\n");
  return `
### Make it yourself (${d.skill}, internal planning only)

**Materials to source**
${list(d.materials)}

**Tools**
${list(d.tools)}

**Steps**
${d.steps.map((st, i) => `${i + 1}. ${st}`).join("\n")}

**Safety and quality**
${list(d.safety)}
`;
}

writeFileSync(join(root, "docs/DIY_PRODUCT_CONCEPTS.md"), md);
console.log(`Wrote docs/DIY_PRODUCT_CONCEPTS.md (${concepts.length} concepts)`);
