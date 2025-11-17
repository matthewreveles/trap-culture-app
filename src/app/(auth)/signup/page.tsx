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

  const labelClasses = "block text-xs mb-1 text-white/60 tracking-wide uppercase";
  const inputClasses =
    "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/40";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

      // small pause then send them to signin
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err) {
      console.error("[SIGNUP_ERROR]", err);
      setError("Unexpected error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 pt-24 pb-32">
      <h1 className="text-4xl font-bebas tracking-[0.3em] text-center mb-8">
        TRAP FAM
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className={labelClasses}>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Trap Fam"
            className={inputClasses}
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses}>Email</label>
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

        {/* Phone */}
        <div>
          <label className={labelClasses}>Phone (optional)</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="602-555-0123"
            className={inputClasses}
          />
        </div>

        {/* Street address */}
        <div>
          <label className={labelClasses}>Street address (optional)</label>
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="123 Any St"
            className={inputClasses}
          />
        </div>

        {/* City + ZIP on one line */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClasses}>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Mesa"
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <label className={labelClasses}>ZIP</label>
            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="85201"
              className={inputClasses}
            />
          </div>
        </div>

        {/* State dropdown */}
        <div>
          <label className={labelClasses}>State</label>
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
            {/* add more later if you want */}
          </select>
        </div>

        {/* Country */}
        <div>
          <label className={labelClasses}>Country</label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="USA"
            className={inputClasses}
          />
        </div>

        {/* Password */}
        <div>
          <label className={labelClasses}>Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Confirm password */}
        <div>
          <label className={labelClasses}>Confirm password</label>
          <input
            type="password"
            name="confirm"
            required
            value={form.confirm}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && (
          <p className="text-green-400 text-sm">
            Account created! Redirecting…
          </p>
        )}

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
