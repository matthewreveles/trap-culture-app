// src/components/EmbedFrame.tsx

import React from "react";

type EmbedFrameProps = {
  title: string;
  src: string;
  height?: number;
  className?: string;
};

/**
 * Generic iframe wrapper for things like Shopify, Substack, etc.
 * Handles sizing, dark background, rounded corners and safe sandbox attrs.
 */
export default function EmbedFrame({
  title,
  src,
  height = 1600,
  className = "",
}: EmbedFrameProps) {
  return (
    <section
      className={`w-full rounded-3xl border border-white/10 bg-black/40 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-sm ${className}`}
    >
      <div className="overflow-hidden rounded-3xl">
        <iframe
          title={title}
          src={src}
          style={{ width: "100%", height }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          className="border-0"
        />
      </div>
    </section>
  );
}
