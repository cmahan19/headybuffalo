import type { Metadata } from "next";
import { createListingDraft, submitListing } from "../sell/actions";
import { formatPrice } from "@/lib/catalog";
import { readStore } from "@/lib/store";

export const metadata: Metadata = { title: "Seller dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Protected by middleware (admin session + MARKETPLACE_ENABLED). Seller self-service logins need the
// database/auth decision; until then an admin previews the dashboard on a seller's behalf.
export default async function SellerDashboard({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const d = await readStore();
  const approved = d.sellers.filter((s) => s.status === "APPROVED");

  return (
    <div className="container-page space-y-8 py-8">
      <div>
        <h1 className="text-display-sm">Seller dashboard</h1>
        <p className="mt-2 text-sm text-hb-ink/70">Admin preview. Listings start as DRAFT, and only a moderator can make one ACTIVE.</p>
      </div>
      {ok && <p role="status" className="rounded-card border-2 border-hb-success bg-white p-3 text-sm text-hb-success">{ok}</p>}
      {error && <p role="alert" className="rounded-card border-2 border-hb-error bg-white p-3 text-sm text-hb-error">{error}</p>}

      <section className="panel" aria-labelledby="listings-heading">
        <h2 id="listings-heading" className="text-lg font-bold">Listings</h2>
        {d.listings.length === 0 ? (
          <p className="mt-2 text-sm text-hb-ink/70">No listings yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-hb-ink/10 text-sm">
            {d.listings.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span><strong>{l.title}</strong> · {l.status} · {l.priceCents ? formatPrice(l.priceCents) : "no price"}</span>
                {(l.status === "DRAFT" || l.status === "CHANGES_REQUESTED") && (
                  <form action={submitListing}><input type="hidden" name="id" value={l.id} /><button className="btn-secondary min-h-[40px] px-4 py-1.5">Submit for review</button></form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel" aria-labelledby="new-heading">
        <h2 id="new-heading" className="text-lg font-bold">New listing draft</h2>
        {approved.length === 0 ? (
          <p className="mt-2 text-sm text-hb-ink/70">No approved sellers yet. Approve an application in Admin → Marketplace first.</p>
        ) : (
          <form action={createListingDraft} className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="field-label">Seller</span>
              <select name="sellerId" className="field mt-1">{approved.map((s) => <option key={s.id} value={s.id}>{s.storeName}</option>)}</select>
            </label>
            {[
              ["title", "Title"], ["category", "Category"], ["price", "Price (USD)"], ["inventory", "Inventory"],
              ["shippingMethod", "Shipping method"], ["photoUrl", "Photo URL (real product photo)"],
            ].map(([k, l]) => <label key={k}><span className="field-label">{l}</span><input name={k} className="field mt-1" /></label>)}
            {[
              ["description", "Description"], ["materialDetails", "Material details (seller-provided)"], ["returnPolicy", "Return policy"],
              ["safetyInfo", "Safety information (if needed)"], ["claimEvidence", "Evidence for any environmental/health claim"],
            ].map(([k, l]) => <label key={k} className="sm:col-span-2"><span className="field-label">{l}</span><textarea name={k} rows={2} className="field mt-1" /></label>)}
            <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="photoRights" className="h-4 w-4" /> Seller confirms rights to the photos</label>
            <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit">Save draft</button>
          </form>
        )}
      </section>
    </div>
  );
}
