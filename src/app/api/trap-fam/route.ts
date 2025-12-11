// src/app/api/trap-fam/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertBrevoContact, sendBrevoWelcome } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      smsOptIn?: boolean;
    };

    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const lowerEmail = email.toLowerCase();
    const now = new Date();

    const hasPhone = Boolean(body.phone && body.phone.trim());
    const smsOptIn = Boolean(body.smsOptIn && hasPhone);

    // Only use fields that actually exist on the Prisma User model.
    // We keep phone/city/state/etc for Brevo, but we don't try to persist
    // them on the local User table until those columns exist.
    const user = await prisma.user.upsert({
      where: { email: lowerEmail },
      update: {
        name: body.name || undefined,
        smsOptIn,
        smsStatus: smsOptIn ? "active" : undefined,
        smsOptSource: smsOptIn ? "trap_fam_form" : undefined,
        smsOptInAt: smsOptIn ? now : undefined,
      },
      create: {
        email: lowerEmail,
        name: body.name || null,
        smsOptIn,
        smsStatus: smsOptIn ? "active" : null,
        smsOptSource: smsOptIn ? "trap_fam_form" : null,
        smsOptInAt: smsOptIn ? now : null,
      },
    });

    // Send full profile to Brevo for segmentation
    const contactResult = await upsertBrevoContact({
      email: lowerEmail,
      name: body.name,
      phone: hasPhone ? body.phone : undefined,
      city: body.city,
      state: body.state,
      postalCode: body.zip,
      country: body.country,
    });

    const welcomeResult = await sendBrevoWelcome({
      email: lowerEmail,
      name: body.name,
    });

    const ok = contactResult.ok && welcomeResult.ok;

    return NextResponse.json(
      {
        ok,
        userId: user.id,
        contactResult,
        welcomeResult,
      },
      { status: ok ? 200 : 500 }
    );
  } catch (err) {
    console.error("[TRAP_FAM_ERROR]", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}
