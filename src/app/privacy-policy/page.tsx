import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "../components/PolicyPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} handles information you share when you shop or contact us.`,
  alternates: { canonical: "/privacy-policy" },
};

// OWNER-REVIEW: this describes what the website code does today. Have it reviewed for the
// laws that apply to your business (e.g. state privacy laws) before relying on it, and update
// it whenever you add analytics, advertising pixels, email marketing, or new vendors.
export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy policy">
      <p>This page explains what information the {site.name} website collects and how it is used.</p>

      <h2>Information you give us</h2>
      <ul>
        <li>
          <strong>Contact form.</strong> Your name, email address, subject, and message are sent to our team by email
          so we can reply to you.
        </li>
        <li>
          <strong>Checkout.</strong> Payments are handled by Stripe on its secure checkout page. Stripe collects your
          payment details, email, and shipping address to process your order and shares order details, such as your
          name, email, and shipping address, with us so we can fulfill it. We do not receive or store your full card
          number. Stripe’s use of your information is described in{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            Stripe’s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Phone.</strong> If you call us, we use what you tell us to help with your request.
        </li>
      </ul>

      <h2>Information stored on your device</h2>
      <p>
        Your shopping cart is saved in your browser’s local storage so it’s still there when you come back. It
        contains only product identifiers and quantities and is not sent to us until you check out.
      </p>

      <h2>How we use information</h2>
      <p>
        We use the information above to respond to you and to process, ship, and support your orders. We do not sell
        your personal information.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Call <a href={site.phone.href}>{site.phone.display}</a> or{" "}
        <Link href="/contact">send us a message</Link>.
      </p>
    </PolicyPage>
  );
}
