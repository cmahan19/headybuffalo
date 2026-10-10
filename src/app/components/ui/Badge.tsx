// Badges are for factual labels only (product type, partner relationship, draft status).
// Never use them for sale, stock, "bestseller", rating, or environmental claims.
const variants = {
  neutral: "bg-white/95 text-hb-ink ring-1 ring-hb-ink/10",
  brand: "bg-hb-ink text-white",
  partner: "bg-sky-brand text-white",
  draft: "bg-hb-sand text-hb-ink",
} as const;

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
