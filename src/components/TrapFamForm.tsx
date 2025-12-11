"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "submitting" | "success" | "error";

type TrapFamFormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  smsOptIn: boolean;
};

export default function TrapFamForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<TrapFamFormState>({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    smsOptIn: false,
  });

  function update<K extends keyof TrapFamFormState>(key: K, value: TrapFamFormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/trap-fam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        console.error("[TrapFam] error response:", data);
        setStatus("error");
        setMessage(
          data?.error ||
            "Something went wrong joining Trap Fam. Try again in a moment."
        );
        return;
      }

      setStatus("success");
      setMessage(
        "You’re in. Check your inbox for a welcome email from Trap Culture."
      );
    } catch (err) {
      console.error("[TrapFam] network error:", err);
      setStatus("error");
      setMessage("Network error. Double-check your connection and try again.");
    }
  }

  const disabled = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="trapfam-card mx-auto w-full max-w-xl px-6 py-7 space-y-5 text-sm md:text-base"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.18em] mb-1 text-white/70 light:text-[#14081b]">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => update("name", e.target.value)}
            className="w-full rounded-lg border border-white/15 light:border-black/10 bg-black/40 light:bg-white px-3 py-2.5 text-sm text-white light:text-[#14081b] placeholder:text-white/35 light:placeholder:text-purple-900/35 outline-none focus:ring-2 focus:ring-suns-orange/70"
            placeholder="First + last (optional but nice)"
            autoComplete="name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.18em] mb-1 text-white/70 light:text-[#14081b]">
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => update("email", e.target.value)}
            className="w-full rounded-lg border border-white/15 light:border-black/10 bg-black/40 light:bg-white px-3 py-2.5 text-sm text-white light:text-[#14081b] placeholder:text-white/35 light:placeholder:text-purple-900/35 outline-none focus:ring-2 focus:ring-suns-orange/70"
            placeholder="you@trapmail.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.18em] mb-1 text-white/70 light:text-[#14081b]">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => update("phone", e.target.value)}
            className="w-full rounded-lg border border-white/15 light:border-black/10 bg-black/40 light:bg-white px-3 py-2.5 text-sm text-white light:text-[#14081b] placeholder:text-white/35 light:placeholder:text-purple-900/35 outline-none focus:ring-2 focus:ring-suns-orange/70"
            placeholder="For SMS drops + secret shows"
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.18em] mb-1 text-white/70 light:text-[#14081b]">
            City
          </label>
          <input
            type="text"
            value={form.city}
            onChange={e => update("city", e.target.value)}
            className="w-full rounded-lg border border-white/15 light:border-black/10 bg-black/40 light:bg-white px-3 py-2.5 text-sm text-white light:text-[#14081b] placeholder:text-white/35 light:placeholder:text-purple-900/35 outline-none focus:ring-2 focus:ring-suns-orange/70"
            placeholder="Mesa, Phoenix, Tempe…"
            autoComplete="address-level2"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.18em] mb-1 text-white/70 light:text-[#14081b]">
            State
          </label>
          <input
            type="text"
            value={form.state}
            onChange={e => update("state", e.target.value)}
            className="w-full rounded-lg border border-white/15 light:border-black/10 bg-black/40 light:bg-white px-3 py-2.5 text-sm text-white light:text-[#14081b] placeholder:text-white/35 light:placeholder:text-purple-900/35 outline-none focus:ring-2 focus:ring-suns-orange/70"
            placeholder="AZ"
            autoComplete="address-level1"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.18em] mb-1 text-white/70 light:text-[#14081b]">
            ZIP
          </label>
          <input
            type="text"
            value={form.zip}
            onChange={e => update("zip", e.target.value)}
            className="w-full rounded-lg border border-white/15 light:border-black/10 bg-black/40 light:bg-white px-3 py-2.5 text-sm text-white light:text-[#14081b] placeholder:text-white/35 light:placeholder:text-purple-900/35 outline-none focus:ring-2 focus:ring-suns-orange/70"
            placeholder="85201"
            autoComplete="postal-code"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.18em] mb-1 text-white/70 light:text-[#14081b]">
            Country
          </label>
          <input
            type="text"
            value={form.country}
            onChange={e => update("country", e.target.value)}
            className="w-full rounded-lg border border-white/15 light:border-black/10 bg-black/40 light:bg-white px-3 py-2.5 text-sm text-white light:text-[#14081b] placeholder:text-white/35 light:placeholder:text-purple-900/35 outline-none focus:ring-2 focus:ring-suns-orange/70"
            placeholder="USA"
            autoComplete="country-name"
          />
        </div>
      </div>

      {/* SMS opt-in checkbox */}
      <label className="flex items-start gap-2 text-xs leading-relaxed text-white/70 light:text-[#14081b]/80">
        <input
          type="checkbox"
          checked={form.smsOptIn}
          onChange={e => update("smsOptIn", e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border border-white/40 bg-transparent"
        />
        <span>
          I agree to receive marketing SMS messages from Trap Culture at the
          phone number provided. Message and data rates may apply. Reply{" "}
          <span className="font-semibold">STOP</span> to opt out,{" "}
          <span className="font-semibold">HELP</span> for help. Consent is not
          required to join Trap Fam.
        </span>
      </label>

      <p className="text-xs leading-relaxed text-white/55 light:text-[#14081b]/75">
        By joining Trap Fam you agree to occasional emails about events, drops,
        and weird art projects. Every email includes an unsubscribe link that
        lets you bail in one click. SMS preferences can be changed at any time
        by replying STOP.
      </p>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm uppercase tracking-[0.2em] bg-suns-orange text-black shadow-[0_0_22px_rgba(255,122,42,0.8)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Joining…" : "Join Trap Fam"}
      </button>

      <p className="text-[11px] leading-relaxed text-white/55 light:text-[#14081b]/70">
        By continuing, you agree to our{" "}
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

      {status === "success" && message && (
        <p className="text-xs mt-2 text-emerald-400">{message}</p>
      )}

      {status === "error" && message && (
        <p className="text-xs mt-2 text-red-400">{message}</p>
      )}
    </form>
  );
}
