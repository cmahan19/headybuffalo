import ArtBackground from "./ArtBackground";

/** Call-to-action block on a black chrome surface with dark landscape art. */
export default function CallToAction({
  title,
  body,
  actions,
  id,
}: {
  title: string;
  body: string;
  actions: React.ReactNode;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} data-art-module="cta" className="chrome-surface relative isolate rounded-panel px-6 py-14 text-center sm:px-10">
      <ArtBackground artId="banner-chrome" className="opacity-70" sizes="(min-width: 1152px) 1152px, 100vw" />
      <div aria-hidden="true" className="accent-line absolute inset-x-0 top-0 h-1" />
      <h2 id={id} className="chrome-text text-display-sm">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-prose text-hb-chrome-light">{body}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>
    </section>
  );
}
