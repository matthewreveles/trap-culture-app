// src/app/api/sms/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.TC_SMS_SERVER_BASE_URL;
const AUTH_TOKEN = process.env.TC_SMS_SERVER_AUTH_TOKEN;

type SubscribeBody = {
  phone?: string;
  name?: string;
  email?: string;
  tags?: string[];
};

/**
 * Subscribe a user to SMS updates via the TC SMS server.
 *
 * This route is intentionally safe for environments where the SMS
 * server is not configured. It never throws at module load.
 */
export async function POST(req: NextRequest) {
  let body: SubscribeBody;

  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const phone = body.phone?.trim();
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "Phone number is required." },
      { status: 400 }
    );
  }

  // If SMS server is not configured, report that but do not crash.
  if (!BASE_URL || !AUTH_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        smsServerConfigured: false,
        status: "not_configured",
        message:
          "TC SMS server is not configured for this environment. Add TC_SMS_SERVER_BASE_URL and TC_SMS_SERVER_AUTH_TOKEN to enable SMS subscriptions.",
      },
      { status: 200 }
    );
  }

  try {
    // Adjust the path `/api/subscribers` to whatever your SMS server expects.
    const res = await fetch(
      `${BASE_URL.replace(/\/$/, "")}/api/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          phone,
          name: body.name,
          email: body.email,
          tags: body.tags ?? ["trap-fam"],
          source: "trap-culture-app",
        }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          smsServerConfigured: true,
          status: "error",
          httpStatus: res.status,
          data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        smsServerConfigured: true,
        status: "subscribed",
        data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[TC_SMS_SUBSCRIBE_ERROR]", err);
    return NextResponse.json(
      {
        ok: false,
        smsServerConfigured: true,
        status: "error",
        message: "Unexpected error talking to the SMS server.",
      },
      { status: 200 }
    );
  }
}
