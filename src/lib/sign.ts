// src/lib/sign.ts
import crypto from "crypto";

function secret() {
  const s =
    process.env.UNSUBSCRIBE_HMAC_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("UNSUBSCRIBE_HMAC_SECRET (or AUTH/NEXTAUTH) not set");
  return s;
}

export function makeUnsubToken(email: string) {
  const ts = Math.floor(Date.now() / 1000); // seconds
  const data = `${email}:${ts}`;
  const sig  = crypto.createHmac("sha256", secret()).update(data).digest("hex");
  return `${ts}.${sig}`;
}

// tokens valid for 30 days
const MAX_AGE_SEC = 30 * 24 * 60 * 60;

export function verifyUnsubToken(email: string, token: string) {
  const [tsStr, sig] = token.split(".");
  if (!tsStr || !sig) return false;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now - ts > MAX_AGE_SEC) return false;

  const data = `${email}:${ts}`;
  const expected = crypto.createHmac("sha256", secret()).update(data).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
