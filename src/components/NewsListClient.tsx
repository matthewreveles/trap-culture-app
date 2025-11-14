"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * NewsItem — relaxed URL typing so server strings are valid.
 */
export type NewsItem = {
  id: string;
  title: string;
  url: string | URL | { pathname: string; query?: Record<string, any> };
  image?: string | null;
  publishedAt?: string | null;
  source?: string | null;
};

type NewsListClientProps = {
  initialItems: NewsItem[];
  loadMoreUrl: string;
};

export default function NewsListClient({
  initialItems,
  loadMoreUrl,
}: NewsListClientProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  async function loadMore() {
    if (loading || finished) return;

    setLoading(true);

    try {
      const res = await fetch(`${loadMoreUrl}?cursor=${items.length}`);
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        setFinished(true);
        return;
      }

      setItems((prev) => [...prev, ...data.items]);
    } catch (err) {
      console.error("Error loading more news:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3">
            <Link
              href={item.url as any}
              className="relative shrink-0 w-[112px] h-[112px] md:w-[140px] md:h-[140px] rounded-md overflow-hidden tc-glow-img tc-pulse"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                  No Image
                </div>
              )}
            </Link>

            <div className="flex flex-col gap-1">
              <Link
                href={item.url as any}
                className="text-sm font-medium leading-tight line-clamp-2 hover:underline"
              >
                {item.title}
              </Link>

              {(item.source || item.publishedAt) && (
                <span className="text-xs text-neutral-500">
                  {item.source ? `${item.source} — ` : ""}
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString()
                    : ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!finished && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded-md border border-neutral-700 text-sm hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
