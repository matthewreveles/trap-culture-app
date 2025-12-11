import { NextResponse } from "next/server";

const SMS_BASE = process.env.TC_SMS_SERVER_BASE_URL;

if (!SMS_BASE) {
  throw new Error("TC_SMS_SERVER_BASE_URL is not set");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "Missing phone parameter" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${SMS_BASE}/sms/status?phone=${encodeURIComponent(phone)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error fetching SMS status:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to reach SMS server" },
      { status: 502 }
    );
  }
}
