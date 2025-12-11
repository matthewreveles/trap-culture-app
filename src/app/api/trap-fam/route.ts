// src/app/api/sms/status/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.TC_SMS_SERVER_BASE_URL;

  // If the SMS server URL is not configured, do NOT throw.
  // Just report that SMS is not configured so the UI can handle it.
  if (!baseUrl) {
    console.warn(
      "[SMS_STATUS] TC_SMS_SERVER_BASE_URL is not set. Returning unconfigured status."
    );

    return NextResponse.json(
      {
        ok: false,
        configured: false,
        upstreamReachable: false,
        message: "SMS server base URL is not configured for this deployment.",
      },
      { status: 200 }
    );
  }

  try {
    const url = baseUrl.replace(/\/$/, "") + "/health";

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("[SMS_STATUS] Upstream returned non-OK:", res.status, data);
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          upstreamReachable: false,
          status: res.status,
          upstream: data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        configured: true,
        upstreamReachable: true,
        upstream: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[SMS_STATUS] Error reaching SMS server:", err);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        upstreamReachable: false,
        error: "Failed to reach SMS server.",
      },
      { status: 200 }
    );
  }
}
