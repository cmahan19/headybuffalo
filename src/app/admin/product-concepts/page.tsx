import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ConceptBadge from "../../components/art/ConceptBadge";
import { SCORECARD, loadConcepts } from "../concept-data";
import { changeConceptStatus } from "./actions";
import { art } from "@/lib/art";
import { CONCEPT_LABELS, STANDARD_LAUNCH_REQUIREMENTS, conceptCategories } from "@/lib/concepts";
import { PRODUCT_STATUSES } from "@/lib/readiness";

export const metadata: Metadata = { title: "Product concepts", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ProductConceptsAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const { items, audit } = await loadConcepts();

  return (
    <div className="container-page py-8">
      <ConceptBadge />
      <h1 className="mt-3 text-display-sm">Product concepts ({items.length})</h1>
      <p className="mt-2 max-w-prose text-hb-ink/75">
        {CONCEPT_LABELS.internal}. Internal validation workspace. A concept can only become ACTIVE when the readiness gate
        passes and owner approval is recorded, and even then it must be added to the catalog before it can be sold.
      </p>

      {ok && (
        <p role="status" className="mt-4 rounded-card border-2 border-hb-success bg-white p-3 text-sm font-medium text-hb-success">
          {ok}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-card border-2 border-hb-error bg-white p-3 text-sm font-medium text-hb-error">
          {error}
        </p>
      )}

      <ul className="mt-8 space-y-6" data-testid="admin-concept-list">
        {items.map(({ concept, state, readiness }) => {
          const done = SCORECARD.filter((s) => state.scorecard[s.key]).length;
          return (
            <li key={concept.id} data-testid="admin-concept" className="surface-card grid gap-5 p-4 md:grid-cols-[160px_1fr] md:p-5">
              <div className="relative aspect-[4/5] w-full max-w-[160px] overflow-hidden rounded-card border border-hb-stone">
                <Image src={art(concept.backgroundId).file} alt="" fill sizes="160px" className="object-cover" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-hb-charcoal px-2.5 py-0.5 text-xs font-bold text-white">#{concept.number}</span>
                  <span className="rounded-full border border-hb-stone bg-hb-yellow px-2.5 py-0.5 text-xs font-bold" data-testid="concept-status">
                    {state.status}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-hb-violet-deep">
                    {conceptCategories[concept.category].name}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold">{concept.internalName}</h2>
                <p className="text-sm text-hb-ink/70">
                  Public name: {concept.publicName} · Formats: {concept.formats.join(", ")}
                </p>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div>
                    <h3 className="text-sm font-bold">Readiness gate</h3>
                    <p className={`text-sm font-semibold ${readiness.ready ? "text-hb-success" : "text-hb-error"}`}>
                      {readiness.ready ? "All requirements met" : `${readiness.missing.length} requirements missing`}
                    </p>
                    <details className="mt-1 text-sm">
                      <summary className="cursor-pointer font-medium text-hb-blue-deep">Launch requirements</summary>
                      <ul className="mt-2 list-disc space-y-0.5 pl-5 text-hb-ink/80">
                        {STANDARD_LAUNCH_REQUIREMENTS.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Validation scorecard</h3>
                    <p className="text-sm">
                      {done} / {SCORECARD.length} complete
                    </p>
                    <h3 className="mt-2 text-sm font-bold">Supplier / materials</h3>
                    <p className="text-sm text-hb-ink/75">
                      {state.fields.supplierName || "No supplier yet"} · {state.fields.materials ? "materials recorded" : "materials not recorded"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Owner decision</h3>
                    <p className="text-sm text-hb-ink/75">{state.fields.ownerDecision || concept.ownerDecision}</p>
                  </div>
                </div>

                <form action={changeConceptStatus.bind(null, null)} className="mt-4 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={concept.id} />
                  <label className="text-sm">
                    <span className="field-label">Note</span>
                    <input name="note" className="field mt-1 w-56 py-1.5 text-sm" placeholder="Reason (optional)" />
                  </label>
                  <button formAction={changeConceptStatus.bind(null, "NEEDS_SUPPLIER")} className="btn-secondary min-h-[40px] px-4 py-1.5">
                    Approve for research
                  </button>
                  <button formAction={changeConceptStatus.bind(null, "ARCHIVED")} className="btn-secondary min-h-[40px] px-4 py-1.5">
                    Reject / archive
                  </button>
                  <label className="text-sm">
                    <span className="field-label">Set status</span>
                    <select name="to" defaultValue="" className="field mt-1 w-56 py-1.5 text-sm" aria-label={`New status for ${concept.internalName}`}>
                      <option value="" disabled>
                        Choose…
                      </option>
                      {PRODUCT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="btn-primary min-h-[40px] px-4 py-1.5">
                    Apply status
                  </button>
                  <Link href={`/admin/product-concepts/${concept.id}`} className="btn-link text-sm">
                    Edit details, scorecard, audit →
                  </Link>
                </form>
              </div>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="audit-heading" className="mt-10">
        <h2 id="audit-heading" className="text-xl font-bold">
          Audit trail
        </h2>
        {audit.length === 0 ? (
          <p className="mt-2 text-sm text-hb-ink/70">No concept changes recorded yet.</p>
        ) : (
          <ol className="card mt-3 divide-y divide-hb-ink/10 text-sm">
            {audit.slice(0, 50).map((e, i) => (
              <li key={i} className="px-4 py-2">
                <time dateTime={e.at} className="text-hb-ink/60">{e.at.replace("T", " ").slice(0, 19)}</time> · {e.actor} ·{" "}
                <strong>{e.action}</strong> {e.target.replace("concept:", "")} {e.from && `${e.from} → ${e.to}`}
                {e.note && <span className="text-hb-ink/70"> ({e.note})</span>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
