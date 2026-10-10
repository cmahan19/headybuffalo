import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { applySeller } from "../actions";
import CollectionBanner from "../../components/art/CollectionBanner";
import { flags } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Apply to sell",
  robots: { index: false, follow: true },
};

const errorText: Record<string, string> = {
  store: "Enter your store name.",
  name: "Enter your name.",
  email: "Enter a valid email.",
  agreements: "Please confirm ownership and accept the marketplace terms and seller policy.",
  save: "We couldn’t save your application. Please try again later.",
};

export default async function SellerApply({ searchParams }: { searchParams: Promise<{ submitted?: string; error?: string }> }) {
  if (!flags.MARKETPLACE_ENABLED) notFound();
  const { submitted, error } = await searchParams;
  const errors = (error ?? "").split(",").filter((e) => errorText[e]);

  return (
    <div className="container-page max-w-3xl py-10">
      <CollectionBanner artId="banner-craft" priority eyebrow="Maker marketplace" title="Apply to sell" description="Every application is reviewed by a person. Approval isn’t automatic." />
      {submitted ? (
        <p role="status" className="surface-card mt-8 p-6 font-semibold">Thanks! Your application is pending review. We’ll email you with a decision.</p>
      ) : (
        <form action={applySeller} className="panel mt-8 space-y-4">
          {errors.length > 0 && (
            <ul role="alert" className="list-disc pl-5 text-sm text-hb-error">{errors.map((e) => <li key={e}>{errorText[e]}</li>)}</ul>
          )}
          <label className="block"><span className="field-label">Store name</span><input name="storeName" required className="field mt-1" /></label>
          <label className="block"><span className="field-label">Your name</span><input name="contactName" required autoComplete="name" className="field mt-1" /></label>
          <label className="block"><span className="field-label">Email</span><input name="contactEmail" type="email" required autoComplete="email" className="field mt-1" /></label>
          <label className="block"><span className="field-label">Product categories (comma-separated)</span><input name="categories" className="field mt-1" /></label>
          <div className="absolute -left-[9999px]" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
          <fieldset className="space-y-2 text-sm">
            <legend className="field-label">Agreements (required)</legend>
            <label className="flex gap-2"><input type="checkbox" name="ownership" className="mt-1 h-4 w-4" /> I make, own, or am authorized to sell every product I list.</label>
            <label className="flex gap-2"><input type="checkbox" name="terms" className="mt-1 h-4 w-4" /> I accept the <Link href="/terms" className="underline">marketplace terms</Link>.</label>
            <label className="flex gap-2"><input type="checkbox" name="policy" className="mt-1 h-4 w-4" /> I accept the seller policy, including the ban on unsupported environmental, health, and safety claims.</label>
          </fieldset>
          <button type="submit" className="btn-primary">Submit application</button>
        </form>
      )}
    </div>
  );
}
