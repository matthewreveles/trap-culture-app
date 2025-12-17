// src/lib/requestOrigin.ts
import { headers } from "next/headers";

/**
 * Builds a safe absolute origin string for server-side usage.
 * Works locally + on Vercel + behind proxies.
 */
export async function getRequestOrigin(): Promise<string> {
  const h = await headers();

  const proto = h.get("x-forwarded-proto") ?? "http";

  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.VERCEL_URL ??
    "localhost:3000";

  const cleanHost = host.replace(/^https?:\/\//, "");

  return `${proto}://${cleanHost}`;
}
