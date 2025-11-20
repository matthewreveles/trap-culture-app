// src/lib/eventbrite.ts

export async function getEventbriteEvents() {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  if (!token || !orgId) {
    throw new Error("Missing Eventbrite environment variables");
  }

  const url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?status=live&order_by=start_asc&expand=venue,logo`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch Eventbrite events");
  }

  return res.json();
}

export async function getEventbriteEventById(id: string) {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN;

  if (!token) {
    throw new Error("Missing Eventbrite token");
  }

  const url = `https://www.eventbriteapi.com/v3/events/${id}/?expand=venue,logo,organizer`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch Eventbrite event");
  }

  return res.json();
}
