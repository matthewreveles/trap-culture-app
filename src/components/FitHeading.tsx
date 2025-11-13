"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Auto-sizes a two-line display headline to fit the container width.
 * Perfect for "TRAP" / "NEWS" so it visually aligns with your card width.
 */
export default function FitHeading({
  top = "TRAP",
  bottom = "NEWS",
  min = 48,
  max = 180,
  className = "",
  color = "#e8e3e3",
  fontFamily = "var(--font-racing), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
}: {
  top?: string;
  bottom?: string;
  min?: number;          // min font size (px)
  max?: number;          // max font size (px)
  className?: string;    // extra classes for the wrapper
  color?: string;        // heading color
  fontFamily?: string;   // display face
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);

  const [size, setSize] = useState(min);

  // Measure the widest line at a given size
  const measureWidth = (testSize: number) => {
    const t = topRef.current;
    const b = botRef.current;
    if (!t || !b) return 0;

    // temporarily apply size to measure
    t.style.fontSize = `${testSize}px`;
    b.style.fontSize = `${testSize}px`;

    // max of the two lines
    const w = Math.max(t.scrollWidth, b.scrollWidth);
    return w;
  };

  const fit = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const available = wrap.clientWidth; // target width = card/container width
    if (!available) return;

    // Binary search between min..max to fit width
    let lo = min;
    let hi = max;
    let best = min;

    for (let i = 0; i < 16; i++) {
      const mid = Math.floor((lo + hi) / 2);
      const w = measureWidth(mid);

      if (w <= available) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    setSize(best);
  };

  // Run on mount + on resize
  useLayoutEffect(() => {
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const common = {
    fontFamily,
    color,
    fontWeight: 900 as const,
    letterSpacing: "-0.01em",
    lineHeight: 0.95,
    textShadow: "0 3px 12px rgba(0,0,0,0.6)",
    textTransform: "uppercase" as const,
    display: "block",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div ref={wrapRef} className={className} aria-label={`${top} ${bottom}`}>
      <span ref={topRef} style={{ ...common, fontSize: `${size}px` }}>
        {top}
      </span>
      <span ref={botRef} style={{ ...common, fontSize: `${size}px` }}>
        {bottom}
      </span>
    </div>
  );
}
