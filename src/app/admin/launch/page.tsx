import type { Metadata } from "next";
import Image from "next/image";
import PricingCalculator from "./PricingCalculator";
import { LAUNCH_PRIORITY, handmadeProducts } from "@/data/handmade-products";
import { formatPrice, isPurchasable, launchChecklist, shippingConfigured } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Launch board", robots: { index: false, follow: false } };

export default function LaunchBoard() {
  const rows = handmadeProducts.map((p) => {
    const checks = launchChecklist(p);
    return { p, checks, done: checks.filter((c) => c.done).length, live: isPurchasable(p) };
  });
  const liveCount = rows.filter((r) => r.live).length;

  return (
    <div className="container-page space-y-8 py-8">
      <div>
        <h1 className="text-display-sm">Launch board</h1>
        <p className="mt-2 max-w-prose text-hb-ink/75">
          {liveCount} of {rows.length} products are live. A product goes on sale automatically when every item in its
          checklist is done. Fill in <code>src/data/handmade-products.ts</code> and add photos to{" "}
          <code>public/products/&lt;slug&gt;/</code> (step-by-step: docs/LAUNCH_GUIDE.md).
        </p>
        <p className={`mt-2 text-sm font-semibold ${shippingConfigured() ? "text-hb-success" : "text-hb-error"}`} data-testid="shipping-status">
          Shop shipping rate:{" "}
          {site.shipping.flatRateCents !== null
            ? `${formatPrice(site.shipping.flatRateCents)} per order${site.shipping.freeOverCents !== null ? `, free over ${formatPrice(site.shipping.freeOverCents)}` : ""}`
            : "not set (required before anything can launch), set it in src/lib/site.ts"}
        </p>
      </div>

      <PricingCalculator />

      <ol className="space-y-4" data-testid="launch-list">
        {rows.map(({ p, checks, done, live }) => (
          <li key={p.slug} data-testid="launch-row" className="surface-card grid gap-4 p-4 sm:grid-cols-[96px_1fr]">
            <div className="relative aspect-[4/5] w-24 overflow-hidden rounded-card bg-hb-sand">
              <Image src={p.image.src} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {LAUNCH_PRIORITY.includes(p.slug) && (
                  <span className="rounded-full bg-hb-moss px-2.5 py-0.5 text-xs font-semibold text-white">Launch first</span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${live ? "bg-hb-success text-white" : "bg-hb-surface-muted text-hb-ink"}`}
                >
                  {live ? "Live" : `${done} / ${checks.length} ready`}
                </span>
                <code className="text-xs text-hb-ink/60">{p.slug}</code>
              </div>
              <h2 className="mt-1 text-lg font-bold">{p.name}</h2>
              <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {checks.map((c) => (
                  <li key={c.key} className={c.done ? "text-hb-success" : "text-hb-ink/70"}>
                    <span aria-hidden="true">{c.done ? "✓" : "○"}</span> {c.label}
                    <span className="sr-only">{c.done ? " (done)" : " (missing)"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
