// src/app/events/event/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

type EventItem = {
  id?: string | number;
  title?: string;
  name?: string;
  date?: string;
  startsAt?: string;
  venue?: string;
  location?: string;
  image?: string;
  url?: string;
};

function isReservedSlug(v: string) {
  return v === "past" || v === "upcoming" || v === "event";
}

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (!host) return null;
  return `${proto}://${host}`;
}

async function fetchEventById(id: string): Promise<EventItem | null> {
  const baseUrl = await getBaseUrl();
  if (!baseUrl) return null;

  // If your /api/events supports a detail query, this will work.
  // If it doesn't, the page still renders (and your Past Events grid is unaffected).
  const url = `${baseUrl}/api/events?id=${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();

    if (json?.event) return json.event as EventItem;
    if (json?.data && !Array.isArray(json.data)) return json.data as EventItem;

    if (Array.isArray(json?.events)) {
      const match = (json.events as EventItem[]).find((e) => String(e.id) === id);
      return match ?? null;
    }

    if (Array.isArray(json?.data)) {
      const match = (json.data as EventItem[]).find((e) => String(e.id) === id);
      return match ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params?.id?.trim();

  if (!id) notFound();
  if (isReservedSlug(id)) notFound();

  const event = await fetchEventById(id);

  const title = event?.title ?? event?.name ?? `Trap Culture Event ${id}`;
  const when = event?.date ?? event?.startsAt ?? "";
  const where = event?.venue ?? event?.location ?? "";
  const href = event?.url ?? "";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-white">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/events"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Back to Events
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/events/upcoming"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Upcoming
          </Link>
          <Link
            href="/events/past"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Past
          </Link>
        </div>
      </div>

      <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
        Trap Culture Event
      </p>

      <h1 className="mb-4 text-3xl font-extrabold sm:text-5xl">{title}</h1>

      {(when || where) && (
        <p className="mb-8 max-w-3xl text-white/70">
          {when ? <span>{when}</span> : null}
          {when && where ? <span> • </span> : null}
          {where ? <span>{where}</span> : null}
        </p>
      )}

      {!event ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          <p className="mb-3">
            This event detail route is live, but your API didn’t return a matching
            payload for:
          </p>
          <p className="font-mono text-white/90">{id}</p>
          <p className="mt-4 text-sm text-white/60">
            Your Past Events photo grid will still work now, since{" "}
            <span className="font-mono">/events/past</span> is no longer getting
            swallowed by the dynamic route.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-3 text-white/80">
            {when ? (
              <div>
                <span className="text-white/50">When: </span>
                <span>{when}</span>
              </div>
            ) : null}

            {where ? (
              <div>
                <span className="text-white/50">Where: </span>
                <span>{where}</span>
              </div>
            ) : null}

            {href ? (
              <div>
                <span className="text-white/50">Link: </span>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
                >
                  Open event page
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
