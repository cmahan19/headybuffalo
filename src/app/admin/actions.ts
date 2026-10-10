"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, createSession, verifySession } from "@/lib/adminAuth";

const attempts = new Map<string, number[]>();

export async function login(form: FormData): Promise<void> {
  const next = String(form.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") || next.startsWith("/seller") ? next : "/admin";
  const fail = (code: string) => redirect(`/admin/login?error=${code}&next=${encodeURIComponent(safeNext)}`);

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 15 * 60_000);
  if (recent.length >= 8) fail("rate");
  attempts.set(ip, [...recent, now]);

  if (!(await checkPassword(String(form.get("password") ?? "")))) fail("password");

  const session = await createSession();
  (await cookies()).set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !process.env.ADMIN_INSECURE_COOKIE,
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  redirect(safeNext);
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/** Defense in depth: every admin server action re-verifies the session (middleware alone isn't enough). */
export async function requireAdmin(): Promise<string> {
  if (!(await verifySession((await cookies()).get(ADMIN_COOKIE)?.value))) {
    throw new Error("Unauthorized");
  }
  return "owner-admin";
}
