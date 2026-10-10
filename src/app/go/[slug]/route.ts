import { NextResponse } from "next/server";
import { isSafeOutboundUrl } from "@/lib/affiliate";
import { getPublishedProduct } from "@/lib/catalog";
import { audit, updateStore } from "@/lib/store";

// Outbound partner/affiliate click. Redirects ONLY to the URL stored for a published external product,
// so it can't be used as an open redirect. Records the click (no personal data), never a sale.

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product || product.offer.kind !== "external" || !isSafeOutboundUrl(product.offer.url)) {
    return new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const offer = product.offer;
  const referer = req.headers.get("referer");
  let fromPath = "";
  try {
    fromPath = referer ? new URL(referer).pathname.slice(0, 200) : "";
  } catch {}

  await updateStore((d) => {
    d.clicks.unshift({ at: new Date().toISOString(), productSlug: slug, merchant: offer.merchant, fromPath });
    d.clicks = d.clicks.slice(0, 5000);
    audit(d, { actor: "visitor", action: "affiliate.click", target: `product:${slug}` });
  }).catch(() => undefined); // Tracking failure must never block the visitor.

  return NextResponse.redirect(offer.url, { status: 302, headers: { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });
}
