// src/app/api/sms/status/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.TC_SMS_SERVER_BASE_URL;
  const apiKey = process.env.TC_SMS_SERVER_API_KEY;

  // If SMS server is not configured, don't throw – just report "not configured"
  if (!baseUrl || !apiKey) {
    console.warn(
      "[SMS_STATUS] TC_SMS_SERVER_BASE_URL or TC_SMS_SERVER_API_KEY is not set. Returning not-configured status."
    );

    return NextResponse.json(
      {
        ok: false,
        configured: false,
        status: "not_configured",
        detail: "SMS server environment variables are not set on this deployment.",
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      // This is a simple health check; don't cache it aggressively
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[SMS_STATUS] Health check failed:", res.status, text);

      return NextResponse.json(
        {
          ok: false,
          configured: true,
          status: "unhealthy",
          httpStatus: res.status,
        },
        { status: 200 }
      );
    }

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(
      {
        ok: true,
        configured: true,
        status: "healthy",
        data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[SMS_STATUS] Error calling SMS server:", err);

    return NextResponse.json(
      {
        ok: false,
        configured: true,
        status: "error",
        detail: "Failed to reach SMS server.",
      },
      { status: 200 }
    );
  }
}
