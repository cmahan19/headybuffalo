import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "../components/ProductCard";
import EmptyStateGlow from "../components/art/EmptyStateGlow";
import { publishedCategories, searchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; query?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = sp.q ?? sp.query ?? "";
  const q = (Array.isArray(raw) ? raw[0] : raw).slice(0, 100);
  const results = searchProducts(q);

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-display-sm sm:text-display-md">Search</h1>
      <form action="/search" role="search" className="mt-6 flex max-w-xl gap-2">
        <label htmlFor="search-q" className="sr-only">
          Search products
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search products"
          autoFocus={!q}
          className="field flex-1 rounded-full px-5"
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="mt-8" aria-live="polite">
        {q ? (
          results.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-hb-ink/70">
                {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
              </p>
              <ProductGrid products={results} />
            </>
          ) : (
            <EmptyStateGlow
              title={`No products match “${q}”`}
              actions={
                <>
                  {publishedCategories().map((c) => (
                    <Link key={c.slug} href={`/categories/${c.slug}`} className="btn-secondary">
                      {c.name}
                    </Link>
                  ))}
                  <Link href="/shop" className="btn-primary">
                    Browse the shop
                  </Link>
                </>
              }
            >
              Try a shorter search, or browse the shop.
            </EmptyStateGlow>
          )
        ) : (
          <p className="text-hb-ink/70">Search by product name or category.</p>
        )}
      </div>
    </div>
  );
}
