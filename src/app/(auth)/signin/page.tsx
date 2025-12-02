// src/app/(auth)/signin/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Route } from "next";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default to home if no callbackUrl provided, and treat it as a typed Route
  const callbackUrl = (searchParams.get("callbackUrl") ?? "/") as Route;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // result?.url may be undefined; fall back to callbackUrl and
    // cast to Route so typedRoutes is satisfied.
    router.push((result?.url ?? callbackUrl) as Route);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 pt-24 pb-32 text-foreground">
      <h1 className="mb-6 text-center font-bebas text-3xl tracking-[0.3em] uppercase">
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="mb-1 block text-sm text-white/80 dark:text-white/80"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm text-white/80 dark:text-white/80"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md border border-white/20 py-2 font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        Don’t have an account?{" "}
        <a href="/signup" className="underline hover:text-white">
          Create one
        </a>
      </p>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Loading…</div>}>
      <SignInForm />
    </Suspense>
  );
}
