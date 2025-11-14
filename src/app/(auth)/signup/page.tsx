"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => router.push("/signin"), 1500);
  };

  return (
    <main className="max-w-md mx-auto px-4 pt-24 pb-32">
      <h1 className="text-3xl font-bold mb-6 text-center">Create account</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-white/80">Your name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Confirm password</label>
          <input
            type="password"
            name="confirm"
            required
            value={form.confirm}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Account created! Redirecting…</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md border border-white/20 text-white font-medium hover:bg-white/10 transition disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="pt-24 text-center">Loading…</main>}>
      <SignupForm />
    </Suspense>
  );
}
