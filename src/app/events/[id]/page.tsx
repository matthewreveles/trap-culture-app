// src/app/events/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type EventItem = {
  id: string;
  title: string;
  date?: string;
  location?: string;
  image?: string;
  url?: string;
};

function isReservedSlug(v: string) {
  return v === "past" || v === "upcoming";
}

async function getBaseUrl(): Promise<string | null> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (!host) return null;
  return `${proto}://${host}`;
}

async function fetchEventById(id: string): Promise<EventItem | null> {
  try {
    const baseUrl = await getBaseUrl();
    if (!baseUrl) return null;

    // Assumes your existing /api/events can return a single event by id.
    const res = await fetch(`${baseUrl}/api/events?id=${encodeURIComponent(id)}`, {
      // cache policy is fine either way; keep it safe for freshness
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = (await res.json()) as any;
    const event = (json?.event ?? json) as EventItem | undefined;

    if (!event || !event.id) return null;
    return event;
  } catch {
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  if (!id || isReservedSlug(id)) notFound();

  const event = await fetchEventById(id);
  if (!event) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 text-white">
      <div className="mb-6">
        <Link
          href="/events"
          className="text-sm text-white/60 hover:text-white"
        >
          ← Back to Events
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">
        {event.title}
      </h1>

      {(event.date || event.location) && (
        <p className="mb-8 text-white/60">
          {event.date ? event.date : null}
          {event.date && event.location ? " • " : null}
          {event.location ? event.location : null}
        </p>
      )}

      {event.image && (
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={event.image}
            alt={event.title}
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )}

      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          View official event page →
        </a>
      )}
    </main>
  );
}
