// src/app/trap-news/page.tsx

export const revalidate = 600; // ISR every 10 minutes

import { fetchTrapNews } from "scripts/fetchTrapNews";
import NewsListClient, {
  TrapNewsItem,
} from "@/components/NewsListClient";

export default async function TrapNewsPage() {
  const pageSize = 10;
  const initialItems = (await fetchTrapNews(pageSize)) as TrapNewsItem[];

  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-28 space-y-6 text-foreground">
      {/* TRAP NEWS hero header */}
      <header className="mb-6 space-y-4">
        <h1
          className="
            font-racing
            font-[900]
            uppercase
            text-left
            leading-[0.80]
            tracking-[-0.03em]
            text-[132px]
            md:text-[220px]
          "
        >
          <span className="block text-suns-purple dark:text-white">TRAP</span>
          <span className="block text-suns-purple dark:text-white">NEWS</span>
        </h1>

        {/* Byline / Kicker */}
        <p className="tc-trapnews-kicker text-trap-purple-dark dark:text-white/70">
          LIFESTYLE • EVENTS • CULTURE
        </p>

        {/* Tagline */}
        <p className="tc-trapnews-tagline text-trap-purple-dark dark:text-neutral-100">
          All the news that&apos;s{" "}
          <span className="lit-gradient">LIT</span>{" "}
          to print.
        </p>
      </header>

      {!initialItems.length ? (
        <p className="text-center text-foreground/70">
          No posts found yet. Check back soon.
        </p>
      ) : (
        <section aria-label="Latest Trap News stories">
          <NewsListClient
            initialItems={initialItems}
            initialPage={1}
            pageSize={pageSize}
          />
        </section>
      )}
    </main>
  );
}
