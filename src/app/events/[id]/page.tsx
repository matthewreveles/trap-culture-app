// src/app/events/[id]/page.tsx
import Image from "next/image";
import { getEventbriteEventById } from "@/lib/eventbrite";
import Link from "next/link";

export const revalidate = 600;

export async function generateMetadata({ params }: any) {
  const { id } = params;
  const event = await getEventbriteEventById(id);

  return {
    title: `${event.name.text} • Trap Culture`,
    description: event.summary || "Trap Culture Event",
  };
}

export default async function EventDetailPage({ params }: any) {
  const { id } = params;
  const event = await getEventbriteEventById(id);

  const start = new Date(event.start.local).toLocaleString("en-US");
  const end = new Date(event.end.local).toLocaleString("en-US");

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/events"
          className="text-white/70 hover:text-white underline"
        >
          ← Back to Events
        </Link>
      </div>

      {/* Hero Section */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-[#222] mb-8">
        {event.logo?.url && (
          <Image
            src={event.logo.url}
            alt={event.name.text}
            width={1600}
            height={900}
            className="object-cover w-full max-h-[420px]"
          />
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">{event.name.text}</h1>

      {/* Date / Time */}
      <div className="text-white/70 mb-6">
        <p><strong>Starts:</strong> {start}</p>
        <p><strong>Ends:</strong> {end}</p>
      </div>

      {/* Tickets Button */}
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-fuchsia-600 hover:bg-fuchsia-700 transition px-6 py-3 rounded-lg font-semibold mb-10"
      >
        Get Tickets
      </a>

      {/* Event Description */}
      <section className="prose prose-invert max-w-none mb-10">
        <h2 className="text-2xl font-bold">About this event</h2>
        <p className="text-white/80 mt-4 leading-relaxed">
          {event.summary || "No additional details provided."}
        </p>
      </section>

      {/* Venue */}
      {event.venue && (
        <section className="text-white/80 mt-6">
          <h2 className="text-2xl font-bold mb-2">Location</h2>
          <p>{event.venue.name}</p>
          <p>{event.venue.address.localized_address_display}</p>
        </section>
      )}
    </div>
  );
}
