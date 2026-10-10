import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CollectionBanner from "../components/art/CollectionBanner";
import EmptyStateGlow from "../components/art/EmptyStateGlow";
import { flags } from "@/lib/flags";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Maker finds", robots: { index: false, follow: true } };

export default async function Makers() {
  if (!flags.MARKETPLACE_ENABLED) notFound();
  const sellers = (await readStore()).sellers.filter((s) => s.status === "APPROVED");
  return (
    <div className="container-page py-8">
      <CollectionBanner artId="banner-craft" priority eyebrow="Maker marketplace" title="Maker finds" description="Goods from independent sellers, each reviewed before listing." />
      {sellers.length === 0 ? (
        <EmptyStateGlow title="No makers yet" actions={<Link href="/sell/apply" className="btn-primary">Apply to sell</Link>}>
          We’re reviewing our first sellers.
        </EmptyStateGlow>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {sellers.map((s) => (
            <li key={s.id}><Link href={`/makers/${s.slug}`} className="surface-card block p-5 font-bold">{s.storeName}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
