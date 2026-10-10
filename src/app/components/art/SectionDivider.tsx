/** Thin divider: a chrome hairline, or the natural-to-color accent line. */
export default function SectionDivider({ variant = "chrome", className = "" }: { variant?: "chrome" | "accent"; className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-art-module="divider"
      className={`${variant === "chrome" ? "chrome-line h-px" : "accent-line h-1 rounded-full"} w-full ${className}`}
    />
  );
}
