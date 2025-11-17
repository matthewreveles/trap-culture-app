"use client";

import * as React from "react";

type Props = {
  /** Optional override; otherwise reads NEXT_PUBLIC_EVENTBRITE_URL */
  src?: string;
  /** Height in px on mobile; grows on larger screens */
  height?: number;
  /** Make the iframe appear darker (nice on black UIs) */
  darken?: boolean;
  /** Extra classes on the outer wrapper */
  className?: string;
};

/**
 * Public organizer page embed with “darkening” and a soft top fade.
 * NOTE: We cannot style the remote page; this only adds visual overlays.
 */
export default function EventbriteEmbed({
  src,
  height = 980,
  darken = true,
  className = "",
}: Props) {
  const baseUrl =
    src ||
    process.env.NEXT_PUBLIC_EVENTBRITE_URL ||
    "https://www.eventbrite.com/";

  const withTracking = baseUrl.includes("?")
    ? `${baseUrl}&aff=trapculture_site`
    : `${baseUrl}?aff=trapculture_site`;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl tc-glow-card",
        "ring-1 ring-white/10 bg-black/40",
        className,
      ].join(" ")}
    >
      {/* Responsive height: small screens = height, larger screens add a bit */}
      <div
        className="relative w-full"
        style={{
          height,
        }}
      >
        <iframe
          title="Trap Culture Events (Eventbrite)"
          src={withTracking}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full bg-black"
          // We can't control their theme—this just makes the frame behave nicely
        />

        {/* Top fade: soft gradient to blend EB header with our dark UI */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))",
          }}
        />

        {/* Optional “dark scrim” over everything to harmonize with our dark site */}
        {darken && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "rgba(0,0,0,0.25)" }}
          />
        )}
      </div>

      {/* Fallback link (accessibility + iframes blocked) */}
      <div className="bg-black/40 border-t border-white/10 p-3 text-center text-sm text-white/60">
        If the embed doesn’t load,{" "}
        <a
          className="underline hover:text-white"
          href={withTracking}
          target="_blank"
          rel="noopener noreferrer"
        >
          view our events on Eventbrite
        </a>
        .
      </div>
    </div>
  );
}
