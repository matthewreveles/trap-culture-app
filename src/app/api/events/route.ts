// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import { getEventbriteEvents } from "@/lib/eventbrite";

export async function GET() {
  try {
    // Debug: Log environment variables to help diagnose issues
    console.log("EVENTBRITE_PRIVATE_TOKEN:", process.env.EVENTBRITE_PRIVATE_TOKEN);
    console.log("EVENTBRITE_ORG_ID:", process.env.EVENTBRITE_ORG_ID);

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