// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendBrevoWelcome, upsertBrevoContact } from "@/lib/brevo";

interface SignupBody {
  name?: string;
  email?: string;
  password?: string;

  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignupBody;

    const name = body?.name ?? null;
    const emailRaw = body?.email ?? "";
    const password = body?.password ?? "";

    const phone = body?.phone ?? "";
    const street = body?.street ?? "";
    const city = body?.city ?? "";
    const state = body?.state ?? "";
    const zip = body?.zip ?? "";
    const country = body?.country ?? "";

    if (!emailRaw || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const email = String(emailRaw).toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Fire-and-forget marketing ops (do not block response)
    upsertBrevoContact({
      email,
      name: user.name ?? undefined,
      phone: phone || undefined,
      addressLine1: street || undefined,
      city: city || undefined,
      state: state || undefined,
      postalCode: zip || undefined,
      country: country || undefined,
    }).catch(() => {});

    sendBrevoWelcome({
      email,
      name: user.name ?? undefined,
    }).catch(() => {});

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[SIGNUP_ERROR]", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
