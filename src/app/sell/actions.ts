"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../admin/actions";
import { flags } from "@/lib/flags";
import { transitionListing } from "@/lib/marketplace/listings";
import type { Listing, SellerApplication } from "@/lib/marketplace/types";
import { audit, updateStore } from "@/lib/store";

const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function requireMarketplace() {
  if (!flags.MARKETPLACE_ENABLED) throw new Error("Marketplace is not enabled");
}

/** Public seller application. Never auto-approved. */
export async function applySeller(form: FormData) {
  requireMarketplace();
  if (str(form, "company")) redirect("/sell/apply?submitted=1"); // honeypot
  const storeName = str(form, "storeName", 80);
  const contactName = str(form, "contactName", 80);
  const contactEmail = str(form, "contactEmail", 200);
  const errors: string[] = [];
  if (storeName.length < 2) errors.push("store");
  if (contactName.length < 2) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errors.push("email");
  if (form.get("ownership") !== "on" || form.get("terms") !== "on" || form.get("policy") !== "on") errors.push("agreements");
  if (errors.length) redirect(`/sell/apply?error=${errors.join(",")}`);

  const app: SellerApplication = {
    id: randomUUID(),
    storeName,
    slug: `${slugify(storeName)}-${randomUUID().slice(0, 4)}`,
    contactName,
    contactEmail,
    categories: str(form, "categories", 300).split(",").map((c) => c.trim()).filter(Boolean).slice(0, 10),
    ownershipConfirmed: true,
    termsAccepted: true,
    sellerPolicyAccepted: true,
    verification: "NOT_STARTED",
    status: "PENDING_REVIEW",
    submittedAt: new Date().toISOString(),
  };
  const res = await updateStore((d) => {
    if (d.sellers.filter((s) => s.status === "PENDING_REVIEW").length > 500) throw new Error("Queue full");
    d.sellers.push(app);
    audit(d, { actor: "applicant", action: "seller.apply", target: `seller:${app.id}`, to: "PENDING_REVIEW" });
  }).catch(() => ({ ok: false as const, error: "Queue full" }));
  redirect(res.ok ? "/sell/apply?submitted=1" : "/sell/apply?error=save");
}

/** Seller dashboard (admin preview until seller accounts exist): create a DRAFT listing. */
export async function createListingDraft(form: FormData) {
  const actor = await requireAdmin();
  requireMarketplace();
  const sellerId = str(form, "sellerId", 60);
  const price = Math.round(Number(str(form, "price", 12)) * 100);
  const inventory = Number(str(form, "inventory", 8));
  const listing: Listing = {
    id: randomUUID(),
    sellerId,
    title: str(form, "title", 120),
    category: str(form, "category", 60),
    description: str(form, "description", 2000),
    materialDetails: str(form, "materialDetails", 1000),
    photoUrls: str(form, "photoUrl", 500) ? [str(form, "photoUrl", 500)] : [],
    photoRightsConfirmed: form.get("photoRights") === "on",
    priceCents: Number.isFinite(price) && price > 0 ? price : null,
    inventory: Number.isInteger(inventory) && inventory >= 0 ? inventory : null,
    shippingMethod: str(form, "shippingMethod", 200),
    returnPolicy: str(form, "returnPolicy", 1000),
    safetyInfo: str(form, "safetyInfo", 1000),
    claimEvidence: str(form, "claimEvidence", 1000),
    status: "DRAFT",
    moderation: { claimReview: "PENDING", imageReview: "PENDING" },
    updatedAt: new Date().toISOString(),
  };
  const res = await updateStore((d) => {
    if (!d.sellers.some((s) => s.id === sellerId && s.status === "APPROVED")) throw new Error("Seller not approved");
    d.listings.push(listing);
    audit(d, { actor, action: "listing.create", target: `listing:${listing.id}`, to: "DRAFT" });
  }).catch((e) => ({ ok: false as const, error: e instanceof Error ? e.message : "Save failed" }));
  revalidatePath("/seller");
  redirect(res.ok ? "/seller?ok=Draft+saved" : `/seller?error=${encodeURIComponent(res.error)}`);
}

/** Submits a draft for moderation. The claim validator and required-field check run here. */
export async function submitListing(form: FormData) {
  const actor = await requireAdmin();
  requireMarketplace();
  const id = str(form, "id", 60);
  let blocked = "";
  const res = await updateStore((d) => {
    const l = d.listings.find((x) => x.id === id);
    if (!l) throw new Error("Listing not found");
    const t = transitionListing(l, "PENDING_REVIEW", d.sellers.find((s) => s.id === l.sellerId));
    if (!t.ok) {
      blocked = t.errors.join("; ");
      throw new Error(blocked);
    }
    audit(d, { actor, action: "listing.submit", target: `listing:${id}`, from: l.status, to: "PENDING_REVIEW" });
    l.status = "PENDING_REVIEW";
    l.updatedAt = new Date().toISOString();
  }).catch(() => null);
  revalidatePath("/seller");
  if (blocked) redirect(`/seller?error=${encodeURIComponent(blocked)}`);
  redirect(res?.ok ? "/seller?ok=Submitted+for+review" : "/seller?error=Save+failed");
}

/** Buyer report against a seller or listing. */
export async function createReport(form: FormData) {
  requireMarketplace();
  const sellerSlug = str(form, "sellerSlug", 80);
  if (str(form, "company")) redirect(`/makers/${sellerSlug}?reported=1`);
  const reason = str(form, "reason", 80);
  const details = str(form, "details", 2000);
  const sellerId = str(form, "sellerId", 60);
  if (!reason || details.length < 5) redirect(`/makers/${sellerSlug}?reportError=1`);
  await updateStore((d) => {
    if (!d.sellers.some((s) => s.id === sellerId)) throw new Error("Unknown seller");
    const id = randomUUID();
    d.reports.push({ id, sellerId, reason, details, at: new Date().toISOString(), status: "OPEN" });
    audit(d, { actor: "buyer", action: "report.create", target: `report:${id}` });
  }).catch(() => null);
  redirect(`/makers/${sellerSlug}?reported=1`);
}
