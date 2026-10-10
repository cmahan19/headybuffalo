export default function EmptyState({
  title,
  children,
  actions,
  headingLevel = "h2",
}: {
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="panel text-center">
      <Heading className="text-lg font-semibold">{title}</Heading>
      {children && <div className="mx-auto mt-2 max-w-prose text-hb-ink/70">{children}</div>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
