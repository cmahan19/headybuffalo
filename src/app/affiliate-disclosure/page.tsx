import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "../components/PolicyPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description: `How ${site.name} labels partner products and affiliate links.`,
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <PolicyPage title="Affiliate disclosure">
      <p>
        Most products on {site.name} are sold by us directly. From time to time we may also recommend products sold by
        other companies.
      </p>
      <h2>How partner products are labeled</h2>
      <ul>
        <li>Partner products are labeled “Curated partner product,” and their button names the store you’ll be sent to.</li>
        <li>
          If you buy through one of those links, we may earn a commission. It doesn’t change the price you pay.
        </li>
        <li>A commission never changes how we describe a product. We only share details we can stand behind.</li>
      </ul>
      <p>
        Questions? Call <a href={site.phone.href}>{site.phone.display}</a> or{" "}
        <Link href="/contact">send us a message</Link>.
      </p>
    </PolicyPage>
  );
}
