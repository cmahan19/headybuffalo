import type { Metadata } from "next";
import PolicyPage from "../components/PolicyPage";
import { site } from "@/lib/site";

const text = site.policies.shippingAndReturns;

export const metadata: Metadata = {
  title: "Shipping & returns",
  alternates: { canonical: "/shipping-returns" },
  ...(text ? {} : { robots: { index: false, follow: true } }),
};

export default function ShippingReturnsPage() {
  return (
    <PolicyPage
      title="Shipping & returns"
      paragraphs={text}
      interim="We’re finalizing our published shipping and returns policy. Until it’s posted here, we’re glad to confirm shipping costs, delivery timing, and return options for your order directly."
    />
  );
}
