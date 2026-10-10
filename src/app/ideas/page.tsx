import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConceptBadge from "../components/art/ConceptBadge";
import ConceptProductCard from "../components/art/ConceptProductCard";
import CollectionBanner from "../components/art/CollectionBanner";
import SectionDivider from "../components/art/SectionDivider";
import { art } from "@/lib/art";
import { CONCEPT_LABELS, conceptCategories, type ConceptCategoryKey } from "@/lib/concepts";
import { showConceptShowcase } from "@/lib/flags";
import { unlaunchedConcepts } from "@/lib/showcase";
import { site } from "@/lib/site";

// Concept showcase: never indexed, never purchasable, no Product schema.
export const metadata: Metadata = {
  title: "Ideas we’re exploring",
  description: "Product ideas Heady Buffalo is researching. Concepts only; nothing here is for sale.",
  robots: { index: false, follow: false },
};

export default function IdeasPage() {
  if (!showConceptShowcase) notFound();
  const concepts = unlaunchedConcepts();
  const diyCount = concepts.filter((c) => c.diy).length;

  return (
    <div className="container-page py-8 sm:py-12">
      <CollectionBanner
        artId="banner-chrome"
        priority
        eyebrow="Concept only"
        title="Ideas we’re exploring"
        description={`${concepts.length} product ideas, including ${diyCount} hand-made pieces, under research and sourcing review. None are for sale, and any of them may change or be dropped after testing.`}
      />

      <div className="mt-8">
        <div className="rounded-card border border-hb-stone bg-white p-5" role="note">
          <ConceptBadge />
          <p className="mt-3 font-semibold text-hb-ink">{CONCEPT_LABELS.notForSale}.</p>
          <p className="mt-1 text-sm text-hb-ink/75">
            These are ideas, not products. They have no price, no stock, and no release date. Artwork is abstract and
            doesn’t show a real item. Material, sizing, and care details come only after samples are tested.
          </p>
          <p className="mt-3 text-sm text-hb-ink/75">
            Have thoughts on one of these? Call{" "}
            <a href={site.phone.href} className="font-semibold text-hb-blue-deep underline">
              {site.phone.display}
            </a>{" "}
            or{" "}
            <Link href={`/contact?subject=${encodeURIComponent("Product idea feedback")}`} className="font-semibold text-hb-blue-deep underline">
              send us a note
            </Link>
            .
          </p>
        </div>
      </div>

      <nav aria-label="Idea categories" className="mt-8 -mx-4 overflow-x-auto px-4 pb-1">
        <ul className="flex gap-2 whitespace-nowrap">
          {(Object.keys(conceptCategories) as ConceptCategoryKey[]).map((key) => (
            <li key={key}>
              <a href={`#${key}`} className="pill">
                {conceptCategories[key].name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {(Object.keys(conceptCategories) as ConceptCategoryKey[]).map((key) => {
        const cat = conceptCategories[key];
        const items = concepts.filter((c) => c.category === key);
        return (
          <section key={key} id={key} aria-labelledby={`${key}-heading`} className="mt-14 scroll-mt-28">
            <SectionDivider className="mb-8" />
            <div className="relative isolate flex min-h-[7rem] items-end overflow-hidden rounded-panel p-4 shadow-soft">
              <Image src={art(cat.banner).file} alt="" fill sizes="(min-width: 1152px) 1152px, 100vw" className="-z-10 object-cover" />
              <div className="rounded-card border border-hb-stone bg-white px-4 py-2">
                <h2 id={`${key}-heading`} className="text-xl font-bold text-hb-ink">
                  {cat.name}
                </h2>
                <p className="text-sm text-hb-ink/70">{cat.blurb}</p>
              </div>
            </div>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((c) => (
                <li key={c.id}>
                  <ConceptProductCard concept={c} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
