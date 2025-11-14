"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  // Use the actual href type from next/link
  href?: Parameters<typeof Link>[0]["href"];
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const {
    children,
    href,
    variant = "primary",
    className = "",
    ...buttonProps
  } = props;

  const base = [
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
    variant === "primary" &&
      "bg-white text-black hover:bg-neutral-200 dark:bg-white dark:text-black",
    variant === "secondary" &&
      "border border-neutral-500 text-neutral-100 hover:bg-neutral-900",
    variant === "ghost" &&
      "text-neutral-100 hover:bg-neutral-900/60",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    // Link-style button
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  // Regular button
  return (
    <button type={buttonProps.type ?? "button"} className={base} {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;
