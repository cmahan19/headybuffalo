import Link from "next/link";
import { AFFILIATE_DISCLOSURE, PARTNER_DISCLOSURE } from "@/lib/affiliate";

/** Disclosure shown next to every external (partner/affiliate) CTA. Wording follows the actual relationship. */
export default function PartnerDisclosure({
  relationship,
  className = "",
}: {
  relationship: "affiliate" | "partner";
  className?: string;
}) {
  return (
    <p className={`rounded-card border border-hb-stone bg-hb-yellow/30 p-3 text-sm text-hb-ink ${className}`}>
      <span data-testid="affiliate-disclosure">{relationship === "affiliate" ? AFFILIATE_DISCLOSURE : PARTNER_DISCLOSURE}</span>{" "}
      <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-hb-ink">
        Learn more
      </Link>
    </p>
  );
}
