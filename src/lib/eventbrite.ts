// src/lib/eventbrite.ts

export async function getEventbriteEvents() {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  // Debug: Log environment variables
  console.log("EVENTBRITE_PRIVATE_TOKEN:", token);
  console.log("EVENTBRITE_ORG_ID:", orgId);

  if (!token || !orgId) {
    console.error("Missing Eventbrite environment variables", { token, orgId });
    throw new Error("Missing Eventbrite environment variables");
  }

  const url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?status=live&order_by=start_asc&expand=venue,logo`;

  // Debug: Log constructed URL
  console.log("Fetching Eventbrite events from URL:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Eventbrite API error:", errorText);
    throw new Error("Failed to fetch Eventbrite events");
  }

  return res.json();
}

export async function getEventbriteEventById(id: string) {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN;

  // Debug: Log environment variable
  console.log("EVENTBRITE_PRIVATE_TOKEN:", token);

  if (!token) {
    console.error("Missing Eventbrite token");
    throw new Error("Missing Eventbrite token");
  }

  const url = `https://www.eventbriteapi.com/v3/events/${id}/?expand=venue,logo,organizer`;

  // Debug: Log constructed URL
  console.log("Fetching Eventbrite event by ID from URL:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Eventbrite API error:", errorText);
    throw new Error("Failed to fetch Eventbrite event");
  }

  return res.json();
}