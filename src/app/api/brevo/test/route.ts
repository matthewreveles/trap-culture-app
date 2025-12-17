// src/app/api/brevo/test/route.ts
import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_WELCOME_TEMPLATE_ID = process.env.BREVO_WELCOME_TEMPLATE_ID;

const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || "no-reply@trapcultureaz.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Trap Culture";

const BREVO_TEST_KEY = process.env.BREVO_TEST_KEY || "brevo-test-123";

type Body = { email?: string; name?: string };

async function brevoPost(path: string, body: any) {
  if (!BREVO_API_KEY) {
    return { ok: false, status: 500, text: "BREVO_API_KEY missing" };
  }

  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, text };
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-brevo-test-key") || "";
  if (key !== BREVO_TEST_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { email, name } = (await req.json().catch(() => ({}))) as Body;

  if (!email) {
    return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const displayName = name?.trim() || undefined;

  // A) Template-based email (what you actually want)
  const templateId = Number(BREVO_WELCOME_TEMPLATE_ID);
  const templateSend =
    BREVO_WELCOME_TEMPLATE_ID && !Number.isNaN(templateId)
      ? await brevoPost("/smtp/email", {
          sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
          to: [{ email: normalizedEmail, name: displayName }],
          templateId,
          params: {
            FIRSTNAME: displayName || "",
            NAME: displayName || "",
          },
        })
      : { ok: false, status: 500, text: "BREVO_WELCOME_TEMPLATE_ID missing/invalid" };

  // B) Plain email (no template) to isolate template vs deliverability
  const plainSend = await brevoPost("/smtp/email", {
    sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
    to: [{ email: normalizedEmail, name: displayName }],
    subject: "Trap Culture — Brevo delivery test",
    htmlContent: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Brevo delivery test</h2>
        <p>If you got this, deliverability works from <b>${BREVO_SENDER_EMAIL}</b>.</p>
        <p>Recipient: <b>${normalizedEmail}</b></p>
        <p>Time: <b>${new Date().toISOString()}</b></p>
      </div>
    `,
  });

  console.log("[BREVO_TEST] template:", templateSend.status, templateSend.text);
  console.log("[BREVO_TEST] plain:", plainSend.status, plainSend.text);

  return NextResponse.json(
    {
      ok: true,
      sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
      template: templateSend,
      plain: plainSend,
    },
    { status: 200 }
  );
}
