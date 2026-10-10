import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "./ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Questions about an order or a product? Call ${site.name} at ${site.phone.display} or send us a message.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-display-sm sm:text-display-md">Contact us</h1>
          <p className="mt-3 text-lg text-hb-ink/75">
            Questions about a product, an order, or something else? We’re happy to help.
          </p>

          <div className="surface-card mt-8 border-hb-ink bg-hb-charcoal p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-hb-sage">Call us</p>
            <a href={site.phone.href} className="mt-2 block text-3xl font-bold hover:underline">
              {site.phone.display}
            </a>
            <p className="mt-2 text-sm text-white/80">Tap to call from your phone.</p>
          </div>

          {site.supportEmail && (
            <p className="mt-6 text-hb-ink/75">
              Or email{" "}
              <a href={`mailto:${site.supportEmail}`} className="font-semibold text-hb-moss underline">
                {site.supportEmail}
              </a>
              .
            </p>
          )}
        </div>

        <div className="panel">
          <h2 className="text-xl font-semibold">Send a message</h2>
          <Suspense fallback={<div className="mt-6 h-96 animate-pulse rounded-xl bg-hb-bone" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
