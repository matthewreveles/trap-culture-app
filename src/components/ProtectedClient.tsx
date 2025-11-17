// src/components/ProtectedClient.tsx
"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";

export default function ProtectedClient({ children }: { children: ReactNode }) {
  const { status } = useSession();

  if (status === "loading") return null;

  if (status !== "authenticated") return null;

  return <>{children}</>;
}
