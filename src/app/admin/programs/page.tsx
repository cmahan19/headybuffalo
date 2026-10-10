import type { Metadata } from "next";
import { products } from "@/lib/catalog";
import { flags } from "@/lib/flags";
import { billingProviderConfigured, subscriptionPlans } from "@/lib/subscriptions";
import { readStore } from "@/lib/store";

export const metadata: Metadata = { title: "Subscriptions & affiliates", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Programs() {
  const d = await readStore();
  const external = products.filter((p) => p.offer.kind === "external");
  const byProduct = d.clicks.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.productSlug]: (acc[c.productSlug] ?? 0) + 1 }), {});

  return (
    <div className="container-page space-y-8 py-8">
      <h1 className="text-display-sm">Subscriptions &amp; affiliates</h1>

      <section className="panel" aria-labelledby="subs-heading">
        <h2 id="subs-heading" className="text-lg font-bold">Subscriptions</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>SUBSCRIPTIONS_ENABLED: <strong data-testid="subs-flag">{flags.SUBSCRIPTIONS_ENABLED ? "ON" : "OFF"}</strong></li>
          <li>Billing provider configured: <strong>{billingProviderConfigured() ? "yes" : "no"}</strong></li>
          <li>Plans: <strong>{subscriptionPlans.length}</strong> (none until real subscription products, prices, and policies exist)</li>
        </ul>
        <p className="mt-2 text-sm text-hb-ink/70">
          Supported models: refill (real consumables only), seasonal maker box, digital membership, seller pro plan. Nothing can
          charge until the flag, a provider, an ACTIVE plan with a real price and policies, and explicit consent all exist. See
          docs/SUBSCRIPTION_PLAN.md.
        </p>
      </section>

      <section className="panel" aria-labelledby="aff-heading">
        <h2 id="aff-heading" className="text-lg font-bold">Affiliate &amp; partner products</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>AFFILIATE_PRODUCTS_ENABLED: <strong data-testid="aff-flag">{flags.AFFILIATE_PRODUCTS_ENABLED ? "ON" : "OFF"}</strong></li>
          <li>External offers in catalog: <strong>{external.length}</strong></li>
          <li>Outbound clicks recorded: <strong>{d.clicks.length}</strong> (clicks only; sales are never recorded without verified partner data)</li>
        </ul>
        {external.length > 0 && (
          <table className="mt-3 w-full text-left text-sm">
            <thead><tr><th>Product</th><th>Merchant</th><th>Relationship</th><th>Clicks</th></tr></thead>
            <tbody>
              {external.map((p) => (
                <tr key={p.slug}>
                  <td>{p.name}</td>
                  <td>{p.offer.kind === "external" && p.offer.merchant}</td>
                  <td>{p.offer.kind === "external" && p.offer.relationship}</td>
                  <td>{byProduct[p.slug] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-2 text-sm text-hb-ink/70">Commission rates, if any, are stored privately and never shown publicly. See docs/AFFILIATE_PARTNER_PLAN.md.</p>
      </section>
    </div>
  );
}
