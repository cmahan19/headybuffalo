import { findClaims } from "../claims";

// Provider abstractions. Only mock/local implementations exist until the owner signs agreements and
// supplies credentials (e.g. Stripe Connect for payments and payouts, Stripe Tax, an ID-verification
// vendor). Every mock refuses to move money.

export interface MarketplacePaymentProvider {
  createSplitPayment(input: { amountCents: number; sellerAccountId: string; platformFeeCents: number }): Promise<never>;
}
export interface SellerPayoutProvider {
  createPayout(input: { sellerAccountId: string; amountCents: number }): Promise<never>;
}
export interface MarketplaceTaxProvider {
  calculateTax(input: { amountCents: number; shipTo: string }): Promise<never>;
}
export interface SellerVerificationProvider {
  startVerification(sellerId: string): Promise<{ status: "PENDING" }>;
}
export interface ProductModerationProvider {
  screen(text: string): Promise<{ flagged: boolean; terms: string[] }>;
}
export interface SellerShippingProvider {
  quote(input: { weightGrams: number; to: string }): Promise<never>;
}

export class ProviderNotConfiguredError extends Error {
  constructor(what: string) {
    super(`${what} is not configured. It requires owner agreements, credentials, and legal/accounting review.`);
  }
}

const refuse = (what: string) => async (): Promise<never> => {
  throw new ProviderNotConfiguredError(what);
};

export const mockProviders: {
  payments: MarketplacePaymentProvider;
  payouts: SellerPayoutProvider;
  tax: MarketplaceTaxProvider;
  verification: SellerVerificationProvider;
  moderation: ProductModerationProvider;
  shipping: SellerShippingProvider;
} = {
  payments: { createSplitPayment: refuse("Marketplace payment splitting") },
  payouts: { createPayout: refuse("Seller payouts") },
  tax: { calculateTax: refuse("Marketplace tax calculation") },
  verification: { startVerification: async () => ({ status: "PENDING" }) },
  moderation: {
    screen: async (text: string) => {
      const terms = [...new Set(findClaims(text).map((c) => c.term))];
      return { flagged: terms.length > 0, terms };
    },
  },
  shipping: { quote: refuse("Seller shipping quotes") },
};
