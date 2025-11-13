// src/lib/brevo.ts

type UpsertContactInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  sms?: string;
  address?: unknown;
  listIds?: number[];
  attributes?: Record<string, unknown>;
  tags?: string[];
};

const BREVO_API = "https://api.brevo.com/v3";

function must(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} not set`);
  return v;
}
function get(key: string): string | undefined {
  return process.env[key] || undefined;
}

function defaultListIds(): number[] | undefined {
  const raw = get("BREVO_LIST_IDS")?.trim();
  if (!raw) return undefined;
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

async function brevoFetch(path: string, init: RequestInit) {
  const res = await fetch(`${BREVO_API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "api-key": must("BREVO_API_KEY"),
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo ${path} failed (${res.status}): ${text || res.statusText}`);
  }
  return res;
}

/** Upsert a contact + optional list membership + tags */
export async function addOrUpdateBrevoContact(input: UpsertContactInput) {
  const listIds = input.listIds ?? defaultListIds();

  const attributes: Record<string, unknown> = {
    FIRSTNAME: input.firstName,
    LASTNAME: input.lastName,
    SMS: input.sms,
    ADDRESS: input.address,
    ...(input.attributes ?? {}),
  };
  Object.keys(attributes).forEach((k) => attributes[k] === undefined && delete attributes[k]);

  const body: any = {
    email: input.email,
    attributes,
    updateEnabled: true,
  };
  if (listIds?.length) body.listIds = listIds;
  if (input.tags?.length) body.tags = input.tags;

  const res = await brevoFetch("/contacts", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({}));
}

/** Send a transactional welcome email using template params (includes unsubscribe link) */
export async function sendWelcomeEmail(opts: {
  toEmail: string;
  toName?: string;
  unsubscribeUrl: string;
}) {
  const templateId = Number(get("BREVO_WELCOME_TEMPLATE_ID") || 0);
  if (!templateId) throw new Error("BREVO_WELCOME_TEMPLATE_ID not set");

  const senderEmail = get("BREVO_SENDER_EMAIL") || "no-reply@trapculture.com";
  const senderName  = get("BREVO_SENDER_NAME")  || "Trap Culture";

  const body = {
    to: [{ email: opts.toEmail, name: opts.toName }],
    templateId,
    sender: { email: senderEmail, name: senderName },
    params: {
      name: opts.toName || "",
      unsubscribe_url: opts.unsubscribeUrl, // use {{ params.unsubscribe_url }} in Brevo template
    },
  };

  const res = await brevoFetch("/smtp/email", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({}));
}

/** Remove a contact from one or more lists (defaults to BREVO_LIST_IDS) */
export async function removeFromBrevoLists(email: string, listIds?: number[]) {
  const lists = listIds ?? defaultListIds();
  if (!lists?.length) return;
  const id = encodeURIComponent(email);
  await brevoFetch(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify({ unlinkListIds: lists }),
  });
}
