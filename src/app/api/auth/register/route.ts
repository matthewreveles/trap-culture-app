// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_DEFAULT_LIST_ID;
const BREVO_WELCOME_TEMPLATE_ID = process.env.BREVO_WELCOME_TEMPLATE_ID;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME;

// Fire-and-forget Brevo contact sync
async function syncToBrevoContact(payload: {
  email: string;
  name?: string | null;
  phone?: string | null;
  address1?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
}) {
  if (!BREVO_API_KEY) return;

  try {
    const listIds =
      BREVO_LIST_ID && !Number.isNaN(Number(BREVO_LIST_ID))
        ? [Number(BREVO_LIST_ID)]
        : undefined;

    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        attributes: {
          FIRSTNAME: payload.name ?? "",
          PHONE: payload.phone ?? "",
          ADDRESS: payload.address1 ?? "",
          CITY: payload.city ?? "",
          STATE: payload.state ?? "",
          ZIPCODE: payload.postalCode ?? "",
          COUNTRY: payload.country ?? "",
          SOURCE: "Trap Culture App",
        },
        listIds,
        updateEnabled: true,
      }),
    });
  } catch (err) {
    console.error("[BREVO_CONTACT_ERROR]", err);
  }
}

// Optional: send welcome email via Brevo template
async function sendBrevoWelcomeEmail(email: string, name?: string | null) {
  if (!BREVO_API_KEY || !BREVO_WELCOME_TEMPLATE_ID) return;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        to: [{ email, name: name ?? undefined }],
        templateId: Number(BREVO_WELCOME_TEMPLATE_ID),
        params: {
          FIRSTNAME: name ?? "",
        },
        sender:
          BREVO_SENDER_EMAIL && BREVO_SENDER_NAME
            ? { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME }
            : undefined,
      }),
    });
  } catch (err) {
    console.error("[BREVO_WELCOME_ERROR]", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,
      address1,
      city,
      state,
      postalCode,
      country,
    } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const lower = String(email).toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: lower },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    // Prisma user create – KEEP THIS SHAPE MATCHED TO YOUR SCHEMA
    const user = await prisma.user.create({
      data: {
        name: name ?? null,
        email: lower,
        passwordHash,
        // If you later add columns for phone / address, plug them in here.
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Don't block the response on marketing stuff
    syncToBrevoContact({
      email: lower,
      name: name ?? null,
      phone: phone ?? null,
      address1: address1 ?? null,
      city: city ?? null,
      state: state ?? null,
      postalCode: postalCode ?? null,
      country: country ?? null,
    });
    sendBrevoWelcomeEmail(lower, name ?? null);

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER_ERROR]", err);
    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}
