import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Contact form handler. Configure via environment variables (see .env.example):
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort per-instance rate limit. Use a shared store (e.g. Upstash) for stronger protection.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ");

export async function POST(req: Request) {
  const env = process.env;
  // EMAIL_USER / EMAIL_PASS (Gmail) are accepted for compatibility with the original setup.
  const SMTP_USER = env.SMTP_USER || env.EMAIL_USER;
  const SMTP_PASS = env.SMTP_PASS || env.EMAIL_PASS;
  const SMTP_HOST = env.SMTP_HOST || (env.EMAIL_USER ? "smtp.gmail.com" : undefined);
  const SMTP_PORT = env.SMTP_PORT;
  const CONTACT_TO_EMAIL = env.CONTACT_TO_EMAIL || SMTP_USER;
  const CONTACT_FROM_EMAIL = env.CONTACT_FROM_EMAIL;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.error("Contact form is not configured: missing SMTP_* or CONTACT_TO_EMAIL env vars");
    return NextResponse.json({ error: "Messaging is temporarily unavailable." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill the hidden "company" field.
  if (clean(body.company, 200)) {
    return NextResponse.json({ success: true });
  }

  const name = oneLine(clean(body.name, LIMITS.name));
  const email = oneLine(clean(body.email, LIMITS.email));
  const subject = oneLine(clean(body.subject, LIMITS.subject));
  const message = clean(body.message, LIMITS.message);

  if (name.length < 2 || !EMAIL_RE.test(email) || !subject || message.length < 10) {
    return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
  }

  try {
    const port = Number(SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      // Send from our own authenticated address; the visitor goes in Reply-To.
      from: CONTACT_FROM_EMAIL || SMTP_USER,
      to: CONTACT_TO_EMAIL,
      replyTo: { name, address: email },
      subject: `Website message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json({ error: "We couldn’t send your message." }, { status: 502 });
  }
}
