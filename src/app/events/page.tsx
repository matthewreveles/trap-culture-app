import Link from "next/link";

export default function EventsIndexPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-white">

      <h1 className="text-5xl font-extrabold mb-8 tc-gradient-text">
        Events
      </h1>

      <p className="text-white/70 mb-10">
        Choose which part of Trap Culture you’d like to explore.
      </p>

      <div className="space-y-4">
        <Link
          href="/events/upcoming"
          className="block bg-[#0a0a0a] border border-[#333] px-6 py-4 rounded-lg hover:border-fuchsia-500 transition"
        >
          Upcoming Events
        </Link>

        <Link
          href="/events/past"
          className="block bg-[#0a0a0a] border border-[#333] px-6 py-4 rounded-lg hover:border-amber-400 transition"
        >
          Past Events
        </Link>
      </div>
    </main>
  );
}
