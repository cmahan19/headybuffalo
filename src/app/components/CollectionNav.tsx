import Link from "next/link";
import { publishedCategories, publishedProducts } from "@/lib/catalog";

/** Horizontal collection switcher. `current` is a category slug, or "all" for the shop page. */
export default function CollectionNav({ current }: { current: string }) {
  const items = [
    { key: "all", href: "/shop", label: `All (${publishedProducts().length})` },
    ...publishedCategories().map((c) => ({ key: c.slug, href: `/categories/${c.slug}`, label: c.name })),
  ];

  return (
    <nav aria-label="Collections" className="-mx-4 overflow-x-auto px-4 pb-1">
      <ul className="flex gap-2 whitespace-nowrap">
        {items.map((i) => (
          <li key={i.key}>
            {i.key === current ? (
              <span aria-current="page" className="pill-active">
                {i.label}
              </span>
            ) : (
              <Link href={i.href} className="pill">
                {i.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
