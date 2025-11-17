"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Auto-sizes a single-line text to fill the container width. */
export default function FitText({
  children,
  min = 14,
  max = 36,
  className = "",
  style,
}: {
  children: React.ReactNode;
  min?: number;
  max?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(min);

  const measure = (s: number) => {
    const el = spanRef.current;
    if (!el) return 0;
    el.style.fontSize = `${s}px`;
    return el.scrollWidth;
  };

  const fit = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const target = wrap.clientWidth || 0;
    if (!target) return;

    let lo = min, hi = max, best = min;
    for (let i = 0; i < 16; i++) {
      const mid = Math.floor((lo + hi) / 2);
      const w = measure(mid);
      if (w <= target) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    setSize(best);
  };

  useLayoutEffect(() => { fit(); /* run once */ }, []);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className} style={style}>
      <span ref={spanRef} style={{ display: "inline-block", whiteSpace: "nowrap", fontSize: size }}>
        {children}
      </span>
    </div>
  );
}
