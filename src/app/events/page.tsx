// src/app/events/page.tsx

export const revalidate = 600; // Cache for 10 minutes (safe for public embeds)
export const dynamic = "force-static"; // Pre-render for faster load

import EventbriteEmbed from "@/components/EventbriteEmbed";

export const metadata = {
  title: "Events • Trap Culture",
  description:
    "See upcoming Trap Culture events, parties, and pop-ups — powered by Eventbrite.",
};

export default function EventsPage() {
  // Use the env var if present, fallback to the verified Trap Culture organizer page
  const url =
    process.env.NEXT_PUBLIC_EVENTBRITE_URL ||
    "https://www.eventbrite.com/o/trap-culture-42074251453";

  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-28 space-y-10">
      {/* Header */}
      <header className="space-y-3 text-center sm:text-left">
        <h1 className="text-[42px] sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="tc-gradient-text">Trap Culture Events</span>
        </h1>

        <p className="text-white/75 text-lg max-w-2xl mx-auto sm:mx-0">
          Join us for the next Trap Culture event — from smoke sessions to
          pop-up shows, art, and more. RSVP or get tickets directly through
          Eventbrite.
        </p>

        {/* Decorative gradient line */}
        <div className="h-[2px] w-24 bg-gradient-to-r from-fuchsia-500 via-purple-400 to-amber-300 rounded-full opacity-80 mx-auto sm:mx-0" />
      </header>

      {/* Eventbrite Embed */}
      <section className="mt-6">
        <EventbriteEmbed src={url} height={1100} darken />
      </section>

      {/* Secondary footer CTA */}
      <footer className="text-center text-white/50 text-sm pt-6">
        Trouble viewing?{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Open our Eventbrite page directly
        </a>
        .
      </footer>
    </main>
  );
}
