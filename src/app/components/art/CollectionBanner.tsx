import ArtBackground from "./ArtBackground";

/** Collection header: generated landscape art with the title on a clean white card. */
export default function CollectionBanner({
  artId,
  eyebrow,
  title,
  description,
  headingLevel = "h1",
  priority = false,
  children,
}: {
  artId: string;
  eyebrow?: string;
  title: string;
  description?: string;
  headingLevel?: "h1" | "h2";
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const Heading = headingLevel;
  return (
    <div
      data-testid="collection-banner"
      className="relative isolate flex min-h-[15rem] items-end overflow-hidden rounded-panel p-4 shadow-soft sm:min-h-[18rem] sm:p-6"
    >
      <ArtBackground artId={artId} priority={priority} sizes="(min-width: 1152px) 1152px, 100vw" />
      <div className="relative max-w-lg rounded-card border border-hb-stone bg-white/95 p-5 shadow-soft backdrop-blur-sm">
        {eyebrow && <p className="eyebrow text-hb-moss">{eyebrow}</p>}
        <Heading className={`${eyebrow ? "mt-1" : ""} ${headingLevel === "h1" ? "text-display-sm sm:text-display-md" : "text-2xl font-bold tracking-tight"} text-hb-ink`}>
          {title}
        </Heading>
        {description && <p className="mt-2 text-hb-ink/75">{description}</p>}
        {children}
      </div>
    </div>
  );
}
