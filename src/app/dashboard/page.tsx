"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export const dynamic = "force-dynamic";

function DashboardInner() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-white/80">Loading…</p>
      </main>
    );
  }

  // Signed-out
  if (!session) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-white/70">
          You’re not signed in. Choose an option below:
        </p>

        <div className="flex gap-3">
          <Link
            href="/signin"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Create account
          </Link>
        </div>
      </main>
    );
  }

  // Signed-in view
  const user = session.user;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="text-white/80">
          Signed in as{" "}
          <span className="font-medium">
            {user?.email ?? user?.name ?? "your account"}
          </span>
        </p>
      </header>

      <section
        className="rounded-xl border p-4 tc-glow-card"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(255,255,255,0.03)",
        }}
      >
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <ul className="space-y-2 text-white/80">
          <li>
            Name: <span className="text-white">{user?.name ?? "—"}</span>
          </li>
          <li>
            Email: <span className="text-white">{user?.email ?? "—"}</span>
          </li>
        </ul>
      </section>

      <div className="flex gap-3">
        <button
          onClick={() => signOut()}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
          style={{
            borderColor: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Sign out
        </button>

        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
          style={{
            borderColor: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="p-24 text-center">Loading…</main>}>
      <DashboardInner />
    </Suspense>
  );
}
