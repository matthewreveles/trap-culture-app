// src/app/trap-news/page.tsx

import { getInitialItems } from "@/lib/trapNews";
import NewsListClient, { NewsItem } from "@/components/NewsListClient";

export default async function TrapNewsPage() {
  // Fetch TrapNewsItem[] from server
  const trapItems = await getInitialItems();

  // Convert TrapNewsItem → NewsItem shape required by NewsListClient
  const initialItems: NewsItem[] = trapItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url, // valid as string because NewsItem uses Link's own href type
    image: item.image ?? null,
    publishedAt: item.publishedAt ?? null,
    source: item.source ?? null,
  }));

  return (
    <main className="min-h-screen px-4 py-16 md:px-8 lg:px-16">
      <header className="max-w-4xl mx-auto mb-12 space-y-4 text-center">
        <h1 className="font-bold tracking-tight text-4xl">
          <span>All the news that</span>{" "}
          <span className="tc-gradient-text font-extrabold italic">lit</span>
          <span> to print!</span>
        </h1>

        <p className="text-sm text-neutral-400">
          Trap Culture headlines, drops, events, and weird weed stories pulled
          together in one place.
        </p>
      </header>

      <NewsListClient
        initialItems={initialItems}
        loadMoreUrl="/api/trap-news"
      />
    </main>
  );
}
