"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function UnsubscribeContent() {
  const sp = useSearchParams();
  const email = sp.get("e") || "";
  const token = sp.get("t") || "";
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (!email || !token) return;
    setStatus("working");

    fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));

        if (!r.ok) throw new Error(j.error || "Unsubscribe failed");

        setMsg(
          "You’ve been unsubscribed. You won’t receive further emails."
        );
        setStatus("done");
      })
      .catch((e) => {
        setMsg(e.message || "Unsubscribe failed.");
        setStatus("error");
      });
  }, [email, token]);

  return (
    <main className="mx-auto max-w-md px-6 pt-28 pb-24 text-center">
      <h1 className="text-2xl font-bold mb-4">Unsubscribe</h1>
      {status === "idle" && <p className="text-white/70">Preparing…</p>}
      {status === "working" && <p className="text-white/80">Updating preferences…</p>}
      {(status === "done" || status === "error") && (
        <p className={status === "done" ? "text-green-400" : "text-red-400"}>
          {msg}
        </p>
      )}
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center">Loading…</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
