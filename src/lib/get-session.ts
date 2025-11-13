// src/lib/get-session.ts
import { auth, type UserRecord } from "@/lib/auth";

export type Session =
  | { user: UserRecord }
  | { user: null };

/** Minimal wrapper so server components can do `const session = await getSession()` */
export async function getSession(): Promise<Session> {
  const { user } = await auth();
  return { user };
}
