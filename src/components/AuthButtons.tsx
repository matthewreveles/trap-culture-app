"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80">{session.user?.email}</span>
        <button onClick={() => signOut()} className="px-3 py-1 rounded bg-zinc-800">
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn("github")} className="px-3 py-1 rounded bg-zinc-800">
      Sign in with GitHub
    </button>
  );
}
