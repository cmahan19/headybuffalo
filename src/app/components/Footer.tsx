import Link from "next/link";
import { publishedCategories, publishedProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

const hasProducts = publishedProducts().length > 0;

const columns = [
  {
    title: "Shop",
    links: hasProducts
      ? [
          { href: "/shop", label: "Shop all" },
          ...publishedCategories().map((c) => ({ href: `/categories/${c.slug}`, label: c.name })),
        ]
      : [{ href: "/shop", label: "Products (coming soon)" }],
  },
  {
    title: "Help",
    links: [
      { href: "/contact", label: "Contact us" },
      { href: "/shipping-returns", label: "Shipping & returns" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Heady Buffalo" },
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms", label: "Terms" },
      { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-hb-ink text-white/80">
      <div aria-hidden="true" className="accent-line h-1 w-full" />
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">{site.name}</p>
          <p className="mt-2 text-sm leading-relaxed">{site.tagline}.</p>
          <p className="mt-4">
            <a href={site.phone.href} className="text-base font-semibold text-white hover:text-hb-sage">
              {site.phone.display}
            </a>
          </p>
          {site.supportEmail && (
            <p className="mt-1">
              <a href={`mailto:${site.supportEmail}`} className="text-sm text-white hover:text-hb-sage">
                {site.supportEmail}
              </a>
            </p>
          )}
          {site.social.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-hb-sage">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-hb-sage">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-white/60">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
