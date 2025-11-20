// src/components/MobileMenu.tsx
"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { Route } from "next";

type Props = { isOpen: boolean; onOpenChange: (next: boolean) => void };
type NavItem = { href: Route; label: string };

const mainItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/trap-news", label: "Trap News" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export default function MobileMenu({ isOpen, onOpenChange }: Props) {
  const pathname = usePathname();
  const { status } = useSession();
  const [eventsOpen, setEventsOpen] = useState(false); // submenu open by default

  // Close menu on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onOpenChange]);

  const isEventsSectionActive = pathname.startsWith("/events");

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        role="presentation"
        aria-hidden={!isOpen}
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 z-[85] bg-black/40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in Panel */}
      <aside
        id="mobile-menu"
        aria-hidden={!isOpen}
        className={`sheet-glass fixed inset-y-0 left-0 z-[90] w-[80vw] max-w-xs p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-white/70">Menu</div>
          <button
            type="button"
            className="rounded-lg border border-white/50 px-2 py-1 text-xs text-white/80 hover:text-white hover:border-white"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {/* Simple items (Home, Trap News, Shop, About) */}
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className={`block rounded-md px-3 py-2 ${
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Events parent + submenu */}
          <button
            type="button"
            onClick={() => setEventsOpen((v) => !v)}
            className={`mt-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-left ${
              isEventsSectionActive
                ? "bg-white/10 text-white"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>Events</span>
            <span className="text-xs opacity-80">
              {eventsOpen ? "▾" : "▸"}
            </span>
          </button>

          {eventsOpen && (
            <div className="ml-5 space-y-1">
              <Link
                href="/events/upcoming"
                onClick={() => onOpenChange(false)}
                className={`block rounded-md px-3 py-2 text-sm ${
                  pathname === "/events/upcoming"
                    ? "bg-white/10 text-white"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                Upcoming Events
              </Link>

              <Link
                href="/events/past"
                onClick={() => onOpenChange(false)}
                className={`block rounded-md px-3 py-2 text-sm ${
                  pathname === "/events/past"
                    ? "bg-white/10 text-white"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                Past Events
              </Link>
            </div>
          )}

          <hr className="my-3 border-white/10" />

          {/* Auth Options */}
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => onOpenChange(false)}
                className="block rounded-md px-3 py-2 text-white/80 hover:text-white hover:bg-white/10"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  signOut();
                }}
                className="w-full text-left rounded-md px-3 py-2 text-white/80 hover:text-white hover:bg-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                onClick={() => onOpenChange(false)}
                className="block rounded-md px-3 py-2 text-white/80 hover:text-white hover:bg-white/10"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                onClick={() => onOpenChange(false)}
                className="block rounded-md px-3 py-2 text-white/80 hover:text-white hover:bg-white/10"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </aside>
    </Fragment>
  );
}
