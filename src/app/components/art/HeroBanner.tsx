import ArtBackground from "./ArtBackground";

/** Homepage hero: dark chrome landscape art with the headline set directly on the calm left side. */
export default function HeroBanner({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <section data-testid="hero" className="relative isolate overflow-hidden bg-hb-charcoal">
      <ArtBackground artId="hero-landscape" priority position="65% 50%" />
      <div className="container-page relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-xl">
          <p className="eyebrow text-hb-sage">{eyebrow}</p>
          <h1 className="chrome-text mt-4 pb-1 text-display-md sm:text-display-lg lg:text-display-xl">{title}</h1>
          <p className="mt-5 max-w-lg text-lg text-hb-chrome-light">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
        </div>
      </div>
      <div aria-hidden="true" className="accent-line absolute inset-x-0 bottom-0 h-1" />
    </section>
  );
}
