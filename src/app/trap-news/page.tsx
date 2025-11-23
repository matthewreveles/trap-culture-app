// src/app/trap-news/page.tsx

export const revalidate = 600; // ISR every 10 minutes

import { fetchTrapNews } from "scripts/fetchTrapNews";
import NewsListClient, {
  TrapNewsItem,
} from "@/components/NewsListClient";

export default async function TrapNewsPage() {
  // Show 10 per page by default
  const pageSize = 10;

  const initialItems = (await fetchTrapNews(pageSize)) as TrapNewsItem[];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-28 space-y-6">
      {/* TRAP NEWS hero header */}
      <header className="mb-6 space-y-4">
        <h1
          className="
            font-racing
            font-normal
            uppercase
            text-left
            leading-[0.82]
            tracking-[-0.025em]
            text-[clamp(3.75rem,12vw,13rem)]
          "
        >
          <span className="block">TRAP</span>
          <span className="block">NEWS</span>
        </h1>

        {/* Centered tagline */}
        <p className="text-center text-base md:text-lg italic text-gray-200 tracking-[0.05em]">
          All the news that’s{" "}
          <span className="lit-gradient">Lit</span>{" "}
          to print!
        </p>
      </header>

      {!initialItems.length ? (
        <p className="text-white/70 text-center">
          No posts found yet. Check back soon.
        </p>
      ) : (
        <section aria-label="Latest stories">
          <NewsListClient
            initialItems={initialItems}
            initialPage={1}
            pageSize={pageSize}
          />
        </section>
      )}
    </div>
  );
}
