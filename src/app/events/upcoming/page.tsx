// src/app/events/upcoming/page.tsx

import * as cheerio from "cheerio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOURCE_URL = "https://trapcultureaz.com/upcoming-events/";

const EVENTS_CSS = `
.tc-events-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 0 40px;
}

/* GRID */
.tc-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

/* EVENT CARD */
.tc-event-card {
  position: relative;
  background: radial-gradient(circle at top left, rgba(255, 0, 160, 0.15), transparent 55%),
              radial-gradient(circle at bottom right, rgba(17, 246, 243, 0.18), transparent 55%),
              #050509;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #ffffff;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.tc-event-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(130deg, #ff00a0, #11f6f3);
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
}

.tc-event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 55px rgba(0, 0, 0, 0.9);
  border-color: transparent;
}

.tc-event-card:hover::before {
  opacity: 1;
}

.tc-event-image-wrap {
  position: relative;
  overflow: hidden;
}

.tc-event-image-wrap img {
  display: block;
  width: 100%;
  height: 190px;
  object-fit: cover;
  transform: scale(1.02);
  transition: transform 0.35s ease;
}

.tc-event-card:hover .tc-event-image-wrap img {
  transform: scale(1.07);
}

.tc-event-body {
  position: relative;
  z-index: 1;
  padding: 18px 18px 20px;
}

.tc-event-title {
  font-family: "Bebas Neue", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.35rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 6px;
  color: #ffffff;
}

.tc-event-date {
  font-size: 0.9rem;
  font-weight: 500;
  color: #11f6f3;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  margin: 0 0 10px;
}

.tc-event-summary {
  font-size: 0.92rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 16px;
  min-height: 48px;
}

.tc-event-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 18px;
  border-radius: 999px;
  background: linear-gradient(120deg, #ff00a0, #11f6f3);
  color: #000000;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  text-decoration: none;
  box-shadow: 0 0 18px rgba(255, 0, 160, 0.5);
  transition: filter 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  white-space: nowrap;
}

.tc-event-button:hover {
  filter: brightness(1.08);
  box-shadow: 0 0 26px rgba(17, 246, 243, 0.75);
  transform: translateY(-1px);
  color: #000000;
}

/* EMPTY STATE */
.tc-events-empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
}

.tc-events-empty-card {
  position: relative;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 26px 24px 26px;
  border-radius: 20px;
  background:
    radial-gradient(circle at top left, rgba(255, 0, 160, 0.2), transparent 55%),
    radial-gradient(circle at bottom right, rgba(17, 246, 243, 0.2), transparent 55%),
    #050509;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.9);
  text-align: center;
  overflow: hidden;
}

.tc-events-empty-card::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: conic-gradient(from 210deg, #ff00a0, #11f6f3, #ff00a0);
  opacity: 0.15;
  mix-blend-mode: screen;
  pointer-events: none;
}

.tc-events-eyebrow {
  position: relative;
  z-index: 1;
  font-family: "Bebas Neue", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #11f6f3;
  margin: 0 0 8px;
}

.tc-events-empty-title {
  position: relative;
  z-index: 1;
  font-family: "Bebas Neue", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0 0 8px;
}

.tc-events-empty-text {
  position: relative;
  z-index: 1;
  font-size: 0.98rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.86);
  margin: 0 0 18px;
}

.tc-events-empty-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.tc-events-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

.tc-events-pill-outline {
  border: 1px solid #11f6f3;
  color: #11f6f3;
  background: transparent;
}

.tc-events-pill-outline:hover {
  background: rgba(17, 246, 243, 0.12);
  box-shadow: 0 0 18px rgba(17, 246, 243, 0.6);
  transform: translateY(-1px);
  color: #11f6f3;
}

.tc-events-pill-solid {
  background: linear-gradient(120deg, #ff00a0, #11f6f3);
  color: #000000;
  box-shadow: 0 0 18px rgba(255, 0, 160, 0.7);
  border: none;
}

.tc-events-pill-solid:hover {
  filter: brightness(1.06);
  box-shadow: 0 0 26px rgba(17, 246, 243, 0.8);
  transform: translateY(-1px);
  color: #000000;
}

.tc-events-error {
  text-align: center;
  color: #ff5c9d;
  font-size: 0.95rem;
}

@media (max-width: 767px) {
  .tc-events-wrapper {
    padding: 18px 0 30px;
  }
  .tc-events-empty-card {
    padding: 22px 18px 22px;
  }
  .tc-event-body {
    padding: 14px 14px 16px;
  }
  .tc-event-title {
    font-size: 1.2rem;
  }
  .tc-event-image-wrap img {
    height: 170px;
  }
}
`;

async function fetchEventsBlock(): Promise<string> {
  const res = await fetch(SOURCE_URL, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html",
    },
  });

  if (!res.ok) return "";

  const html = await res.text();
  const $ = cheerio.load(html);

  const wrapper = $(".tc-events-wrapper").first();
  if (!wrapper.length) return "";

  // Keep relative links working when rendered inside the app
  wrapper.find('a[href^="/"]').each((_i, el) => {
    const href = $(el).attr("href");
    if (href) $(el).attr("href", `https://trapcultureaz.com${href}`);
  });

  // Patch images if any exist
  wrapper.find('img[src^="/"]').each((_i, el) => {
    const src = $(el).attr("src");
    if (src) $(el).attr("src", `https://trapcultureaz.com${src}`);
  });

  return $.html(wrapper);
}

export default async function UpcomingEventsPage() {
  let blockHtml = "";

  try {
    blockHtml = await fetchEventsBlock();
  } catch {
    blockHtml = "";
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Font to match site */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
        rel="stylesheet"
      />

      <style dangerouslySetInnerHTML={{ __html: EVENTS_CSS }} />

      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Upcoming Events</h1>

        {blockHtml ? (
          <div className="mt-6" dangerouslySetInnerHTML={{ __html: blockHtml }} />
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/80">No upcoming events are showing right now.</p>
            <p className="mt-2 text-sm text-white/60">
              If this looks wrong, the site may be unavailable.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
