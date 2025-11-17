// src/components/NewsListClient.tsx
"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
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
        setItems((prev) => [...prev, ...data.items]);
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
        {items.map((item) => {
          const thumb =
            item.image ??
            item.thumbnail ??
            (item as any).featuredImage ??
            (item as any).featured_image ??
            "";

          return (
            <li
              key={item.id}
              className="rounded-xl overflow-hidden border flex items-center gap-3 px-3 py-2 md:px-4 md:py-3 hover:shadow-lg transition-all backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(255, 248, 225, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* 1:1 thumbnail kept square, but smaller so card feels 3–4:1 */}
              <Link
                href={item.url}
                className="relative shrink-0 w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-md overflow-hidden"
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
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  />
                )}
              </Link>

              {/* Text block – forces the card to be a long horizontal bar */}
              <div className="min-w-0 flex-1 text-neutral-100">
                <Link href={item.url} className="group">
                  <h3 className="text-sm md:text-base font-semibold leading-snug group-hover:text-white transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="mt-1 text-xs md:text-sm text-neutral-400 line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                </Link>
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
            className="px-4 py-2 rounded-lg border text-sm hover:bg-white/5 disabled:opacity-60"
            style={{
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
