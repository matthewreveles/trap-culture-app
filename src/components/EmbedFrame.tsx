"use client";

import { useEffect, useState } from "react";

export default function EmbedFrame({ src, title, height = 1200 }: { src: string; title: string; height?: number; }) {
  const [vh, setVh] = useState(height);
  useEffect(() => {
    const set = () => setVh(Math.max(window.innerHeight * 0.8, height));
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [height]);

  return (
    <div className="mx-auto w-full max-w-5xl rounded-2xl overflow-hidden ring-1 ring-white/10 tc-glow-card">
      <iframe
        src={src}
        title={title}
        style={{ width: "100%", height: vh }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
