import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createReport } from "../../sell/actions";
import CollectionBanner from "../../components/art/CollectionBanner";
import { formatPrice } from "@/lib/catalog";
import { flags } from "@/lib/flags";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: true } };

/** Seller storefront. Only APPROVED sellers and ACTIVE listings are shown. */
export default async function MakerStorefront({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reported?: string; reportError?: string }>;
}) {
  if (!flags.MARKETPLACE_ENABLED) notFound();
  const { slug } = await params;
  const { reported, reportError } = await searchParams;
  const d = await readStore();
  const seller = d.sellers.find((s) => s.slug === slug && s.status === "APPROVED");
  if (!seller) notFound();
  const listings = d.listings.filter((l) => l.sellerId === seller.id && l.status === "ACTIVE");

  return (
    <div className="container-page py-8">
      <CollectionBanner artId="banner-craft" priority eyebrow="Independent seller" title={seller.storeName} description="Sold and shipped by this seller. Shipping and returns follow the seller’s policy shown on each listing." />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <li key={l.id} className="surface-card p-4 text-sm">
            <p className="text-lg font-bold">{l.title}</p>
            {l.priceCents && <p className="font-semibold">{formatPrice(l.priceCents)}</p>}
            <p className="mt-2 text-hb-ink/75">{l.description}</p>
            <p className="mt-2"><strong>Material details provided by the seller:</strong> {l.materialDetails}</p>
            <p className="mt-1"><strong>Shipping:</strong> {l.shippingMethod}</p>
            <p className="mt-1"><strong>Returns:</strong> {l.returnPolicy}</p>
          </li>
        ))}
      </ul>
      {listings.length === 0 && <p className="mt-8 text-hb-ink/70">No active listings from this seller yet.</p>}

      <section aria-labelledby="report-heading" className="panel mt-10 max-w-xl">
        <h2 id="report-heading" className="text-lg font-bold">Report a problem with this seller</h2>
        {reported ? (
          <p role="status" className="mt-2 text-sm text-hb-success">Thanks. Our team will review your report.</p>
        ) : (
          <form action={createReport} className="mt-3 space-y-3">
            {reportError && <p role="alert" className="text-sm text-hb-error">Please choose a reason and add details.</p>}
            <input type="hidden" name="sellerId" value={seller.id} />
            <input type="hidden" name="sellerSlug" value={seller.slug} />
            <div className="absolute -left-[9999px]" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
            <label className="block"><span className="field-label">Reason</span>
              <select name="reason" className="field mt-1" defaultValue="">
                <option value="" disabled>Choose…</option>
                <option>Misleading claim</option><option>Item not as described</option><option>Order problem</option><option>Prohibited item</option><option>Other</option>
              </select>
            </label>
            <label className="block"><span className="field-label">Details</span><textarea name="details" rows={3} className="field mt-1" /></label>
            <button type="submit" className="btn-secondary">Send report</button>
          </form>
        )}
      </section>
    </div>
  );
}
