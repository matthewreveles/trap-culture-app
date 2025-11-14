// src/app/api/Brevo/Webhook/route.ts
import { NextResponse } from "next/server";

type BrevoEvent = {
  event?: string;
  email?: string;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    console.error("[Brevo Webhook] Failed to parse JSON body:", error);
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Brevo can send a single event object or an array of events,
  // so normalize to an array for logging.
  const events: BrevoEvent[] = Array.isArray(body) ? body : [body as BrevoEvent];

  for (const evt of events) {
    const { event, email } = evt;
    console.log("[Brevo Webhook] Event received:", {
      event,
      email,
      raw: evt,
    });

    // NOTE:
    // This is where you can later plug in Prisma logic once your User model
    // has the appropriate fields (e.g. unsubscribed/consent flags).
    //
    // Example stub:
    //
    // if (event === "unsubscribe" && email) {
    //   await prisma.user.updateMany({
    //     where: { email },
    //     data: { consentEmail: false }, // only AFTER adding this field to your schema
    //   });
    // }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
