import Image from "next/image";
import Link from "next/link";
import { displayPriceCents, getCategory, isRequestOnly, showDrafts, type Product } from "@/lib/catalog";
import Badge from "./ui/Badge";
import Price from "./ui/Price";

/** Product card. Labels are factual only: how it is sold, partner relationship, or draft status (preview only). */
export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = displayPriceCents(product);
  const category = getCategory(product.category);
  const external = product.offer.kind === "external";
  const madeToOrder = isRequestOnly(product);

  return (
    <article className="card group relative flex w-full flex-col overflow-hidden transition hover:shadow-raised focus-within:ring-2 focus-within:ring-hb-moss">
      <div className="relative aspect-square overflow-hidden bg-hb-sand/50">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1152px) 270px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
          priority={priority}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {showDrafts && !product.ownerVerified && !madeToOrder && <Badge variant="draft">Draft</Badge>}
          {madeToOrder && <Badge variant="neutral">Made to order</Badge>}
          {external && <Badge variant="partner">Curated partner product</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {category && <p className="text-xs font-medium uppercase tracking-wide text-hb-moss">{category.name}</p>}
        <h3 className="mt-1 text-sm font-semibold leading-snug text-hb-ink sm:text-base">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-hb-ink/65">{product.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          {price !== undefined ? (
            <Price cents={price} size="sm" />
          ) : madeToOrder ? (
            <p className="text-sm font-medium text-hb-ink/70">Price on request</p>
          ) : (
            <span />
          )}
          <span className="hidden text-xs font-semibold text-hb-moss group-hover:underline sm:inline" aria-hidden="true">
            {external ? "View partner product" : madeToOrder ? "Request it" : "View details"} →
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, prioritizeFirst = 0 }: { products: Product[]; prioritizeFirst?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.slug} className="flex">
          <ProductCard product={p} priority={i < prioritizeFirst} />
        </li>
      ))}
    </ul>
  );
}
