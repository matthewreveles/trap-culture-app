"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
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
  smsOptIn: boolean;
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
    smsOptIn: false,
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
          smsOptIn: form.smsOptIn, // safe even if backend ignores it
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
          <label className="tc-label">Phone</label>
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
          <label className="tc-label">Street address</label>
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

        {/* SMS opt-in + legal copy */}
        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-2 text-xs text-white/70 light:text-[#14081b]/80">
            <input
              type="checkbox"
              checked={form.smsOptIn}
              onChange={e =>
                setForm(prev => ({ ...prev, smsOptIn: e.target.checked }))
              }
              className="mt-0.5 h-4 w-4 rounded border border-white/40 bg-transparent"
            />
            <span className="leading-relaxed">
              I agree to receive marketing SMS messages from Trap Culture at the
              phone number provided. Message and data rates may apply. Reply{" "}
              <span className="font-semibold">STOP</span> to opt out,{" "}
              <span className="font-semibold">HELP</span> for help. Consent is
              not required to create an account.
            </span>
          </label>

          <p className="text-[11px] leading-relaxed text-white/55 light:text-[#14081b]/70">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:opacity-80"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:opacity-80"
            >
              Privacy Policy
            </Link>
            .
          </p>
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
