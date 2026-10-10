import type { Metadata } from "next";
import Link from "next/link";
import CollectionCard from "./components/CollectionCard";
import { ProductGrid } from "./components/ProductCard";
import ArtBackground from "./components/art/ArtBackground";
import CallToAction from "./components/art/CallToAction";
import HeroBanner from "./components/art/HeroBanner";
import LineIcon, { type IconName } from "./components/art/LineIcon";
import SectionDivider from "./components/art/SectionDivider";
import { LAUNCH_PRIORITY } from "@/data/handmade-products";
import { publishedCategories, publishedProducts } from "@/lib/catalog";
import { flags } from "@/lib/flags";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Every statement here must stay true without owner-supplied evidence (no product or eco claims).
const reasons: { title: string; body: string; icon: IconName; color: string }[] = [
  { title: "Made by hand, to order", body: "Your piece is made after you order it, not pulled from a warehouse shelf.", icon: "thread", color: "text-hb-moss" },
  { title: "Talk to a real person", body: `Questions about color, size, or timing? Call ${site.phone.display} or send a note.`, icon: "person", color: "text-hb-teal-deep" },
  { title: "Secure payment", body: "Pay through Stripe. Your full card number is never shared with us.", icon: "shield", color: "text-hb-orange-deep" },
];

const steps = [
  { n: "01", title: "Pick a piece", body: "Browse patches, totes, macramé, cards, and home goods." },
  { n: "02", title: "Send a request", body: "Tell us the quantity and any color preferences. We reply with price, shipping, and timing." },
  { n: "03", title: "We make it and ship it", body: "Pay with a secure Stripe link. Your piece is made by hand and sent to you." },
];

export default function HomePage() {
  const products = publishedProducts();
  const collections = publishedCategories();
  const featuredSlugs = [...LAUNCH_PRIORITY, "macrame-keychain", "block-printed-greeting-cards", "stamped-cotton-bandana", "painted-wood-ornaments"];
  const featured = featuredSlugs.flatMap((slug) => products.filter((p) => p.slug === slug)).slice(0, 8);

  return (
    <>
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={`${site.name} · Handmade to order`}
        title="Handmade goods for everyday living."
        description="Embroidered patches, stamped totes, macramé, block-printed cards, and small-batch home goods. Made by hand, made for you."
        actions={
          <>
            <Link href="/shop" className="btn-light btn-lg">
              Shop handmade
            </Link>
            {flags.MARKETPLACE_ENABLED && (
              <Link href="/makers" className="btn-on-dark btn-lg">
                Explore maker finds
              </Link>
            )}
            <a href={site.phone.href} className="btn-on-dark btn-lg">
              Call {site.phone.display}
            </a>
          </>
        }
      />

      {/* 2. Reasons to buy */}
      <section aria-label="Why shop with us" className="border-b border-hb-stone bg-white">
        <ul className="container-page grid gap-6 py-8 sm:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.title} className="flex gap-4">
              <LineIcon name={r.icon} size={28} className={`mt-0.5 shrink-0 ${r.color}`} />
              <div>
                <p className="font-semibold text-hb-ink">{r.title}</p>
                <p className="mt-1 text-sm text-hb-ink/70">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Collections */}
      {collections.length > 0 && (
        <section aria-labelledby="collections-heading" className="container-page py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-hb-moss">Collections</p>
              <h2 id="collections-heading" className="mt-1 text-display-sm">
                Shop by collection
              </h2>
            </div>
            <Link href="/shop" className="btn-link text-sm">
              Shop all {products.length} pieces
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c) => (
              <li key={c.slug}>
                <CollectionCard category={c} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 4. Featured */}
      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="container-page pb-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-hb-moss">Start here</p>
              <h2 id="featured-heading" className="mt-1 text-display-sm">
                Good places to start
              </h2>
            </div>
            <Link href="/shop" className="btn-secondary">
              View all
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid products={featured} prioritizeFirst={4} />
          </div>
        </section>
      )}

      {/* 5. How ordering works */}
      <section aria-labelledby="steps-heading" className="bg-hb-charcoal py-16 text-white">
        <div className="container-page">
          <p className="eyebrow text-hb-sage">How ordering works</p>
          <h2 id="steps-heading" className="chrome-text mt-1 pb-1 text-display-sm">
            Three steps, one real person
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.n} data-art-module="principle-card" className="chrome-surface rounded-panel p-6">
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${["bg-hb-sage", "bg-hb-aqua", "bg-hb-yellow"][i]}`} />
                <p className="text-sm font-semibold text-hb-chrome-mid">{s.n}</p>
                <p className="mt-2 text-xl font-semibold">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-hb-chrome-light">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Gift spotlight */}
      <section aria-labelledby="gifts-heading" className="container-page py-16">
        <div className="relative isolate grid overflow-hidden rounded-panel shadow-soft md:grid-cols-2">
          <ArtBackground artId="banner-gifts" sizes="(min-width: 1152px) 1152px, 100vw" />
          <div className="m-4 rounded-card bg-white/95 p-6 backdrop-blur-sm sm:m-8 sm:p-8">
            <p className="eyebrow text-hb-pink-deep">Gifts</p>
            <h2 id="gifts-heading" className="mt-1 text-display-sm">
              Handmade gifts that feel personal
            </h2>
            <p className="mt-3 text-hb-ink/75">
              Block-printed cards, pressed-flower bookmarks, painted ornaments, and scrunchie sets. Ask about colors when you
              order.
            </p>
            <Link href="/categories/gifts" className="btn-primary mt-6">
              Shop gifts
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page">
        <SectionDivider />
      </div>

      {/* 7. Custom request CTA */}
      <div className="container-page py-14">
        <CallToAction
          id="final-cta-heading"
          title="Have something specific in mind?"
          body="Ask about colors, quantities, or a piece you don’t see in the shop. We’ll tell you what’s possible."
          actions={
            <>
              <a href={site.phone.href} className="btn-light">
                Call {site.phone.display}
              </a>
              <Link href={`/contact?subject=${encodeURIComponent("Custom request")}`} className="btn-on-dark">
                Send a request
              </Link>
            </>
          }
        />
      </div>
    </>
  );
}
