// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * No-op middleware so `export { auth as middleware } from "@/lib/auth"`
 * is no longer required. Add logic/route protection later if needed.
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Example: protect /dashboard later by updating matcher
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
