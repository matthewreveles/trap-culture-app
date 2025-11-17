// src/app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID_SIGNUPS = process.env.BREVO_LIST_ID_SIGNUPS;

/**
 * Minimal shape of the request body coming from /auth/signup form
 */
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

interface BrevoContactPayload {
  email: string;
  attributes?: Record<string, any>;
  listIds?: number[];
}

/**
 * Best-effort add / update of the contact in Brevo.
 * Failures here are logged but do NOT block signup.
 */
async function addContactToBrevo(payload: BrevoContactPayload) {
  if (!BREVO_API_KEY) {
    console.warn("[BREVO] BREVO_API_KEY not set; skipping contact sync.");
    return;
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    // 400 from Brevo is usually "Contact already exists" – not fatal.
    if (!res.ok && res.status !== 400) {
      const text = await res.text();
      console.error("[BREVO] Failed to create/update contact:", res.status, text);
    }
  } catch (err) {
    console.error("[BREVO] Error calling contacts API:", err);
  }
}

/**
 * POST /api/auth/signup
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignupBody;

    const {
      name,
      email,
      password,

      phone,
      street,
      city,
      state,
      zip,
      country,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const lowerEmail = String(email).toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    // NOTE: DB fields here are kept conservative so we don't break your Prisma schema.
    // If you later add phone/address to the User model, you can include them in `data: { ... }`.
    const user = await prisma.user.create({
      data: {
        name: name ?? null,
        email: lowerEmail,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Fire-and-forget Brevo contact sync
    const brevoPayload: BrevoContactPayload = {
      email: lowerEmail,
      attributes: {
        FIRSTNAME: name ?? "",
        PHONE: phone ?? "",
        STREET: street ?? "",
        CITY: city ?? "",
        STATE: state ?? "",
        ZIP: zip ?? "",
        COUNTRY: country ?? "",
        SOURCE: "Trap Culture App Signup",
      },
    };

    if (BREVO_LIST_ID_SIGNUPS) {
      const parsed = Number(BREVO_LIST_ID_SIGNUPS);
      if (!Number.isNaN(parsed)) {
        brevoPayload.listIds = [parsed];
      }
    }

    // Do not await in a way that blocks the response
    addContactToBrevo(brevoPayload).catch(() => {});

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[SIGNUP_ERROR]", err);
    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}
