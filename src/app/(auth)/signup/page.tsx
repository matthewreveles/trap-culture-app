"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

type FormState = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  password: string;
  confirm: string;
};

function SignupForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClasses =
    "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/40";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
          phone: form.phone || null,
          street: form.street || null,
          city: form.city || null,
          state: form.state || null,
          zip: form.zip || null,
          country: form.country || null,
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
      console.error("[SIGNUP_ERROR]", err);
      setError("Unexpected error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 pt-24 pb-32 text-foreground">
      <h1 className="mb-8 text-center font-bebas text-4xl tracking-[0.3em] uppercase">
        Trap Fam
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="tc-label">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Trap Fam"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="tc-label">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="tc-label">Phone (optional)</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="602-555-0123"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="tc-label">Street address (optional)</label>
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="123 Any St"
            className={inputClasses}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="tc-label">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Mesa"
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <label className="tc-label">ZIP</label>
            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="85201"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="tc-label">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select state</option>
            <option value="AZ">AZ</option>
            <option value="CA">CA</option>
            <option value="CO">CO</option>
            <option value="NV">NV</option>
            <option value="NM">NM</option>
            <option value="UT">UT</option>
          </select>
        </div>

        <div>
          <label className="tc-label">Country</label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="USA"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="tc-label">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="tc-label">Confirm password</label>
          <input
            type="password"
            name="confirm"
            required
            value={form.confirm}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {error && <p className="tc-body-text-sm text-red-400">{error}</p>}
        {success && (
          <p className="tc-body-text-sm text-green-400">
            Account created! Redirecting…
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="tc-button-primary w-full"
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
