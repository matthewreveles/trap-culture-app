import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUnsubToken } from "@/lib/sign";
import { removeFromBrevoLists } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();
    const lower = String(email || "").toLowerCase().trim();
    if (!lower || !token) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }
    if (!verifyUnsubToken(lower, token)) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // If you add consent fields in Prisma, update them here:
    // await prisma.user.updateMany({
    //   where: { email: lower },
    //   data: { consentEmail: false, consentAt: null },
    // });

    await removeFromBrevoLists(lower).catch((e) => {
      console.warn("[BREVO_UNLINK_WARN]", e);
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[UNSUBSCRIBE_ERROR]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
