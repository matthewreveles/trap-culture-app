"use client";

import Link from "next/link";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  rel?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export default function Button({ children, href, onClick, className = "", rel, target }: Props) {
  const base =
    "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border border-white/10 hover:bg-white/5 " +
    className;

  if (href && /^https?:\/\//i.test(href)) {
    return (
      <a href={href} className={base} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
}
