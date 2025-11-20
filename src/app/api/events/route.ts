// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import { getEventbriteEvents } from "@/lib/eventbrite";

export async function GET() {
  try {
    const data = await getEventbriteEvents();
    return NextResponse.json({ events: data.events || [] });
  } catch (err) {
    console.error("Eventbrite API Error:", err);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 }
    );
  }
}
