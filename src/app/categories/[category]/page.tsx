import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import CollectionNav from "../../components/CollectionNav";
import { ProductGrid } from "../../components/ProductCard";
import CollectionBanner from "../../components/art/CollectionBanner";
import { collectionBanner } from "@/lib/colorMap";
import { getPublishedCategory, productsInCategory, publishedCategories } from "@/lib/catalog";

type Params = Promise<{ category: string }>;

// Only collections with published products exist as pages; everything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = getPublishedCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const category = getPublishedCategory((await params).category);
  if (!category) notFound();
  const items = productsInCategory(category.slug);

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Shop all", href: "/shop" },
          { name: category.name, href: `/categories/${category.slug}` },
        ]}
      />
      <div className="mt-4">
        <CollectionBanner
          artId={collectionBanner(category.slug)}
          priority
          eyebrow="Collection"
          title={category.name}
          description={category.description}
        />
      </div>
      <div className="mt-6">
        <CollectionNav current={category.slug} />
      </div>
      <div className="mt-8">
        <ProductGrid products={items} prioritizeFirst={4} />
      </div>
    </div>
  );
}
