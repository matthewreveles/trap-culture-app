// src/app/api/brevo/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    // Brevo should send JSON, but just in case:
    const text = await req.text().catch(() => "");
    console.warn("[Brevo webhook] Non-JSON payload:", text);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // TODO: you can store this in DB, log it, or trigger automations
  console.log("[Brevo webhook] Event:", payload);

  // If/when you enable IP security in Brevo, they'll only POST from their IPs.
  // If Brevo later gives you an HMAC secret:
  //  - Add BREVO_WEBHOOK_SECRET to .env.local
  //  - Verify headers + body here before trusting payload.

  return NextResponse.json({ ok: true }, { status: 200 });
}
