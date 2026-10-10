import type { Metadata } from "next";
import Link from "next/link";
import CallLink from "../components/CallLink";
import BrandGraphic from "../components/ui/BrandGraphic";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.name} makes handmade patches, totes, macramé, cards, and home goods to order.`,
  alternates: { canonical: "/about" },
};

// OWNER-REVIEW: add your own founding story and a real photo of you or your workspace when ready.
// Avoid unverified claims about materials, sourcing, donations, packaging, or shipping emissions.
export default function AboutPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-hb-moss">About us</p>
          <h1 className="mt-2 text-display-md sm:text-display-lg">Made by hand. Made for you.</h1>
          <div className="prose-hb mt-6 text-lg">
            <p>
              Heady Buffalo is a small, eco-minded shop that makes everyday goods by hand: embroidered patches, stamped
              totes, macramé, block-printed cards, and pieces for the home.
            </p>
            <p>
              Everything is made to order. You pick a piece, we talk through the details, and then we make it. That means
              fewer things sitting on shelves and a piece that’s made for you.
            </p>
            <p>
              We keep our product pages simple and honest. If we haven’t measured, tested, or confirmed something, we
              don’t say it. And if you have a question, a real person answers the phone.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Shop handmade
            </Link>
            <CallLink className="btn-secondary" label="Call" />
          </div>
        </div>
        <BrandGraphic className="aspect-square w-full rounded-panel" logoSize={360} tone="forest" />
      </div>
    </div>
  );
}
