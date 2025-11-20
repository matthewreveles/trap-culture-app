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
    <main className="max-w-5xl mx-auto px-6 py-16 text-white">
      <h1 className="text-5xl font-extrabold mb-10 tc-gradient-text">
        Upcoming Events
      </h1>

      {events.length === 0 && (
        <p className="text-center text-white/70 py-16">
          No upcoming events right now. Check back soon for the next session,
          show, or pop-up.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {events.map((event: any) => (
          <a
            key={event.id}
            href={`/events/${event.id}`}
            className="block bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden shadow-lg hover:border-fuchsia-600 transition"
          >
            {event.logo?.url && (
              <Image
                src={event.logo.url}
                alt={event.name.text}
                width={600}
                height={400}
                className="object-cover w-full h-48"
              />
            )}

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">
                {event.name.text}
              </h2>

              <p className="text-sm text-white/50 mb-2">
                {new Date(event.start.local).toLocaleString()}
              </p>

              <p className="text-white/70 text-sm line-clamp-3">
                {event.summary}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
