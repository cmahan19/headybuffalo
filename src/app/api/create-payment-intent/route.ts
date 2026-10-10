import { NextResponse } from "next/server";

// Retired endpoint. It trusted client-supplied data (prices/amounts or credentials) and has been
// replaced by /api/checkout, which prices orders from the server-side catalog.
// Safe to delete this file.
export function POST() {
  return NextResponse.json({ error: "This endpoint has been retired." }, { status: 410 });
}
