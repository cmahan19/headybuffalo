import type { Metadata } from "next";
import Link from "next/link";
import { concepts } from "@/lib/concepts";
import { flags } from "@/lib/flags";
import { readStore } from "@/lib/store";

export const metadata: Metadata = { title: "Overview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const store = await readStore();
  const cards = [
    { href: "/admin/product-concepts", title: "Product concepts", body: `${concepts.length} concepts · readiness gate · scorecards` },
    {
      href: "/admin/marketplace",
      title: "Marketplace",
      body: `${store.sellers.length} seller applications · ${store.listings.length} listings · fee: ${store.feeConfig.platform_fee_status}`,
    },
    { href: "/admin/programs", title: "Subscriptions & affiliates", body: `${store.clicks.length} outbound partner clicks recorded` },
  ];
  return (
    <div className="container-page py-8">
      <h1 className="text-display-sm">Admin overview</h1>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="surface-card block p-5 transition hover:bg-hb-yellow/20">
              <span className="block text-lg font-bold">{c.title}</span>
              <span className="mt-1 block text-sm text-hb-ink/70">{c.body}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="panel mt-8" aria-labelledby="flags-heading">
        <h2 id="flags-heading" className="text-lg font-bold">Feature flags</h2>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2" data-testid="flag-list">
          {Object.entries(flags).map(([k, v]) => (
            <li key={k}>
              <code>{k}</code>: <strong data-flag={k}>{v ? "ON" : "OFF"}</strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
