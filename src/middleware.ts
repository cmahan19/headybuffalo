import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminEnabled, verifySession } from "@/lib/adminAuth";

// Protects /admin and /seller. With no ADMIN_PASSWORD configured, these areas don't exist (404).
// Seller routes additionally require MARKETPLACE_ENABLED; seller self-service accounts need the
// database/auth decision (docs/COLORFUL_MARKETPLACE_AUDIT.md §6), so today only an admin can preview them.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const notFound = () => new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });

  if (!adminEnabled()) return notFound();
  if (pathname.startsWith("/seller") && process.env.MARKETPLACE_ENABLED !== "true") return notFound();
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (!(await verifySession(req.cookies.get(ADMIN_COOKIE)?.value))) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*", "/api/admin/:path*"],
};
