// Pricing math for hand-made products. All inputs are the owner's own numbers (dollars, minutes, percents).

export interface PricingInput {
  materials: number;
  packaging: number;
  minutes: number;
  hourly: number;
  /** Payment processor percentage fee, e.g. 2.9 */
  feePct: number;
  /** Payment processor fixed fee per order in dollars, e.g. 0.30 */
  feeFixed: number;
  /** Desired profit as a percent of the selling price, e.g. 30 */
  profitPct: number;
}

export interface PricingResult {
  labor: number;
  cost: number;
  /** Price that covers materials, packaging, labor at the hourly rate, and payment fees. No profit. */
  breakEven: number;
  /** Price that also leaves `profitPct` of the price as profit. null if the percentages leave nothing. */
  target: number | null;
}

const clamp = (x: number, min: number, max: number) => (Number.isFinite(x) ? Math.min(Math.max(x, min), max) : min);

export function computePrice(i: PricingInput): PricingResult {
  const labor = (clamp(i.minutes, 0, 1e6) / 60) * clamp(i.hourly, 0, 1e6);
  const cost = clamp(i.materials, 0, 1e6) + clamp(i.packaging, 0, 1e6) + labor;
  const fee = clamp(i.feePct, 0, 99) / 100;
  const margin = clamp(i.profitPct, 0, 90) / 100;
  const fixed = clamp(i.feeFixed, 0, 1e6);
  const breakEven = (cost + fixed) / (1 - fee);
  const denom = 1 - fee - margin;
  return { labor, cost, breakEven, target: denom > 0 ? (cost + fixed) / denom : null };
}
