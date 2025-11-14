"use client";

import { useSession } from "next-auth/react";

export default function ProtectedClient({ children }) {
  const { status } = useSession();

  if (status === "loading") return null;
  if (status === "unauthenticated") return null;

  return <>{children}</>;
}
