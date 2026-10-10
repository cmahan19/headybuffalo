import type { Metadata } from "next";
import PolicyPage from "../components/PolicyPage";
import { site } from "@/lib/site";

const text = site.policies.terms;

export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" },
  ...(text ? {} : { robots: { index: false, follow: true } }),
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms"
      paragraphs={text}
      interim="Our full terms of sale are being finalized. If you have any question about an order before you buy, we’re happy to help."
    />
  );
}
