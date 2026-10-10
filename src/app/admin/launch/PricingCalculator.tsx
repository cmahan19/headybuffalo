"use client";

import { useId, useState } from "react";
import { computePrice } from "@/lib/pricing";

// Pricing helper for hand-made products. Every input is the owner's own number; the defaults are only
// starting points to overwrite (check your actual Stripe rate in the Stripe Dashboard).
const fields = [
  { key: "materials", label: "Materials per item ($)", step: "0.01", initial: "" },
  { key: "packaging", label: "Packaging per item ($)", step: "0.01", initial: "" },
  { key: "minutes", label: "Minutes to make one", step: "1", initial: "" },
  { key: "hourly", label: "Your hourly rate ($/hr)", step: "0.5", initial: "" },
  { key: "feePct", label: "Payment fee (%)", step: "0.1", initial: "2.9" },
  { key: "feeFixed", label: "Payment fee per order ($)", step: "0.01", initial: "0.30" },
  { key: "profitPct", label: "Profit margin you want (%)", step: "1", initial: "" },
] as const;

type Key = (typeof fields)[number]["key"];

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function PricingCalculator() {
  const id = useId();
  const [v, setV] = useState<Record<Key, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.initial])) as Record<Key, string>
  );
  const n = (k: Key) => {
    const x = Number(v[k]);
    return Number.isFinite(x) && x >= 0 ? x : 0;
  };

  const { labor, cost, breakEven, target } = computePrice({
    materials: n("materials"),
    packaging: n("packaging"),
    minutes: n("minutes"),
    hourly: n("hourly"),
    feePct: n("feePct"),
    feeFixed: n("feeFixed"),
    profitPct: n("profitPct"),
  });
  const ready = v.materials !== "" && v.minutes !== "" && v.hourly !== "";

  return (
    <section className="panel" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="text-lg font-bold">
        Pricing calculator
      </h2>
      <p className="mt-1 text-sm text-hb-ink/70">
        Enter your real numbers for one item. Time a few real builds before trusting the minutes figure.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((f) => (
          <label key={f.key}>
            <span className="field-label">{f.label}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step={f.step}
              value={v[f.key]}
              onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
              className="field mt-1"
            />
          </label>
        ))}
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-4" aria-live="polite">
        <div className="rounded-card bg-hb-surface-muted p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-hb-ink/70">Your labor</dt>
          <dd className="text-lg font-bold">{money(labor)}</dd>
        </div>
        <div className="rounded-card bg-hb-surface-muted p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-hb-ink/70">Total cost</dt>
          <dd className="text-lg font-bold">{money(cost)}</dd>
        </div>
        <div className="rounded-card bg-hb-surface-muted p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-hb-ink/70">Break-even price</dt>
          <dd className="text-lg font-bold">{ready ? money(breakEven) : "—"}</dd>
        </div>
        <div className="rounded-card bg-hb-moss p-3 text-white">
          <dt className="text-xs font-semibold uppercase tracking-wide">Price at your margin</dt>
          <dd className="text-lg font-bold">{ready && target !== null ? money(target) : "—"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-hb-ink/60">
        Shipping is charged separately at checkout (shop shipping rate). Break-even pays your hourly rate but leaves no
        profit. Enter the final price in cents in src/data/handmade-products.ts (e.g. $24.00 → 2400).
      </p>
    </section>
  );
}
