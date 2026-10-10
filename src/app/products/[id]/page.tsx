import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "../../components/AddToCart";
import Breadcrumbs from "../../components/Breadcrumbs";
import CallLink from "../../components/CallLink";
import JsonLd from "../../components/JsonLd";
import { ProductGrid } from "../../components/ProductCard";
import ProductFrame from "../../components/art/ProductFrame";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import PartnerDisclosure from "../../components/ui/PartnerDisclosure";
import Price from "../../components/ui/Price";
import {
  displayPriceCents,
  formatPrice,
  getCategory,
  getPublishedProduct,
  isPurchasable,
  launchChecklist,
  isRequestOnly,
  productsInCategory,
  publishedProducts,
  type Product,
} from "@/lib/catalog";
import { absoluteUrl, site } from "@/lib/site";

// The route segment is named [id] for backward compatibility; values are product slugs.

/** Live = sellable here, or a verified partner listing. Only live products are indexed or get Product schema. */
const isLive = (p: Product) => isPurchasable(p) || (p.offer.kind === "external" && p.ownerVerified);
type Params = Promise<{ id: string }>;

// Only published products get a page; drafts are a 404 in production.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProducts().map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = getPublishedProduct((await params).id);
  if (!product) return {};
  const price = displayPriceCents(product);
  const description = price !== undefined ? `${product.summary} ${formatPrice(price)}.` : product.summary;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    ...(isLive(product) ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: [{ url: product.image.src, width: product.image.width, height: product.image.height, alt: product.image.alt }],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = getPublishedProduct((await params).id);
  if (!product) notFound();

  const category = getCategory(product.category);
  const price = displayPriceCents(product);
  const related = productsInCategory(product.category).filter((p) => p.slug !== product.slug).slice(0, 4);
  const offer = product.offer;
  const checklist = launchChecklist(product);
  const madeToOrder = isRequestOnly(product);
  const h = product.handmade;
  const gallery = h ? h.photos.slice(1) : [];
  const details = [
    ...(product.details ?? []),
    ...(h?.materials ? [{ label: "Materials", value: h.materials }] : []),
    ...(h?.size ? [{ label: "Size", value: h.size }] : []),
    ...(h?.care ? [{ label: "Care", value: h.care }] : []),
  ];
  const f = h?.fulfillment;
  const fulfillmentNote =
    f?.kind === "made-to-order" && f.leadTimeBusinessDays
      ? `Made to order. Ships in about ${f.leadTimeBusinessDays} business day${f.leadTimeBusinessDays === 1 ? "" : "s"}.`
      : null;

  const productLd =
    isLive(product) && price !== undefined
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.summary,
          image: [absoluteUrl(product.image.src)],
          sku: product.slug,
          brand: offer.kind === "external" ? undefined : { "@type": "Brand", name: site.name },
          category: category?.name,
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/products/${product.slug}`),
            priceCurrency: "USD",
            price: (price / 100).toFixed(2),
            seller: { "@type": "Organization", name: offer.kind === "external" ? offer.merchant : site.name },
          },
        }
      : null;

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Shop all", href: "/shop" },
          ...(category ? [{ name: category.name, href: `/categories/${category.slug}` }] : []),
          { name: product.name, href: `/products/${product.slug}` },
        ]}
      />

      {!isPurchasable(product) && !madeToOrder && offer.kind !== "external" && (
        <Alert tone="info" title="Draft preview" className="mt-4">
          This product is hidden in production until its launch checklist is complete
          {checklist.length > 0 && (
            <>
              . Still missing: {checklist.filter((c) => !c.done).map((c) => c.label.toLowerCase()).join("; ")}
            </>
          )}
          .
        </Alert>
      )}

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <ProductFrame className="aspect-square bg-hb-sand/50">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              priority
              sizes="(min-width: 1152px) 552px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </ProductFrame>
          {product.imageIsPlaceholder && (
            <p className="mt-2 text-xs text-hb-ink/70">Illustration. Each piece is made by hand, so yours will have its own character.</p>
          )}
          {gallery.length > 0 && (
            <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="More photos">
              {gallery.map((g) => (
                <li key={g.src} className="relative aspect-square overflow-hidden rounded-card border border-hb-stone bg-white">
                  <Image src={g.src} alt={g.alt} fill sizes="140px" className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <Link href={`/categories/${category.slug}`} className="text-sm font-semibold uppercase tracking-wide text-hb-moss hover:underline">
                {category.name}
              </Link>
            )}
            {offer.kind === "external" && <Badge variant="partner">Curated partner product</Badge>}
          </div>
          <h1 className="mt-2 text-display-sm sm:text-display-md">{product.name}</h1>
          {price !== undefined ? (
            <Price cents={price} size="lg" className="mt-3" />
          ) : madeToOrder ? (
            <p className="mt-3 text-lg font-semibold text-hb-ink/80">Price on request</p>
          ) : null}
          <p className="mt-4 text-lg leading-relaxed text-hb-ink/80">{product.summary}</p>
          {fulfillmentNote && <p className="mt-3 text-sm font-medium text-hb-moss">{fulfillmentNote}</p>}

          <div className="mt-8">
            {isPurchasable(product) ? (
              <AddToCart slug={product.slug} name={product.name} />
            ) : offer.kind === "external" ? (
              <div className="space-y-3">
                <a href={`/go/${product.slug}`} target="_blank" rel="sponsored noopener noreferrer" className="btn-primary btn-lg w-full sm:w-auto">
                  View partner product at {offer.merchant}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <PartnerDisclosure relationship={offer.relationship} />
              </div>
            ) : madeToOrder ? (
              <div className="surface-card p-6" data-testid="request-panel">
                <p className="eyebrow text-hb-moss">Made to order</p>
                <p className="mt-1 text-lg font-semibold">Order this piece by request</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/contact?subject=${encodeURIComponent(`Order request: ${product.name}`)}&item=${product.slug}`}
                    className="btn-primary btn-lg"
                  >
                    Request this item
                  </Link>
                  <CallLink className="btn-secondary btn-lg" label="Call" />
                </div>
                <ol className="mt-6 space-y-3 border-t border-hb-stone pt-5 text-sm text-hb-ink/80">
                  <li>
                    <span className="font-semibold text-hb-ink">1. Send a request.</span> Tell us the quantity and any color
                    preferences.
                  </li>
                  <li>
                    <span className="font-semibold text-hb-ink">2. Get your quote.</span> We reply with the price, shipping,
                    and timing, plus a secure Stripe payment link.
                  </li>
                  <li>
                    <span className="font-semibold text-hb-ink">3. We make it and ship it.</span> Your piece is made by hand
                    after you order.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="panel">
                <p className="font-semibold">Not available to order yet</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <CallLink className="btn-primary" label="Call" />
                </div>
              </div>
            )}
          </div>

          {details.length > 0 && (
            <section aria-labelledby="details-heading" className="mt-10">
              <h2 id="details-heading" className="text-lg font-semibold">
                Product details
              </h2>
              <dl className="card mt-3 divide-y divide-hb-ink/10">
                {details.map((d) => (
                  <div key={d.label} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                    <dt className="font-medium text-hb-ink/70">{d.label}</dt>
                    <dd className="col-span-2">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <ul className="mt-10 space-y-3 border-t border-hb-ink/10 pt-6 text-sm text-hb-ink/75">
            {offer.kind !== "external" && (
              <>
                <li>
                  <Link href="/shipping-returns" className="font-medium text-hb-ink underline-offset-2 hover:underline">
                    Shipping &amp; returns
                  </Link>
                </li>
                <li>Secure checkout, processed by Stripe.</li>
              </>
            )}
            <li>
              Questions about this product? Call{" "}
              <a href={site.phone.href} className="font-medium text-hb-moss underline underline-offset-2">
                {site.phone.display}
              </a>{" "}
              or{" "}
              <Link href="/contact" className="font-medium text-hb-moss underline underline-offset-2">
                send us a message
              </Link>
              .
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-16">
          <h2 id="related-heading" className="text-display-sm">
            More in {category?.name ?? "this collection"}
          </h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      {productLd && <JsonLd data={productLd} />}
    </div>
  );
}
