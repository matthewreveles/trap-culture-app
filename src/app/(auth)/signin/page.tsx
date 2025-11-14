"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

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

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto px-4 pt-24 pb-32">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign in</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-white/80" htmlFor="email">
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
            className="block text-sm mb-1 text-white/80"
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

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md border border-white/20 text-white font-medium hover:bg-white/10 transition disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-white/60 text-sm mt-6">
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
    <Suspense fallback={<div className="text-center pt-24">Loading…</div>}>
      <SignInForm />
    </Suspense>
  );
}
