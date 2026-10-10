import type { FeeConfig } from "./types";

// Marketplace fees are NEVER assumed. Until an owner/admin explicitly confirms a configuration,
// no fee can be calculated or applied anywhere. Fee details are server-side only.

export const DEFAULT_FEE_CONFIG: FeeConfig = {
  platform_fee_percent: null,
  fixed_fee_cents: null,
  category_fee_percent: {},
  seller_plan_override_percent: null,
  platform_fee_status: "REQUIRES_OWNER_CONFIGURATION",
};

export class FeeNotConfiguredError extends Error {
  constructor() {
    super("Marketplace fee requires owner configuration before it can be calculated");
  }
}

export function calculatePlatformFeeCents(
  config: FeeConfig,
  { amountCents, category, hasPlanOverride = false }: { amountCents: number; category?: string; hasPlanOverride?: boolean }
): number {
  if (config.platform_fee_status !== "OWNER_CONFIGURED" || config.platform_fee_percent === null) {
    throw new FeeNotConfiguredError();
  }
  const percent =
    (hasPlanOverride && config.seller_plan_override_percent !== null ? config.seller_plan_override_percent : undefined) ??
    (category ? config.category_fee_percent[category] : undefined) ??
    config.platform_fee_percent;
  return Math.round((amountCents * percent) / 100) + (config.fixed_fee_cents ?? 0);
}

export interface FeeInput {
  percent: string;
  fixedCents: string;
  confirm: boolean;
  confirmPhrase: string;
  actor: string;
}

export const FEE_CONFIRM_PHRASE = "CONFIRM FEES";

/** Validates an admin's fee submission. Requires an explicit confirmation checkbox and a typed phrase. */
export function buildFeeConfig(
  current: FeeConfig,
  input: FeeInput
): { ok: true; config: FeeConfig } | { ok: false; error: string } {
  const percent = Number(input.percent);
  const fixed = input.fixedCents.trim() === "" ? 0 : Number(input.fixedCents);
  if (input.percent.trim() === "" || !Number.isFinite(percent) || percent < 0 || percent > 50) {
    return { ok: false, error: "Enter a platform fee percent between 0 and 50." };
  }
  if (!Number.isInteger(fixed) || fixed < 0) {
    return { ok: false, error: "Fixed fee must be a whole number of cents (0 or more)." };
  }
  if (!input.confirm || input.confirmPhrase.trim() !== FEE_CONFIRM_PHRASE) {
    return { ok: false, error: `Check the confirmation box and type "${FEE_CONFIRM_PHRASE}" to activate a fee.` };
  }
  return {
    ok: true,
    config: {
      ...current,
      platform_fee_percent: percent,
      fixed_fee_cents: fixed,
      platform_fee_status: "OWNER_CONFIGURED",
      confirmed_by: input.actor,
      confirmed_at: new Date().toISOString(),
    },
  };
}
