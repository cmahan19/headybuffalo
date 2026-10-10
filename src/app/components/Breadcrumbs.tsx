import Link from "next/link";
import JsonLd from "./JsonLd";
import { absoluteUrl } from "@/lib/site";

export interface Crumb {
  name: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-hb-ink/70">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-hb-ink/80">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-hb-moss hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  );
}
