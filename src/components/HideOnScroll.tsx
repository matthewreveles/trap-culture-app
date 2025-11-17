"use client";
import { useEffect, useRef, useState } from "react";

export default function HideOnScroll({
  children, threshold = 60, inset = 0, className = "",
}: {
  children: React.ReactNode;
  threshold?: number;
  inset?: number;
  className?: string;
}) {
  const last = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const dy = y - last.current;
      last.current = y;

      const nearBottom = window.innerHeight + window.scrollY >= (document.body.offsetHeight - inset);
      if (nearBottom) return setHidden(false);
      if (Math.abs(dy) < 2) return;
      if (y < threshold) return setHidden(false);
      setHidden(dy > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, inset]);

  return (
    <div className={`${className} transition-transform duration-300 will-change-transform ${hidden ? "translate-y-full" : "translate-y-0"}`}>
      {children}
    </div>
  );
}
