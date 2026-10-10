import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import ClearCartOnMount from "./ClearCartOnMount";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order status",
  robots: { index: false, follow: false },
};

async function isPaid(sessionId: string | undefined) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId || !sessionId.startsWith("cs_")) return false;
  try {
    const session = await new Stripe(key).checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid" || session.payment_status === "no_payment_required";
  } catch {
    return false;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const raw = (await searchParams).session_id;
  const paid = await isPaid(Array.isArray(raw) ? raw[0] : raw);

  return (
    <div className="container-page max-w-2xl py-16 text-center">
      {paid ? (
        <>
          <ClearCartOnMount />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-hb-sage/20 text-hb-moss" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12l5 5L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-display-sm">Thank you for your order</h1>
          <p className="mt-3 text-hb-ink/75">
            Your payment went through. A receipt will be sent to the email address you entered at checkout.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-display-sm">We couldn’t confirm this order</h1>
          <p className="mt-3 text-hb-ink/75">
            If you completed a payment, don’t worry. It may still be processing. Please get in touch and we’ll check for you.
          </p>
        </>
      )}
      <p className="mt-2 text-hb-ink/75">
        Questions about your order? Call{" "}
        <a href={site.phone.href} className="font-semibold text-hb-moss underline">
          {site.phone.display}
        </a>{" "}
        or{" "}
        <Link href="/contact" className="font-semibold text-hb-moss underline">
          send us a message
        </Link>
        .
      </p>
      <Link href="/shop" className="btn-primary mt-8">
        Keep shopping
      </Link>
    </div>
  );
}
