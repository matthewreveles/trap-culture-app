"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    address: "",
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
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
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
    } catch (err) {
      console.error(err);
      setError("Unexpected error.");
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 pt-24 pb-32">
      <h1 className="text-3xl font-bold mb-6 text-center">Create your account</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-white/80">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your name (optional)"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (480) 555-1234"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Address</label>
          <input
            type="text"
            name="address"
            placeholder="123 Main St, Mesa, AZ"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••••"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/80">Confirm password</label>
          <input
            type="password"
            name="confirm"
            placeholder="••••••••••"
            value={form.confirm}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
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

      <p className="text-center text-white/60 text-sm mt-6">
        Already have an account?{" "}
        <a href="/signin" className="underline hover:text-white">Sign in</a>
      </p>
    </main>
  );
}
