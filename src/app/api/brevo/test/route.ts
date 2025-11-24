// src/app/api/brevo/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { upsertBrevoContact, sendBrevoWelcome } from "@/lib/brevo";

const TEST_KEY = process.env.BREVO_TEST_KEY;
const FALLBACK_EMAIL = process.env.BREVO_TEST_EMAIL;

export async function POST(req: NextRequest) {
  if (!TEST_KEY) {
    return NextResponse.json(
      { error: "BREVO_TEST_KEY is not configured" },
      { status: 500 }
    );
  }

  const providedKey = req.headers.get("x-brevo-test-key");
  if (providedKey !== TEST_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    phone?: string;
  };

  const email = body.email?.trim() || FALLBACK_EMAIL;
  if (!email) {
    return NextResponse.json(
      { error: "Missing email in body and BREVO_TEST_EMAIL is not set" },
      { status: 400 }
    );
  }

  const contactResult = await upsertBrevoContact({
    email,
    name: body.name,
    phone: body.phone,
  });

  const welcomeResult = await sendBrevoWelcome({
    email,
    name: body.name,
  });

  const success = contactResult.ok && welcomeResult.ok;

  return NextResponse.json(
    {
      ok: success,
      contactResult,
      welcomeResult,
    },
    { status: success ? 200 : 500 }
  );
}
