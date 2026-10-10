"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../actions";
import { DEFAULT_FEE_CONFIG, buildFeeConfig } from "@/lib/marketplace/fees";
import { transitionListing, transitionSeller } from "@/lib/marketplace/listings";
import type { ListingStatus, SellerStatus } from "@/lib/marketplace/types";
import { audit, updateStore, type WriteResult } from "@/lib/store";

const back = (msg: string, tone: "ok" | "error"): never => redirect(`/admin/marketplace?${tone}=${encodeURIComponent(msg)}`);

async function run(mutate: Parameters<typeof updateStore>[0], okMsg: string) {
  let blocked = "";
  const res: WriteResult | null = await updateStore((d) => {
    try {
      mutate(d);
    } catch (e) {
      blocked = e instanceof Error ? e.message : String(e);
      throw e;
    }
  }).catch(() => null);
  if (blocked) back(blocked, "error");
  if (!res || !res.ok) back(res && !res.ok ? res.error : "Save failed", "error");
  revalidatePath("/admin/marketplace");
  back(okMsg, "ok");
}

export async function saveFeeConfig(form: FormData) {
  const actor = await requireAdmin();
  await run((d) => {
    const r = buildFeeConfig(d.feeConfig, {
      percent: String(form.get("percent") ?? ""),
      fixedCents: String(form.get("fixedCents") ?? ""),
      confirm: form.get("confirm") === "on",
      confirmPhrase: String(form.get("confirmPhrase") ?? ""),
      actor,
    });
    if (!r.ok) throw new Error(r.error);
    d.feeConfig = r.config;
    audit(d, { actor, action: "fees.configure", target: "marketplace:fees", to: `${r.config.platform_fee_percent}% + ${r.config.fixed_fee_cents}¢` });
  }, "Fee configuration confirmed");
}

export async function resetFeeConfig() {
  const actor = await requireAdmin();
  await run((d) => {
    d.feeConfig = { ...DEFAULT_FEE_CONFIG };
    audit(d, { actor, action: "fees.reset", target: "marketplace:fees", to: "REQUIRES_OWNER_CONFIGURATION" });
  }, "Fees reset to REQUIRES_OWNER_CONFIGURATION");
}

export async function decideSeller(to: SellerStatus, form: FormData) {
  const actor = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const note = String(form.get("note") ?? "").slice(0, 500);
  await run((d) => {
    const s = d.sellers.find((x) => x.id === id);
    if (!s) throw new Error("Seller not found");
    const t = transitionSeller(s, to);
    if (!t.ok) throw new Error(t.errors.join("; "));
    audit(d, { actor, action: "seller.status", target: `seller:${id}`, from: s.status, to, note });
    s.status = to;
    s.decidedAt = new Date().toISOString();
    s.decisionNote = note;
    // Suspending a seller suspends their active listings.
    if (to === "SUSPENDED") d.listings.filter((l) => l.sellerId === id && l.status === "ACTIVE").forEach((l) => (l.status = "SUSPENDED"));
  }, `Seller ${to.toLowerCase()}`);
}

export async function moderateListing(action: string, form: FormData) {
  const actor = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const note = String(form.get("note") ?? "").slice(0, 500);
  await run((d) => {
    const l = d.listings.find((x) => x.id === id);
    if (!l) throw new Error("Listing not found");
    const seller = d.sellers.find((s) => s.id === l.sellerId);
    const reviews: Record<string, () => void> = {
      "claims-pass": () => (l.moderation.claimReview = "PASSED"),
      "claims-fail": () => (l.moderation.claimReview = "FAILED"),
      "images-pass": () => (l.moderation.imageReview = "PASSED"),
      "images-fail": () => (l.moderation.imageReview = "FAILED"),
    };
    const moves: Record<string, ListingStatus> = {
      approve: "ACTIVE",
      "request-changes": "CHANGES_REQUESTED",
      reject: "REJECTED",
      suspend: "SUSPENDED",
    };
    if (reviews[action]) {
      reviews[action]();
      audit(d, { actor, action: `listing.${action}`, target: `listing:${id}`, note });
      return;
    }
    const to = moves[action];
    if (!to) throw new Error("Unknown moderation action");
    const t = transitionListing(l, to, seller);
    if (!t.ok) throw new Error(t.errors.join("; "));
    audit(d, { actor, action: "listing.status", target: `listing:${id}`, from: l.status, to, note });
    l.status = to;
    l.moderation.note = note;
    l.updatedAt = new Date().toISOString();
  }, "Listing updated");
}

export async function resolveReport(form: FormData) {
  const actor = await requireAdmin();
  const id = String(form.get("id") ?? "");
  await run((d) => {
    const r = d.reports.find((x) => x.id === id);
    if (!r) throw new Error("Report not found");
    r.status = "RESOLVED";
    audit(d, { actor, action: "report.resolve", target: `report:${id}` });
  }, "Report resolved");
}
