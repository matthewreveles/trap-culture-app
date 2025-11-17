// src/lib/trapNews.ts
import Parser from "rss-parser";

export type TrapNewsItem = {
  id: string;
  title: string;
  link?: string;
  description?: string;
  pubDate?: string;
  imageUrl?: string;
  source?: string;
};

type RawItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  isoDate?: string;
  pubDate?: string;
  enclosure?: { url?: string };
  // custom fields added via rss-parser
  ["media:content"]?: { $?: { url?: string } };
  ["content:encoded"]?: string;
};

type RawFeed = {
  items?: RawItem[];
};

const FEED_URL =
  process.env.TRAP_NEWS_FEED_URL ??
  "https://trapcultureaz.com/feed/";

// tell rss-parser about our custom fields
const parser: Parser<unknown, RawItem> = new Parser({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["content:encoded", "content:encoded"],
    ],
  },
});

/**
 * Try really hard to find an image URL for a feed item.
 */
function extractImageUrl(item: RawItem): string | undefined {
  // 1) <media:content url="...">
  const mediaUrl = item["media:content"]?.$?.url;
  if (mediaUrl) return mediaUrl;

  // 2) <enclosure url="...">
  if (item.enclosure?.url) return item.enclosure.url;

  // 3) First <img src="..."> inside content:encoded
  const html = item["content:encoded"];
  if (html) {
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) {
      return imgMatch[1];
    }
  }

  // 4) Nothing found
  return undefined;
}

/**
 * Server-side helper to fetch & paginate Trap News.
 */
export async function fetchTrapNews(
  page = 1,
  pageSize = 10
): Promise<{ items: TrapNewsItem[]; hasMore: boolean }> {
  const url = FEED_URL;

  const res = await fetch(url, {
    // cache on the server, not per-request
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Trap News feed");
  }

  const xml = await res.text();
  const feed = (await parser.parseString(xml)) as RawFeed;

  const allItems = feed.items ?? [];
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = allItems.slice(start, end);

  const items: TrapNewsItem[] = pageItems.map((item, index) => {
    const imageUrl = extractImageUrl(item);

    return {
      id: item.link ?? `trap-news-${page}-${start + index}`,
      title: item.title ?? "Untitled",
      link: item.link,
      description: item.contentSnippet ?? "",
      pubDate: item.isoDate ?? item.pubDate ?? undefined,
      imageUrl,
      source: "trapcultureaz.com",
    };
  });

  const hasMore = end < allItems.length;

  return { items, hasMore };
}
