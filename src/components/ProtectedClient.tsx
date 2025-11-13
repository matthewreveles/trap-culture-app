"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function ProtectedClient({ children }: { children: React.ReactNode }) {
  const { status } = useSession(); // "loading" | "authenticated" | "unauthenticated"

  useEffect(() => {
    if (status === "unauthenticated") signIn(undefined, { callbackUrl: "/dashboard" });
  }, [status]);

  if (status === "loading") return <p className="p-8 text-white">Checking session…</p>;
  return <>{children}</>;
}
