import { CONCEPT_LABELS } from "@/lib/concepts";

/** Text label (never color alone) marking something as a concept, not a product. */
export default function ConceptBadge({ className = "" }: { className?: string }) {
  return (
    <span
      data-testid="concept-badge"
      className={`inline-flex items-center gap-1.5 rounded-full bg-hb-charcoal px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/15 ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-hb-sage" />
      {CONCEPT_LABELS.badge}
    </span>
  );
}
