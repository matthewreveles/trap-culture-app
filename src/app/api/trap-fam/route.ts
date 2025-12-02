// src/app/api/trap-fam/route.ts

import { NextRequest, NextResponse } from "next/server";
import { upsertBrevoContact, sendBrevoWelcome } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const name = body.name?.trim() || undefined;

    // 1) Upsert contact into Brevo list(s)
    const contactResult = await upsertBrevoContact({
      email,
      name,
      phone: body.phone,
      city: body.city,
      state: body.state,
      postalCode: body.zip,
      country: body.country,
    });

    // 2) Fire welcome email (best-effort)
    const welcomeResult = await sendBrevoWelcome({
      email,
      name,
    });

    const ok = contactResult.ok && welcomeResult.ok;

    return NextResponse.json(
      {
        ok,
        contactResult,
        welcomeResult,
      },
      { status: ok ? 200 : 500 }
    );
  } catch (err) {
    console.error("[TRAP_FAM_SIGNUP_ERROR]", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}
