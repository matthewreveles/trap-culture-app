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

    // They must check smsOptIn AND provide a valid phone number
    const hasPhone = Boolean(body.phone && body.phone.trim());
    const smsOptIn = Boolean(body.smsOptIn && hasPhone);

    // Upsert user in database (source of truth)
    const user = await prisma.user.upsert({
      where: { email: lowerEmail },
      update: {
        name: body.name || undefined,
        phone: hasPhone ? body.phone : undefined,
        city: body.city || undefined,
        state: body.state || undefined,
        zip: body.zip || undefined,
        country: body.country || undefined,
        smsOptIn,
        smsStatus: smsOptIn ? "active" : undefined,
        smsOptSource: smsOptIn ? "trap_fam_form" : undefined,
        smsOptInAt: smsOptIn ? now : undefined,
      },
      create: {
        email: lowerEmail,
        name: body.name || null,
        phone: hasPhone ? body.phone || null : null,
        city: body.city || null,
        state: body.state || null,
        zip: body.zip || null,
        country: body.country || null,
        smsOptIn,
        smsStatus: smsOptIn ? "active" : null,
        smsOptSource: smsOptIn ? "trap_fam_form" : null,
        smsOptInAt: smsOptIn ? now : null,
      },
    });

    // Sync email data to Brevo
    const contactResult = await upsertBrevoContact({
      email: lowerEmail,
      name: body.name,
      phone: hasPhone ? body.phone : undefined,
      city: body.city,
      state: body.state,
      postalCode: body.zip,
      country: body.country,
    });

    // Send Brevo welcome email
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
