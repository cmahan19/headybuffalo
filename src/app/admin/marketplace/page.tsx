import type { Metadata } from "next";
import { decideSeller, moderateListing, resetFeeConfig, resolveReport, saveFeeConfig } from "./actions";
import { formatPrice } from "@/lib/catalog";
import { flags } from "@/lib/flags";
import { FEE_CONFIRM_PHRASE } from "@/lib/marketplace/fees";
import { readStore } from "@/lib/store";

export const metadata: Metadata = { title: "Marketplace", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MarketplaceAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const d = await readStore();
  const fee = d.feeConfig;
  const queue = d.listings.filter((l) => l.status === "PENDING_REVIEW");

  return (
    <div className="container-page space-y-8 py-8">
      <div>
        <h1 className="text-display-sm">Marketplace</h1>
        <p className="mt-2 max-w-prose text-hb-ink/75">
          Marketplace is <strong data-testid="marketplace-flag">{flags.MARKETPLACE_ENABLED ? "ENABLED" : "DISABLED"}</strong>. Payouts, split
          payments, and sales tax use mock providers that refuse to move money until the owner signs agreements (see
          docs/MARKETPLACE_LAUNCH_REQUIREMENTS.md).
        </p>
      </div>
      {ok && <p role="status" className="rounded-card border-2 border-hb-success bg-white p-3 text-sm font-medium text-hb-success">{ok}</p>}
      {error && <p role="alert" className="rounded-card border-2 border-hb-error bg-white p-3 text-sm font-medium text-hb-error">{error}</p>}

      <section className="panel" aria-labelledby="fee-heading">
        <h2 id="fee-heading" className="text-lg font-bold">Platform fee</h2>
        <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2" data-testid="fee-config">
          <div><dt className="inline font-semibold">platform_fee_status: </dt><dd className="inline" data-testid="fee-status">{fee.platform_fee_status}</dd></div>
          <div><dt className="inline font-semibold">platform_fee_percent: </dt><dd className="inline">{fee.platform_fee_percent === null ? "null" : `${fee.platform_fee_percent}%`}</dd></div>
          <div><dt className="inline font-semibold">fixed_fee_cents: </dt><dd className="inline">{fee.fixed_fee_cents ?? "null"}</dd></div>
          {fee.confirmed_at && <div><dt className="inline font-semibold">Confirmed: </dt><dd className="inline">{fee.confirmed_by} at {fee.confirmed_at}</dd></div>}
        </dl>
        <p className="mt-2 text-sm text-hb-ink/70">
          No fee is ever calculated while the status is REQUIRES_OWNER_CONFIGURATION. Fee details are server-side only
          and never shown publicly. Confirm rates with your accountant and payment provider first.
        </p>
        <form action={saveFeeConfig} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <label><span className="field-label">Platform fee %</span><input name="percent" inputMode="decimal" className="field mt-1" /></label>
          <label><span className="field-label">Fixed fee (cents)</span><input name="fixedCents" inputMode="numeric" className="field mt-1" /></label>
          <label><span className="field-label">Type “{FEE_CONFIRM_PHRASE}”</span><input name="confirmPhrase" autoComplete="off" className="field mt-1" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="confirm" className="h-4 w-4" /> I confirm these fees are owner-approved</label>
          <button type="submit" className="btn-primary">Confirm fee configuration</button>
        </form>
        <form action={resetFeeConfig} className="mt-2">
          <button type="submit" className="btn-link text-sm">Reset to REQUIRES_OWNER_CONFIGURATION</button>
        </form>
      </section>

      <section className="panel" aria-labelledby="sellers-heading">
        <h2 id="sellers-heading" className="text-lg font-bold">Seller applications ({d.sellers.length})</h2>
        {d.sellers.length === 0 ? (
          <p className="mt-2 text-sm text-hb-ink/70">No applications. Sellers apply at /sell/apply when the marketplace is enabled.</p>
        ) : (
          <ul className="mt-3 divide-y divide-hb-ink/10">
            {d.sellers.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <p><strong>{s.storeName}</strong> · {s.contactName} · {s.contactEmail} · <strong>{s.status}</strong></p>
                <p className="text-hb-ink/70">
                  Categories: {s.categories.join(", ") || "—"} · Terms {s.termsAccepted ? "✓" : "✗"} · Policy {s.sellerPolicyAccepted ? "✓" : "✗"} · Ownership{" "}
                  {s.ownershipConfirmed ? "✓" : "✗"} · Verification: {s.verification}
                </p>
                <form className="mt-2 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <input name="note" placeholder="Decision note" className="field w-48 py-1.5 text-sm" />
                  <button formAction={decideSeller.bind(null, "APPROVED")} className="btn-secondary min-h-[40px] px-4 py-1.5">Approve</button>
                  <button formAction={decideSeller.bind(null, "REJECTED")} className="btn-secondary min-h-[40px] px-4 py-1.5">Reject</button>
                  <button formAction={decideSeller.bind(null, "SUSPENDED")} className="btn-secondary min-h-[40px] px-4 py-1.5">Suspend</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel" aria-labelledby="queue-heading">
        <h2 id="queue-heading" className="text-lg font-bold">Listing moderation ({queue.length} pending of {d.listings.length})</h2>
        {d.listings.length === 0 ? (
          <p className="mt-2 text-sm text-hb-ink/70">No seller listings yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-hb-ink/10">
            {d.listings.map((l) => (
              <li key={l.id} className="py-3 text-sm">
                <p><strong>{l.title}</strong> · {l.status} · {l.priceCents ? formatPrice(l.priceCents) : "no price"} · inventory {l.inventory ?? "—"}</p>
                <p className="text-hb-ink/70">
                  Claim review: {l.moderation.claimReview} · Image review: {l.moderation.imageReview} · Photo rights {l.photoRightsConfirmed ? "✓" : "✗"}
                  {l.claimEvidence && ` · Evidence: ${l.claimEvidence}`}
                </p>
                <form className="mt-2 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <input name="note" placeholder="Moderator note" className="field w-48 py-1.5 text-sm" />
                  {["claims-pass", "claims-fail", "images-pass", "images-fail", "approve", "request-changes", "reject", "suspend"].map((a) => (
                    <button key={a} formAction={moderateListing.bind(null, a)} className="btn-secondary min-h-[40px] px-3 py-1.5 text-xs">{a}</button>
                  ))}
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel" aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="text-lg font-bold">Buyer reports ({d.reports.filter((r) => r.status === "OPEN").length} open)</h2>
        {d.reports.length === 0 ? (
          <p className="mt-2 text-sm text-hb-ink/70">No reports.</p>
        ) : (
          <ul className="mt-3 divide-y divide-hb-ink/10">
            {d.reports.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span>{r.reason} · seller {r.sellerId} · {r.status} · {r.details}</span>
                {r.status === "OPEN" && (
                  <form action={resolveReport}><input type="hidden" name="id" value={r.id} /><button className="btn-link text-sm">Mark resolved</button></form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
