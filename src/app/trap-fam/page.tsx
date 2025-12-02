// src/app/trap-fam/page.tsx

import TrapFamForm from "@/components/TrapFamForm";

export const metadata = {
  title: "Trap Fam • Trap Culture",
  description:
    "Join the Trap Fam list for invites, drops, and underground updates.",
};

export default function TrapFamPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-28 text-foreground space-y-8">
      <header className="space-y-3 text-left">
        <h1 className="trapfam-heading tc-section-title text-[42px] md:text-[52px] leading-none font-extrabold tracking-[0.16em] uppercase">
          Trap Fam
        </h1>

        <p className="tc-body-text max-w-xl">
          The inner circle for Trap Culture heads. Get first crack at pool
          parties, warehouse sessions, collabs, and limited drops before they
          hit the main feed.
        </p>
      </header>

      <TrapFamForm />
    </main>
  );
}
