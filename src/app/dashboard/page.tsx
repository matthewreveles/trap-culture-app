// src/app/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        Loading…
      </main>
    );
  }

  if (!session) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-white/70">You’re not signed in.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome</h1>

      <p className="text-white/80">
        Signed in as{" "}
        <span className="font-medium">
          {session.user?.email ?? session.user?.name}
        </span>
      </p>

      <button
        onClick={() => signOut()}
        className="rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        Sign out
      </button>
    </main>
  );
}
