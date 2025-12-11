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

    // Just for analytics / Brevo logic if you want it later
    const hasPhone = Boolean(body.phone && body.phone.trim());
    const smsOptIn = Boolean(body.smsOptIn && hasPhone);

    // 🔹 Prisma User: only touch fields that actually exist on this model.
    // If your prisma/schema.prisma only has id / name / email,
    // this will type-check cleanly.
    const user = await prisma.user.upsert({
      where: { email: lowerEmail },
      update: {
        name: body.name || undefined,
      },
      create: {
        email: lowerEmail,
        name: body.name || null,
      },
    });

    // 🔹 Full profile goes to Brevo (no type issues here)
    const contactResult = await upsertBrevoContact({
      email: lowerEmail,
      name: body.name,
      phone: hasPhone ? body.phone : undefined,
      city: body.city,
      state: body.state,
      postalCode: body.zip,
      country: body.country,
      // if you ever add SMS-related attributes in Brevo, you can hook smsOptIn here
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
        smsOptIn, // purely informational for the frontend
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
