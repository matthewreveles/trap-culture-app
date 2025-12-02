// src/app/events/page.tsx
import Link from "next/link";
import type { Route } from "next";

const UPCOMING_EVENTS_ROUTE = "/events/upcoming" as Route;
const PAST_EVENTS_ROUTE = "/events/past" as Route;

export default function EventsIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 pt-24 pb-28 text-foreground">
      <header className="mb-8 space-y-3">
        <p className="font-bebas text-xs tracking-[0.35em] uppercase tc-body-text-sm">
          Trap Culture Archive
        </p>

        <h1 className="tc-section-title font-bebas text-[40px] md:text-[52px] leading-none tracking-[0.22em] uppercase">
          Events
        </h1>

        <p className="tc-body-text max-w-xl">
          Choose which part of Trap Culture you’d like to explore.
        </p>
      </header>

      <div className="space-y-4">
        <Link
          href={UPCOMING_EVENTS_ROUTE}
          className="tc-card block px-6 py-4 text-sm font-medium uppercase tracking-[0.18em]"
        >
          Upcoming Events
        </Link>

        <Link
          href={PAST_EVENTS_ROUTE}
          className="tc-card block px-6 py-4 text-sm font-medium uppercase tracking-[0.18em]"
        >
          Past Events
        </Link>
      </div>
    </main>
  );
}
