// src/app/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const search = useSearchParams();
  const error = search.get("error"); // NextAuth will append ?error=CredentialsSignin, etc.

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (res?.error) {
      setMsg("Sign in failed. Check your email/password.");
      return;
    }
    window.location.href = res?.url ?? "/dashboard";
  };

  return (
    <main className="mx-auto max-w-md px-6 pt-28 pb-24">
      <header className="mb-6 space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
        <p className="text-white/70 text-sm">
          Use the email & password you registered with.
        </p>
      </header>

      {(msg || error) && (
        <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 px-3 py-2 text-sm text-red-200">
          {msg || (error === "CredentialsSignin" ? "Invalid credentials." : "Something went wrong.")}
        </div>
      )}

      <form onSubmit={onSubmit} className="tc-glow-card rounded-2xl border border-white/10 bg-black/30 p-4 space-y-4">
        <label className="block text-sm text-white/80">
          Email
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block text-sm text-white/80">
          Password
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 font-medium hover:bg-white/10 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-white/70">
        Don’t have an account?{" "}
        <Link href="/signup" className="tc-gradient-text font-semibold">
          Sign up
        </Link>
      </p>
    </main>
  );
}
