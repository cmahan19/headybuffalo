import { formatPrice } from "@/lib/catalog";

const sizes = {
  sm: "text-sm sm:text-base font-semibold",
  md: "text-lg font-semibold",
  lg: "text-2xl font-semibold tracking-tight",
} as const;

/** Single, current price. There is intentionally no "compare-at" price: add one only for a real, documented prior price. */
export default function Price({
  cents,
  size = "md",
  className = "",
}: {
  cents: number;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <p className={`${sizes[size]} text-hb-ink ${className}`}>
      <span className="sr-only">Price: </span>
      {formatPrice(cents)}
    </p>
  );
}
