import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const sig = req.headers.get("x-brevo-signature"); // Brevo can send signature
  // TODO: verify signature if Brevo provides webhook secret (recommended)

  const body = await req.json();
  // body may include eventType like 'unsubscribe' or 'hard_bounce' etc.
  // Inspect the payload in Dashboard to confirm structure

  // Example handling:
  if (Array.isArray(body)) {
    for (const evt of body) {
      if (evt.event === "unsub") {
        const email = evt.email;
        await prisma.user.updateMany({
          where: { email },
          data: { consentEmail: false },
        });
      }
      // handle other events as needed
    }
  }

  return NextResponse.json({ ok: true });
}