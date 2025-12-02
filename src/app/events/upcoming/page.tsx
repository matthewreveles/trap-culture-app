import Image from "next/image";

async function fetchEvents() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/events`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.events || [];
}

export default async function UpcomingEventsPage() {
  const events = await fetchEvents();

  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-28 text-foreground">
      <header className="mb-10 space-y-3">
        <p className="font-bebas text-xs tracking-[0.35em] uppercase tc-body-text-sm">
          Trap Culture Events
        </p>

        <h1 className="tc-section-title font-bebas text-[40px] md:text-[52px] leading-none tracking-[0.22em] uppercase">
          Upcoming Events
        </h1>
      </header>

      {events.length === 0 && (
        <p className="tc-body-text text-center pt-12">
          No upcoming events right now. Check back soon for the next session,
          show, or pop-up.
        </p>
      )}

      {events.length > 0 && (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <a
              key={event.id}
              href={`/events/${event.id}`}
              className="tc-card block overflow-hidden transition hover:border-suns-orange/80"
            >
              {event.logo?.url && (
                <Image
                  src={event.logo.url}
                  alt={event.name.text}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-5">
                <h2 className="mb-2 text-lg font-semibold leading-snug">
                  {event.name.text}
                </h2>

                <p className="tc-body-text-sm mb-2">
                  {new Date(event.start.local).toLocaleString()}
                </p>

                <p className="tc-body-text-sm line-clamp-3">
                  {event.summary}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
