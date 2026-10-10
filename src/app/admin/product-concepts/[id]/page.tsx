import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConceptBadge from "../../../components/art/ConceptBadge";
import { CONCEPT_FIELDS, SCORECARD, readinessRecord, stateFor } from "../../concept-data";
import { changeConceptStatus, saveConceptDetails } from "../actions";
import { art } from "@/lib/art";
import { STANDARD_LAUNCH_REQUIREMENTS, STANDARD_VALIDATION_QUESTIONS, conceptCategories, getConcept } from "@/lib/concepts";
import { ACTIVATION_REQUIREMENTS, DIY_REQUIREMENTS, PRODUCT_STATUSES, evaluateReadiness } from "@/lib/readiness";
import { readStore } from "@/lib/store";

export const metadata: Metadata = { title: "Concept detail", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ConceptDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const concept = getConcept(id);
  if (!concept) notFound();
  const store = await readStore();
  const state = stateFor(concept, store.concepts[id]);
  const readiness = evaluateReadiness(readinessRecord(concept, state));
  const requirements = { ...ACTIVATION_REQUIREMENTS, ...(concept.isDiy ? DIY_REQUIREMENTS : {}) };
  const history = store.audit.filter((e) => e.target === `concept:${id}`);

  return (
    <div className="container-page py-8">
      <Link href="/admin/product-concepts" className="btn-link text-sm">
        ← All concepts
      </Link>
      <div className="mt-3 grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-panel border border-hb-stone">
          <Image src={art(concept.backgroundId).file} alt="" fill sizes="220px" className="object-cover" />
          <ConceptBadge className="absolute left-2 top-2" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-hb-violet-deep">
            #{concept.number} · {conceptCategories[concept.category].name} · {concept.isDiy ? "DIY kit (extra requirements)" : "Standard"}
          </p>
          <h1 className="mt-1 text-display-sm">{concept.internalName}</h1>
          <p className="mt-1 text-hb-ink/75">
            Status: <strong data-testid="concept-status">{state.status}</strong> · Public name: {concept.publicName}
          </p>
          <p className="mt-2 text-sm text-hb-ink/75">{concept.publicDescription}</p>
          <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <div><dt className="inline font-semibold">Formats: </dt><dd className="inline">{concept.formats.join(", ")}</dd></div>
            <div><dt className="inline font-semibold">Cross-sell: </dt><dd className="inline">{concept.crossSell}</dd></div>
            <div><dt className="inline font-semibold">Subscription: </dt><dd className="inline">{concept.subscription}</dd></div>
            <div><dt className="inline font-semibold">Marketplace: </dt><dd className="inline">{concept.marketplace}</dd></div>
            <div><dt className="inline font-semibold">Affiliate: </dt><dd className="inline">{concept.affiliate}</dd></div>
          </dl>
        </div>
      </div>

      {ok && <p role="status" className="mt-6 rounded-card border-2 border-hb-success bg-white p-3 text-sm font-medium text-hb-success">{ok}</p>}
      {error && <p role="alert" className="mt-6 rounded-card border-2 border-hb-error bg-white p-3 text-sm font-medium text-hb-error">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel" aria-labelledby="gate-heading">
          <h2 id="gate-heading" className="text-lg font-bold">Readiness gate</h2>
          <p className={`mt-1 text-sm font-semibold ${readiness.ready ? "text-hb-success" : "text-hb-error"}`}>
            {readiness.ready ? "Ready for owner review" : `Blocked: ${readiness.missing.length} items missing`}
          </p>
          <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm text-hb-ink/80">
            {readiness.missing.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <form action={changeConceptStatus.bind(null, null)} className="mt-4 flex flex-wrap items-end gap-2">
            <input type="hidden" name="id" value={concept.id} />
            <input type="hidden" name="returnTo" value="detail" />
            <label className="text-sm">
              <span className="field-label">New status</span>
              <select name="to" defaultValue={state.status} className="field mt-1 py-1.5 text-sm">
                {PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="field-label">Note</span>
              <input name="note" className="field mt-1 py-1.5 text-sm" />
            </label>
            <button type="submit" className="btn-primary min-h-[40px] px-4 py-1.5">Change status</button>
          </form>
        </section>

        <section className="panel" aria-labelledby="questions-heading">
          <h2 id="questions-heading" className="text-lg font-bold">Validation questions</h2>
          <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-hb-ink/80">
            {[...STANDARD_VALIDATION_QUESTIONS, ...concept.validationNotes].map((q) => <li key={q}>{q}</li>)}
          </ul>
          <h3 className="mt-4 text-sm font-bold">Launch requirements</h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-hb-ink/80">
            {STANDARD_LAUNCH_REQUIREMENTS.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>
      </div>

      {concept.diy && (
        <section className="panel mt-6" aria-labelledby="diy-heading" data-testid="diy-guide">
          <h2 id="diy-heading" className="text-lg font-bold">
            Make it yourself <span className="text-sm font-medium text-hb-ink/60">· {concept.diy.skill} · internal planning only</span>
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold">Materials to source</h3>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-hb-ink/80">
                {concept.diy.materials.map((m) => <li key={m}>{m}</li>)}
              </ul>
              <h3 className="mt-4 text-sm font-bold">Tools</h3>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-hb-ink/80">
                {concept.diy.tools.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold">Steps</h3>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-hb-ink/80">
                {concept.diy.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <h3 className="mt-4 text-sm font-bold">Safety and quality</h3>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-hb-ink/80">
                {concept.diy.safety.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}

      <form action={saveConceptDetails} className="panel mt-6 space-y-6">
        <input type="hidden" name="id" value={concept.id} />
        <h2 className="text-lg font-bold">Supplier, material, and owner fields</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {CONCEPT_FIELDS.map((f) => (
            <label key={f.key} className={f.long ? "md:col-span-2" : ""}>
              <span className="field-label">{f.label}</span>
              {f.hint && <span className="block text-xs text-hb-ink/60">{f.hint}</span>}
              {f.long ? (
                <textarea name={`field:${f.key}`} defaultValue={state.fields[f.key] ?? ""} rows={2} className="field mt-1" />
              ) : (
                <input name={`field:${f.key}`} defaultValue={state.fields[f.key] ?? ""} className="field mt-1" />
              )}
            </label>
          ))}
        </div>

        <fieldset>
          <legend className="text-lg font-bold">Activation requirements (record only when evidence exists)</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {Object.entries(requirements).map(([k, label]) => (
              <label key={k} className="flex items-start gap-2 text-sm">
                <input type="checkbox" name={`check:${k}`} defaultChecked={Boolean(state.checks[k as keyof typeof state.checks])} className="mt-1 h-4 w-4" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">Validation scorecard</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {SCORECARD.map((s) => (
              <label key={s.key} className="flex items-start gap-2 text-sm">
                <input type="checkbox" name={`score:${s.key}`} defaultChecked={Boolean(state.scorecard[s.key])} className="mt-1 h-4 w-4" />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-primary">Save details</button>
      </form>

      <section aria-labelledby="history-heading" className="mt-8">
        <h2 id="history-heading" className="text-lg font-bold">Audit trail</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-hb-ink/70">No changes recorded yet.</p>
        ) : (
          <ol className="card mt-2 divide-y divide-hb-ink/10 text-sm">
            {history.map((e, i) => (
              <li key={i} className="px-4 py-2">
                <time dateTime={e.at} className="text-hb-ink/60">{e.at.replace("T", " ").slice(0, 19)}</time> · {e.actor} · <strong>{e.action}</strong>{" "}
                {e.from && `${e.from} → ${e.to}`} {e.note && <span className="text-hb-ink/70">({e.note})</span>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
