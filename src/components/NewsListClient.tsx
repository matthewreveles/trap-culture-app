// src/components/NewsListClient.tsx
"use client";

import { useCallback, useState } from "react";
import SafeImage from "@/components/SafeImage";

export type TrapNewsItem = {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  image?: string;
  thumbnail?: string;
  featuredImage?: string;
  featured_image?: string;
  category?: string;
  isoDate?: string;
};

export default function NewsListClient({
  initialItems,
  initialPage = 1,
  pageSize = 20,
}: {
  initialItems: TrapNewsItem[];
  initialPage?: number;
  pageSize?: number;
}) {
  const [items, setItems] = useState<TrapNewsItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length === pageSize);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/trap-news?page=${page + 1}&pageSize=${pageSize}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (Array.isArray(data.items)) {
        setItems(prev => [...prev, ...data.items]);
        setPage(data.page || page + 1);
        setHasMore(Boolean(data.hasMore));
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

  return (
    <>
      <ul className="space-y-3">
        {items.map(item => {
          const thumb =
            item.image ??
            item.thumbnail ??
            (item as any).featuredImage ??
            (item as any).featured_image ??
            "";

          return (
            <li
              key={item.id}
              className="
                flex items-center gap-3
                overflow-hidden rounded-2xl border
                px-3 py-2 md:px-4 md:py-3
                transition-all backdrop-blur-sm
                bg-trap-orange-soft text-trap-purple-dark border-trap-purple-dark/10
                hover:shadow-lg
                dark:bg-white/5 dark:text-trap-text-dark dark:border-white/12
              "
            >
              {/* Thumbnail */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md md:h-[88px] md:w-[88px]"
              >
                {thumb ? (
                  <SafeImage
                    src={thumb}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 72px, 88px"
                  />
                ) : (
                  <div className="h-full w-full bg-white/60 dark:bg-white/5" />
                )}
              </a>

              {/* Text block */}
              <div className="min-w-0 flex-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-trap-purple-dark group-hover:text-black md:text-base dark:text-white dark:group-hover:text-white">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="mt-1 line-clamp-2 text-xs leading-snug text-[#4c3659] md:text-sm dark:text-neutral-300">
                      {item.excerpt}
                    </p>
                  )}
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="
              rounded-full px-5 py-2
              text-xs font-semibold uppercase tracking-[0.18em]
              bg-trap-purple-dark text-white shadow-md
              hover:scale-[1.02]
              disabled:opacity-60
              dark:bg-white dark:text-trap-purple-dark
            "
          >
            {loading ? "Loading…" : "Load more stories"}
          </button>
        </div>
      )}
    </>
  );
}
