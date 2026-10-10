import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout canceled",
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <div className="container-page max-w-2xl py-16 text-center">
      <h1 className="text-display-sm">Checkout canceled</h1>
      <p className="mt-3 text-hb-ink/75">No payment was taken. Your cart is saved, so you can pick up where you left off.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/cart" className="btn-primary">
          Return to cart
        </Link>
        <a href={site.phone.href} className="btn-secondary">
          Order by phone: {site.phone.display}
        </a>
      </div>
    </div>
  );
}
