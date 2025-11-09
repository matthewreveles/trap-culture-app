"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

type Item = {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  image?: string;
  category?: string;
  isoDate?: string;
};

type ApiResp = {
  page: number;
  pageSize: number;
  total: number;
  items: Item[];
  hasMore: boolean;
};

export default function NewsListClient({
  initialItems,
  initialPage = 1,
  pageSize = 20,
}: {
  initialItems: Item[];
  initialPage?: number;
  pageSize?: number;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(initialItems.length === pageSize);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/trap-news?page=${page + 1}&pageSize=${pageSize}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: ApiResp = await res.json();

      if (Array.isArray(data.items)) {
        setItems((prev) => [...prev, ...data.items]);
        setPage(data.page ?? page + 1);
        setHasMore(Boolean(data.hasMore));
      } else {
        // Defensive: unexpected payload shape
        setHasMore(false);
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load more");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

  return (
    <>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl overflow-hidden border flex gap-4 p-3 backdrop-blur-sm tc-glow-card"
            style={{
              backgroundColor: "rgba(255, 248, 225, 0.08)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Link
              href={item.url}
              className="relative shrink-0 w-[112px] h-[112px] md:w-[140px] md:h-[140px] rounded-md overflow-hidden tc-glow-img tc-pulse"
            >
              {item.image ? (
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 140px"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                />
              )}
            </Link>

            <div className="min-w-0 flex-1 text-neutral-100">
              <Link href={item.url} className="group">
                <h3 className="font-semibold leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="mt-1 text-sm text-neutral-400 line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
              </Link>
              {/* meta row intentionally omitted */}
            </div>
          </li>
        ))}
      </ul>

      {/* Error + Load More */}
      <div className="flex flex-col items-center pt-4 pb-24">
        {error && (
          <p className="mb-2 text-xs text-red-300/90">
            {error}
          </p>
        )}
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-white/5 disabled:opacity-60"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.85)",
            }}
            aria-busy={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </>
  );
}
