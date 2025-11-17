"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="px-4 py-2 text-sm bg-white text-black rounded"
      >
        Sign In
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 text-sm bg-red-600 text-white rounded"
    >
      Sign Out
    </button>
  );
}
