// src/app/api/sms/subscribe/route.ts
import { NextResponse } from "next/server";

const SMS_BASE = process.env.TC_SMS_SERVER_BASE_URL;

if (!SMS_BASE) {
  throw new Error("TC_SMS_SERVER_BASE_URL is not set");
}

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { name, phone, tags, source } = body || {};

  if (!phone || typeof phone !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid phone" },
      { status: 400 }
    );
  }

  // Default tags/source for Trap Fam if they are not passed in explicitly
  const payload = {
    name: name ?? null,
    phone,
    tags: Array.isArray(tags) ? tags : ["trap_fam"],
    source: source ?? "trap-app",
  };

  try {
    const res = await fetch(`${SMS_BASE}/sms/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({
      ok: false,
      error: "Invalid JSON from SMS server",
    }));

    // Optional debug logging if the upstream failed
    if (!res.ok) {
      console.error("[SMS_SUBSCRIBE] upstream error", res.status, data);
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error calling SMS subscribe:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to reach SMS server" },
      { status: 502 }
    );
  }
}
