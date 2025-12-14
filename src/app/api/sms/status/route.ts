// src/app/api/sms/status/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.TC_SMS_SERVER_BASE_URL;
const AUTH_TOKEN = process.env.TC_SMS_SERVER_AUTH_TOKEN;

/**
 * Lightweight health/status check for the Trap Culture SMS server.
 *
 * IMPORTANT:
 * - This route MUST NOT throw at module load time, or Vercel builds will fail
 *   when env vars are missing.
 * - If env vars are not configured in this environment, we simply return a
 *   "not configured" status instead of crashing.
 */
export async function GET(_req: NextRequest) {
  // If the SMS server isn’t configured, report that cleanly.
  if (!BASE_URL || !AUTH_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        smsServerConfigured: false,
        status: "not_configured",
        message:
          "TC SMS server is not configured for this environment. Add TC_SMS_SERVER_BASE_URL and TC_SMS_SERVER_AUTH_TOKEN to your environment variables.",
      },
      { status: 200 }
    );
  }

  // If it *is* configured, try hitting a simple health endpoint.
  try {
    const res = await fetch(`${BASE_URL.replace(/\/$/, "")}/health`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        Accept: "application/json",
      },
      // No caching; we want real-time status
      cache: "no-store",
    });

    const body = await res
      .json()
      .catch(() => ({ message: "Non-JSON response from SMS server" }));

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          smsServerConfigured: true,
          status: "unreachable",
          httpStatus: res.status,
          body,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        smsServerConfigured: true,
        status: "online",
        body,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[TC_SMS_STATUS_ERROR]", err);
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
