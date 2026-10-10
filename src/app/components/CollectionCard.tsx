import Image from "next/image";
import Link from "next/link";
import { art } from "@/lib/art";
import { productsInCategory, type Category } from "@/lib/catalog";
import { collectionBanner } from "@/lib/colorMap";

/** Collection tile. Uses an owner-approved photo if one exists, otherwise the collection's generated banner art. */
export default function CollectionCard({ category }: { category: Category; index?: number }) {
  const count = productsInCategory(category.slug).length;
  const src = category.image?.src ?? art(collectionBanner(category.slug)).file;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-panel border border-hb-stone shadow-soft transition hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hb-ink"
    >
      <Image src={src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="-z-10 object-cover transition duration-300 group-hover:scale-105" />
      <span className="m-3 rounded-card border border-hb-stone bg-white px-3 py-2">
        <span className="block font-bold text-hb-ink">{category.name}</span>
        <span className="block text-xs font-medium text-hb-ink/70">
          {count} product{count === 1 ? "" : "s"}
        </span>
      </span>
    </Link>
  );
}
