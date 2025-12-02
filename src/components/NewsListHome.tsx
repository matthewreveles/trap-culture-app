// src/components/NewsListHome.tsx

import { fetchTrapNews, type TrapNewsItem } from "@/lib/trapNews";

type NewsListHomeProps = {
  limit?: number;
};

function safeHref(url: string | undefined): string {
  if (!url || typeof url !== "string") return "#";
  return url.startsWith("http") ? url : "#";
}

export default async function NewsListHome({ limit = 3 }: NewsListHomeProps) {
  const { items } = await fetchTrapNews(1, limit);

  if (!items || items.length === 0) {
    return null;
  }

  const previews: TrapNewsItem[] = items.slice(0, limit);

  return (
    <div className="space-y-4">
      {previews.map(item => (
        <article
          key={item.id}
          className="
            rounded-3xl
            bg-trap-orange-soft p-5
            shadow-[0_16px_40px_rgba(0,0,0,0.32)]
            ring-1 ring-trap-purple-dark/10
            transition
            hover:-translate-y-0.5 hover:ring-suns-orange/60
            dark:bg-[#111119] dark:ring-white/10
          "
        >
          <h3 className="text-lg font-semibold tracking-tight text-trap-purple-dark dark:text-white">
            <a
              href={safeHref((item as any).link)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {item.title}
            </a>
          </h3>

          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-[#4c3659] dark:text-gray-300">
              {item.description}
            </p>
          )}

          {item.pubDate && (
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#7b658a] dark:text-gray-400">
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
