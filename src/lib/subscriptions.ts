import { flags } from "./flags";

// Subscription architecture. OFF by default (SUBSCRIPTIONS_ENABLED=false) and cannot start without:
// the flag, a real billing provider, an ACTIVE plan with a real price and published policies, and an
// explicit (never pre-checked) consent record. See docs/SUBSCRIPTION_PLAN.md.

export type SubscriptionModel = "REFILL" | "SEASONAL_BOX" | "DIGITAL_MEMBERSHIP" | "SELLER_PRO";
export type SubscriptionFrequency = "WEEKLY" | "EVERY_2_WEEKS" | "MONTHLY" | "EVERY_2_MONTHS" | "QUARTERLY" | "SEASONAL";
export type SubscriptionStatus = "PENDING_CONSENT" | "ACTIVE" | "PAUSED" | "CANCELED" | "PAST_DUE";

export interface SubscriptionPlan {
  id: string;
  model: SubscriptionModel;
  name: string;
  /** Real products only. Refill plans require an actual consumable/refill product. */
  productSlugs: string[];
  frequencies: SubscriptionFrequency[];
  /** null until the owner sets a real recurring price. No discount field exists on purpose. */
  priceCents: number | null;
  renewalTerms: string | null;
  cancellationPolicy: string | null;
  refundPolicy: string | null;
  /** What a seasonal box does and does not guarantee. */
  contentsDisclosure: string | null;
  status: "DRAFT" | "ACTIVE" | "RETIRED";
}

export interface SubscriptionProduct {
  planId: string;
  productSlug: string;
  quantity: number;
}

export interface SubscriptionConsent {
  /** Must be true from an explicit user action. Forms must render the box unchecked. */
  accepted: boolean;
  /** The exact recurring-billing disclosure the customer saw. */
  disclosureText: string;
  acceptedAt: string;
  ipHash?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  frequency: SubscriptionFrequency;
  nextDate: string | null;
  skippedDates: string[];
  consent: SubscriptionConsent | null;
  history: { at: string; from: SubscriptionStatus; to: SubscriptionStatus; note?: string }[];
}

export const billingProviderConfigured = () => Boolean(process.env.SUBSCRIPTION_BILLING_PROVIDER);

/** The disclosure shown next to any subscribe control. */
export function recurringDisclosure(plan: SubscriptionPlan, frequency: SubscriptionFrequency): string | null {
  if (plan.priceCents === null || !plan.renewalTerms || !plan.cancellationPolicy) return null;
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(plan.priceCents / 100);
  return `You'll be charged ${price} ${frequency.toLowerCase().replace(/_/g, " ")} until you cancel. ${plan.renewalTerms} ${plan.cancellationPolicy}`;
}

export function canStartSubscription(plan: SubscriptionPlan, consent: SubscriptionConsent | null): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!flags.SUBSCRIPTIONS_ENABLED) errors.push("Subscriptions are disabled (SUBSCRIPTIONS_ENABLED=false)");
  if (!billingProviderConfigured()) errors.push("No billing provider is configured");
  if (plan.status !== "ACTIVE") errors.push("Plan is not active");
  if (plan.priceCents === null) errors.push("Plan has no owner-approved price");
  if (!plan.renewalTerms || !plan.cancellationPolicy || !plan.refundPolicy) errors.push("Renewal, cancellation, and refund policies are required");
  if (plan.productSlugs.length === 0 && plan.model !== "DIGITAL_MEMBERSHIP") errors.push("Plan has no real products");
  if (plan.model === "SEASONAL_BOX" && !plan.contentsDisclosure) errors.push("Seasonal box needs a contents disclosure");
  if (!consent || consent.accepted !== true || !consent.disclosureText.trim()) errors.push("Explicit recurring-billing consent is required");
  return { ok: errors.length === 0, errors };
}

type Action = "pause" | "resume" | "skip" | "cancel";

/** Customer self-service. Cancel is always available from ACTIVE, PAUSED, or PAST_DUE. */
export function applyAction(s: Subscription, action: Action, opts: { date?: string } = {}): { ok: true; next: Subscription } | { ok: false; error: string } {
  const at = new Date().toISOString();
  const move = (to: SubscriptionStatus, note?: string): Subscription => ({
    ...s,
    status: to,
    history: [...s.history, { at, from: s.status, to, note }],
  });
  switch (action) {
    case "pause":
      return s.status === "ACTIVE" ? { ok: true, next: move("PAUSED") } : { ok: false, error: "Only active subscriptions can be paused" };
    case "resume":
      return s.status === "PAUSED" ? { ok: true, next: move("ACTIVE") } : { ok: false, error: "Only paused subscriptions can be resumed" };
    case "skip":
      if (s.status !== "ACTIVE" || !opts.date) return { ok: false, error: "Skip requires an active subscription and a date" };
      return { ok: true, next: { ...s, skippedDates: [...s.skippedDates, opts.date] } };
    case "cancel":
      return s.status === "CANCELED" ? { ok: false, error: "Already canceled" } : { ok: true, next: { ...move("CANCELED"), nextDate: null } };
  }
}

/** No plans exist until real subscription products do. */
export const subscriptionPlans: SubscriptionPlan[] = [];
