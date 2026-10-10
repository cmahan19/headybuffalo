import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false, nocache: true },
};

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/launch", label: "Launch board" },
  { href: "/admin/product-concepts", label: "Product concepts" },
  { href: "/admin/marketplace", label: "Marketplace" },
  { href: "/admin/programs", label: "Subscriptions & affiliates" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-hb-surface-muted">
      <div className="border-b-2 border-hb-ink bg-hb-charcoal text-white">
        <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-sm">
          <span className="font-bold uppercase tracking-wider text-hb-sage">Private admin</span>
          <nav aria-label="Admin">
            <ul className="flex flex-wrap gap-4">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="font-medium hover:underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <form action={logout} className="ml-auto">
            <button type="submit" className="font-medium underline">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
