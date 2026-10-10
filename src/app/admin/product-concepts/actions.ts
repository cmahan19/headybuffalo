"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../actions";
import { CONCEPT_FIELDS, SCORECARD, readinessRecord, stateFor } from "../concept-data";
import { getConcept } from "@/lib/concepts";
import { ACTIVATION_REQUIREMENTS, DIY_REQUIREMENTS, PRODUCT_STATUSES, canTransition, type ProductStatus, type RequirementKey } from "@/lib/readiness";
import { audit, updateStore } from "@/lib/store";

const back = (id: string | null, msg: string, tone: "ok" | "error") =>
  redirect(`/admin/product-concepts${id ? `/${id}` : ""}?${tone}=${encodeURIComponent(msg)}`);

/** Approve for research, reject, archive, or advance status. Every change is gated and audited. */
export async function changeConceptStatus(preset: ProductStatus | null, form: FormData) {
  const actor = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const returnTo = form.get("returnTo") === "detail" ? id : null;
  const concept = getConcept(id);
  // Quick-action buttons bind their target status (submitter name/value isn't sent with server-action forms);
  // the dropdown sends `to`.
  const to = (preset ?? String(form.get("to") ?? "")) as ProductStatus;
  const note = String(form.get("note") ?? "").slice(0, 500);
  if (!concept || !PRODUCT_STATUSES.includes(to)) back(returnTo, "Unknown concept or status", "error");

  let error = "";
  const result = await updateStore((d) => {
    const s = stateFor(concept!, d.concepts[id]);
    const check = canTransition(readinessRecord(concept!, s), to);
    if (!check.ok) {
      error = check.error!;
      throw new Error("blocked");
    }
    d.concepts[id] = { ...s, status: to };
    audit(d, { actor, action: "concept.status", target: `concept:${id}`, from: s.status, to, note });
  }).catch(() => null);

  if (error) back(returnTo, error, "error");
  if (!result || !result.ok) back(returnTo, result && !result.ok ? result.error : "Save failed", "error");
  revalidatePath("/admin/product-concepts");
  back(returnTo, `${concept!.internalName} → ${to}`, "ok");
}

/** Saves supplier/material fields, requirement checks, and the validation scorecard. */
export async function saveConceptDetails(form: FormData) {
  const actor = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const concept = getConcept(id);
  if (!concept) back(null, "Unknown concept", "error");

  const reqKeys = [...Object.keys(ACTIVATION_REQUIREMENTS), ...(concept!.isDiy ? Object.keys(DIY_REQUIREMENTS) : [])] as RequirementKey[];
  const result = await updateStore((d) => {
    const s = stateFor(concept!, d.concepts[id]);
    const fields = Object.fromEntries(CONCEPT_FIELDS.map((f) => [f.key, String(form.get(`field:${f.key}`) ?? "").slice(0, 2000)]));
    const checks = Object.fromEntries(reqKeys.map((k) => [k, form.get(`check:${k}`) === "on"]));
    const scorecard = Object.fromEntries(SCORECARD.map((k) => [k.key, form.get(`score:${k.key}`) === "on"]));
    d.concepts[id] = { ...s, fields, checks, scorecard };
    audit(d, { actor, action: "concept.details", target: `concept:${id}`, note: "Updated fields, requirements, and scorecard" });
  });
  if (!result.ok) back(id, result.error, "error");
  revalidatePath("/admin/product-concepts");
  back(id, "Saved", "ok");
}
