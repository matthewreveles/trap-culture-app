// src/components/NewsListHome.tsx

import Link from "next/link";
import { fetchTrapNews, type TrapNewsItem } from "@/lib/trapNews";

type NewsListHomeProps = {
  limit?: number;
};

// Ensure href is always a valid string for <Link>
function safeHref(url: string | undefined): string {
  if (!url || typeof url !== "string") return "#";
  return url.startsWith("http") ? url : "#"; // Next.js requires valid URL
}

export default async function NewsListHome({ limit = 3 }: NewsListHomeProps) {
  const { items } = await fetchTrapNews(1, limit);

  if (!items || items.length === 0) {
    return null;
  }

  const previews: TrapNewsItem[] = items.slice(0, limit);

  return (
    <div className="space-y-4">
      {previews.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl bg-trap-surface/70 p-5 shadow-lg shadow-black/50 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-trap-pink/40"
        >
          <h3 className="text-lg font-semibold tracking-tight text-white">
            <Link href={safeHref(item.link)} className="hover:underline">
              {item.title}
            </Link>
          </h3>

          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-trap-muted">
              {item.description}
            </p>
          )}

          {item.pubDate && (
            <p className="mt-2 text-xs uppercase tracking-wide text-trap-muted/80">
              {new Date(item.pubDate).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
