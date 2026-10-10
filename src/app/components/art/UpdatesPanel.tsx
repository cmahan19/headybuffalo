import Link from "next/link";
import { flags } from "@/lib/flags";
import { site } from "@/lib/site";
import ArtBackground from "./ArtBackground";

/**
 * Updates module. There is no email-list provider yet, so this never collects addresses. It points to
 * the working contact form and phone line instead. When NEWSLETTER_ENABLED and a provider are configured,
 * swap in a real signup form with an unchecked consent box.
 */
export default function UpdatesPanel() {
  const listReady = flags.NEWSLETTER_ENABLED;
  return (
    <section aria-labelledby="updates-heading" data-art-module="updates" className="relative isolate overflow-hidden rounded-panel px-5 py-10 shadow-soft sm:px-10">
      <ArtBackground artId="banner-carry" sizes="(min-width: 1152px) 1152px, 100vw" />
      <div className="relative max-w-xl rounded-card border border-hb-stone bg-white/95 p-6 backdrop-blur-sm">
        <p className="eyebrow text-hb-teal-deep">Stay in the loop</p>
        <h2 id="updates-heading" className="mt-1 text-2xl font-bold tracking-tight text-hb-ink">
          Want to hear when we launch?
        </h2>
        {!listReady && (
          <p className="mt-2 text-hb-ink/75">
            We don’t run an email list yet. Send us a note or give us a call, and we’ll reach out personally when
            products go live.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/contact?subject=${encodeURIComponent("Launch updates")}`} className="btn-primary">
            Send us a note
          </Link>
          <a href={site.phone.href} className="btn-secondary">
            Call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
