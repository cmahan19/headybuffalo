import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";
import CallLink from "../components/CallLink";
import CollectionNav from "../components/CollectionNav";
import { ProductGrid } from "../components/ProductCard";
import CollectionBanner from "../components/art/CollectionBanner";
import EmptyStateGlow from "../components/art/EmptyStateGlow";
import { showConceptShowcase } from "@/lib/flags";
import { publishedProducts } from "@/lib/catalog";

const hasProducts = publishedProducts().length > 0;

export const metadata: Metadata = {
  title: "Shop handmade",
  description: "Handmade patches, stamped totes, macramé, cards, gifts, and home goods, made to order by Heady Buffalo.",
  alternates: { canonical: "/shop" },
  // An empty catalog page is thin content; keep it out of search until products are live.
  ...(hasProducts ? {} : { robots: { index: false, follow: true } }),
};

export default function ShopPage() {
  const products = publishedProducts();

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ name: "Shop all", href: "/shop" }]} />
      <div className="mt-4">
        <CollectionBanner
          artId="banner-chrome"
          priority
          eyebrow="Handmade to order"
          title="Shop handmade"
          description={
            products.length > 0
              ? `${products.length} pieces, each made by hand after you order. Request any item and we’ll reply with price and timing.`
              : "Our first pieces are on the way."
          }
        />
      </div>
      {products.length > 0 ? (
        <>
          <div className="mt-6">
            <CollectionNav current="all" />
          </div>
          <div className="mt-8">
            <ProductGrid products={products} prioritizeFirst={4} />
          </div>
        </>
      ) : (
        <div className="mt-8">
          <EmptyStateGlow
            title="Products are coming soon"
            actions={
              <>
                <CallLink className="btn-primary" label="Call" />
                {showConceptShowcase ? (
                  <Link href="/ideas" className="btn-secondary">
                    See ideas we’re exploring
                  </Link>
                ) : (
                  <Link href={`/contact?subject=${encodeURIComponent("Launch updates")}`} className="btn-secondary">
                    Send us a message
                  </Link>
                )}
              </>
            }
          >
            We list each product once its details, price, and photos have been confirmed. In the meantime, we’re happy
            to answer questions.
          </EmptyStateGlow>
        </div>
      )}
    </div>
  );
}
