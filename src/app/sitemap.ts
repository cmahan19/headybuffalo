import type { MetadataRoute } from "next";
import { publishedCategories, publishedProducts } from "@/lib/catalog";
import { absoluteUrl, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const live = publishedProducts();
  const hasProducts = live.length > 0;
  const pages = ["/", "/about", "/contact", "/privacy-policy", "/affiliate-disclosure"];
  if (hasProducts) pages.push("/shop");
  if (site.policies.shippingAndReturns) pages.push("/shipping-returns");
  if (site.policies.terms) pages.push("/terms");

  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...publishedCategories().map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    // Every public product (made-to-order listings and checkout-ready products).
    ...live
      .map((p) => ({
        url: absoluteUrl(`/products/${p.slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.9,
        images: [absoluteUrl(p.image.src)],
      })),
  ];
}
