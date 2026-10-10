import Image from "next/image";
import { art } from "@/lib/art";

/** Empty state: a soft generated glow behind a clean message card. */
export default function EmptyStateGlow({
  title,
  children,
  actions,
  headingLevel = "h2",
  glow = "glow-natural",
}: {
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
  glow?: "glow-natural" | "glow-accent";
}) {
  const Heading = headingLevel;
  const g = art(glow);
  return (
    <div data-testid="empty-state" className="relative isolate flex justify-center overflow-hidden px-2 py-12">
      <Image
        src={g.file}
        alt=""
        aria-hidden="true"
        width={460}
        height={460}
        sizes="460px"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-auto w-[min(460px,120%)] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="surface-card relative max-w-lg p-6 text-center sm:p-8">
        <Heading className="text-xl font-bold text-hb-ink">{title}</Heading>
        {children && <div className="mt-2 text-hb-ink/75">{children}</div>}
        {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
