// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { addOrUpdateBrevoContact, sendWelcomeEmail } from "@/lib/brevo";
import { makeUnsubToken } from "@/lib/sign";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, address, marketingConsent } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const lower = String(email).toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: lower } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name ?? null,
        email: lower,
        passwordHash,
        phone: phone ?? null,
        address: address ?? null,
        // If you later add consent fields to Prisma, set them here:
        // consentEmail: !!marketingConsent,
        // consentAt: marketingConsent ? new Date() : null,
      },
      select: { id: true, email: true, name: true },
    });

    // Sync to Brevo (non-blocking)
    (async () => {
      try {
        await addOrUpdateBrevoContact({
          email: lower,
          firstName: name ? String(name).split(" ")[0] : undefined,
          lastName: name ? String(name).split(" ").slice(1).join(" ") || undefined : undefined,
          sms: phone,
          address,
        });

        // Send welcome email only if user opted in and a template is set
        if (marketingConsent && process.env.BREVO_WELCOME_TEMPLATE_ID) {
          const base = process.env.BREVO_UNSUBSCRIBE_BASE || `${process.env.NEXTAUTH_URL || ""}/unsubscribe`;
          const token = makeUnsubToken(lower);
          const unsubUrl = `${base}?e=${encodeURIComponent(lower)}&t=${encodeURIComponent(token)}`;

          await sendWelcomeEmail({
            toEmail: lower,
            toName: user.name || undefined,
            unsubscribeUrl: unsubUrl,
          });
        }
      } catch (err) {
        console.warn("[BREVO_SYNC_WARNING]", err);
      }
    })();

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER_ERROR]", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
