// Affiliate/partner helpers. Offers are defined in src/lib/catalog.ts (offer.kind = "external").
// Outbound clicks go through /go/[slug], which only redirects to the URL stored for that product
// (never a URL from the request), so it cannot be used as an open redirect.

export const AFFILIATE_DISCLOSURE =
  "Affiliate disclosure: Heady Buffalo may earn a commission if you purchase through this partner link.";
export const PARTNER_DISCLOSURE =
  "This is a curated partner product. It is sold and shipped by the partner, not by Heady Buffalo.";

export type SourceType = "FIRST_PARTY" | "MARKETPLACE_SELLER" | "PARTNER" | "AFFILIATE";

/** Accepts only absolute https URLs without credentials. */
export function isSafeOutboundUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password && u.hostname.includes(".");
  } catch {
    return false;
  }
}

export interface LinkHealth {
  url: string;
  ok: boolean;
  status: number | null;
  error?: string;
}

/** Link health check for admin use. HEAD first, then GET if the host rejects HEAD. */
export async function checkLink(url: string, timeoutMs = 8000): Promise<LinkHealth> {
  if (!isSafeOutboundUrl(url)) return { url, ok: false, status: null, error: "Not a safe https URL" };
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const res = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
      if (method === "HEAD" && (res.status === 405 || res.status === 403)) continue;
      return { url, ok: res.ok, status: res.status };
    } catch (e) {
      if (method === "GET") return { url, ok: false, status: null, error: e instanceof Error ? e.message : String(e) };
    }
  }
  return { url, ok: false, status: null };
}
