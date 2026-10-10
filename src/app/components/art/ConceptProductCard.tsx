import Image from "next/image";
import { art } from "@/lib/art";
import { CONCEPT_LABELS, conceptCategories, type ProductConcept } from "@/lib/concepts";
import ConceptBadge from "./ConceptBadge";

/**
 * Concept card: abstract studio-pedestal art (no product depicted) and a clean information card.
 * Deliberately has NO price, cart button, stock, rating, link to purchase, or Product schema.
 */
export default function ConceptProductCard({
  concept,
  headingLevel = "h3",
}: {
  concept: ProductConcept;
  headingLevel?: "h2" | "h3";
}) {
  const bg = art(concept.backgroundId);
  const Heading = headingLevel;
  return (
    <article
      data-testid="concept-card"
      data-concept-id={concept.id}
      className="surface-card relative isolate flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4/5]">
        <Image
          src={bg.file}
          alt="Empty studio pedestal artwork representing a product idea in development"
          fill
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <ConceptBadge />
          {concept.isDiy && (
            <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-hb-moss ring-1 ring-hb-stone">
              DIY kit
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col border-t border-hb-stone p-4 sm:p-5">
        <p className="eyebrow text-hb-moss">{conceptCategories[concept.category].name}</p>
        <Heading className="mt-1 text-lg font-bold leading-snug text-hb-ink">{concept.publicName}</Heading>
        <p className="mt-2 text-sm text-hb-ink/75">{concept.publicDescription}</p>
        <ul className="mt-auto space-y-1 border-t border-hb-stone pt-3 text-sm text-hb-ink">
          <li className="font-medium">{CONCEPT_LABELS.notForSale}</li>
          <li>{CONCEPT_LABELS.research}</li>
          <li className="text-hb-ink/65">{CONCEPT_LABELS.noCapture}</li>
        </ul>
      </div>
    </article>
  );
}
