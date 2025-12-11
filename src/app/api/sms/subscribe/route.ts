// src/app/api/sms/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SubscribeBody = {
  phone?: string;
  name?: string;
  source?: string;
};

export async function POST(req: NextRequest) {
  const baseUrl = process.env.TC_SMS_SERVER_BASE_URL;

  // Again, no throwing if env is missing.
  if (!baseUrl) {
    console.warn(
      "[SMS_SUBSCRIBE] TC_SMS_SERVER_BASE_URL is not set. Treating as no-op."
    );

    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          "SMS server is not configured for this deployment. Subscription was not forwarded upstream.",
      },
      { status: 200 }
    );
  }

  let body: SubscribeBody;
  try {
    body = (await req.json().catch(() => ({}))) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.phone?.trim()) {
    return NextResponse.json(
      { ok: false, configured: true, error: "Phone number is required." },
      { status: 400 }
    );
  }

  const payload = {
    phone: body.phone.trim(),
    name: body.name?.trim() || null,
    source: body.source?.trim() || "trap-app",
  };

  try {
    const url = baseUrl.replace(/\/$/, "") + "/sms/subscribe";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(
        "[SMS_SUBSCRIBE] Upstream returned non-OK:",
        res.status,
        data
      );
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          upstreamStatus: res.status,
          upstream: data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        configured: true,
        upstreamStatus: res.status,
        upstream: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[SMS_SUBSCRIBE] Error calling SMS server:", err);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        error: "Failed to reach SMS server.",
      },
      { status: 200 }
    );
  }
}
