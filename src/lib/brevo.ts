// src/lib/brevo.ts
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_DEFAULT_LIST_ID = process.env.BREVO_DEFAULT_LIST_ID;
const BREVO_WELCOME_TEMPLATE_ID = process.env.BREVO_WELCOME_TEMPLATE_ID;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "no-reply@trapculture.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Trap Culture";

if (!BREVO_API_KEY) {
  console.warn("[BREVO] BREVO_API_KEY is not set. Brevo features will be skipped.");
}

// Tiny helper to avoid repeating headers
async function brevoFetch(path: string, init: RequestInit): Promise<Response> {
  if (!BREVO_API_KEY) {
    // pretend success when key missing so app doesn't crash
    return new Response(null, { status: 204 });
  }

  const url = `https://api.brevo.com/v3${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "api-key": BREVO_API_KEY,
    ...(init.headers || {}),
  };

  return fetch(url, {
    ...init,
    headers,
  });
}

type BrevoContactInput = {
  email: string;
  name?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

/**
 * Upsert contact into Brevo audience and optionally add to a default list.
 */
export async function upsertBrevoContact(input: BrevoContactInput) {
  if (!BREVO_API_KEY) return;

  const attributes: Record<string, any> = {};

  if (input.name) attributes.FULLNAME = input.name;
  if (input.phone) attributes.PHONE = input.phone;
  if (input.addressLine1) attributes.ADDRESS_LINE1 = input.addressLine1;
  if (input.addressLine2) attributes.ADDRESS_LINE2 = input.addressLine2;
  if (input.city) attributes.CITY = input.city;
  if (input.state) attributes.STATE = input.state;
  if (input.postalCode) attributes.POSTAL_CODE = input.postalCode;
  if (input.country) attributes.COUNTRY = input.country;

  const listIds: number[] = [];
  if (BREVO_DEFAULT_LIST_ID && !Number.isNaN(Number(BREVO_DEFAULT_LIST_ID))) {
    listIds.push(Number(BREVO_DEFAULT_LIST_ID));
  }

  const body = {
    email: input.email,
    attributes,
    updateEnabled: true, // upsert
    listIds: listIds.length ? listIds : undefined,
  };

  const res = await brevoFetch("/contacts", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    console.error("[BREVO_CONTACT_ERROR]", res.status, text);
  }
}

type BrevoWelcomeInput = {
  email: string;
  name?: string;
};

/**
 * Send welcome email using a Brevo transactional template.
 * The unsubscribe link should be placed in the template itself,
 * styled small and inconspicuous at the bottom.
 */
export async function sendBrevoWelcome(input: BrevoWelcomeInput) {
  if (!BREVO_API_KEY || !BREVO_WELCOME_TEMPLATE_ID) return;

  const templateId = Number(BREVO_WELCOME_TEMPLATE_ID);
  if (Number.isNaN(templateId)) {
    console.warn("[BREVO] BREVO_WELCOME_TEMPLATE_ID is not a number.");
    return;
  }

  const body = {
    sender: {
      email: BREVO_SENDER_EMAIL,
      name: BREVO_SENDER_NAME,
    },
    to: [
      {
        email: input.email,
        name: input.name || undefined,
      },
    ],
    templateId,
    params: {
      NAME: input.name || "",
      // Add anything else you reference in your Brevo template here
    },
  };

  const res = await brevoFetch("/smtp/email", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[BREVO_WELCOME_ERROR]", res.status, text);
  }
}
