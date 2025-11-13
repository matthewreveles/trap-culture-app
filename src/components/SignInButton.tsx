"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()} className="p-2 bg-red-600 text-white rounded">
        Sign out
      </button>
    );
  }

  return (
    <button onClick={() => signIn("github")} className="p-2 bg-green-600 text-white rounded">
      Sign in with GitHub
    </button>
  );
}
