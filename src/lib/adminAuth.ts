// Admin session: an HMAC-signed, expiring cookie. Uses Web Crypto so it works in middleware (edge)
// and server components. Admin is completely disabled (404) unless ADMIN_PASSWORD is set.

export const ADMIN_COOKIE = "hb_admin";
const TTL_SECONDS = 8 * 60 * 60;

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

async function hmac(value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession(): Promise<{ value: string; maxAge: number }> {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `admin.${exp}`;
  return { value: `${payload}.${await hmac(payload)}`, maxAge: TTL_SECONDS };
}

export async function verifySession(value: string | undefined): Promise<boolean> {
  if (!value || !adminEnabled()) return false;
  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  return safeEqual(parts[2], await hmac(`${parts[0]}.${parts[1]}`));
}

export async function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare HMACs of both values so length differences don't leak through timing.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${expected}`));
}
