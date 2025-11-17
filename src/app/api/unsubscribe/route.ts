// src/app/api/unsubscribe/route.ts

import { NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

/**
 * Mark a contact as email-blacklisted in Brevo so they stop
 * getting marketing emails.
 *
 * Expects JSON body: { "email": "user@example.com" }
 */
export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!BREVO_API_KEY) {
      console.warn("[BREVO] BREVO_API_KEY missing; cannot unsubscribe.");
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 }
      );
    }

    // Brevo identifies contacts by email in this endpoint
    const identifier = encodeURIComponent(email.toLowerCase());

    const res = await fetch(
      `https://api.brevo.com/v3/contacts/${identifier}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          emailBlacklisted: true,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(
        "[BREVO] Unsubscribe failed:",
        res.status,
        text
      );
      return NextResponse.json(
        { error: "Unable to unsubscribe at this time." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[UNSUBSCRIBE_ERROR]", err);
    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}

/**
 * Simple GET handler so hitting /api/unsubscribe in a browser
 * doesn't 500 — handy for quick checks.
 */
export async function GET() {
  return new NextResponse("Trap Culture unsubscribe endpoint is alive.", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
