import Parser from "rss-parser";

export type TrapNewsItem = {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  image?: string;
  category?: string;
  isoDate?: string;
};

const parser = new Parser<{ items: any[] }>({ timeout: 10000 });

const ALLOWED_IMAGE_HOSTS = new Set([
  "trapcultureaz.com",
  "images.squarespace-cdn.com",
  "i0.wp.com",
  "i1.wp.com",
  "i2.wp.com",
  "s0.wp.com",
  "www.concertarchives.org",
]);

function allowedHost(url?: string) {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      ALLOWED_IMAGE_HOSTS.has(host) ||
      host.endsWith(".trapcultureaz.com") ||
      host.endsWith(".wp.com")
    );
  } catch {
    return false;
  }
}

function resolveUrlMaybeRelative(src?: string, base?: string) {
  if (!src) return undefined;
  try {
    if (src.startsWith("//")) return `https:${src}`; // protocol-relative
    if (src.startsWith("data:")) return undefined;   // ignore data URIs
    if (/^https?:\/\//i.test(src)) return src;       // absolute
    if (base) return new URL(src, base).href;        // relative -> absolute
  } catch {}
  return undefined;
}

/** Try common WP/Jetpack attributes and resolve relative URLs. */
function firstImageFromHTML(html?: string, base?: string) {
  if (!html) return;

  // data-lazy-src
  let m = html.match(/<img[^>]+data-lazy-src=["']([^"']+)["']/i);
  if (m?.[1]) {
    const url = resolveUrlMaybeRelative(m[1], base);
    if (allowedHost(url)) return url;
  }

  // data-src
  m = html.match(/<img[^>]+data-src=["']([^"']+)["']/i);
  if (m?.[1]) {
    const url = resolveUrlMaybeRelative(m[1], base);
    if (allowedHost(url)) return url;
  }

  // srcset or data-lazy-srcset (take first URL)
  m = html.match(/<img[^>]+(?:data-lazy-)?srcset=["']([^"']+)["']/i);
  if (m?.[1]) {
    const first = m[1].split(",")[0]?.trim().split(" ")[0];
    const url = resolveUrlMaybeRelative(first, base);
    if (allowedHost(url)) return url;
  }

  // plain src
  m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m?.[1]) {
    const url = resolveUrlMaybeRelative(m[1], base);
    if (allowedHost(url)) return url;
  }

  return undefined;
}

/** Build a WP feed URL for a given 1-indexed page. */
function pagedUrl(feedUrl: string, page: number) {
  const hasQuery = feedUrl.includes("?");
  return `${feedUrl}${hasQuery ? "&" : "?"}paged=${page}`;
}

/**
 * Fetches one page of the Trap News feed.
 * NOTE: WordPress controls the items per feed page (often 10). `pageSize`
 * is used for "hasMore" math and client copy, but the feed may still return
 * fewer or more depending on site settings.
 */
export async function fetchTrapNewsPage(page = 1, pageSize = 10): Promise<TrapNewsItem[]> {
  try {
    const FEED = process.env.TRAP_NEWS_FEED_URL;
    if (!FEED) throw new Error("TRAP_NEWS_FEED_URL not set");

    const siteBase = new URL(FEED).origin; // e.g., https://trapcultureaz.com
    const url = page > 1 ? pagedUrl(FEED, page) : FEED;
    const feed = await parser.parseURL(url);

    const items = (feed.items || []).map((it: any, i: number) => {
      const enc = Array.isArray(it.enclosure) ? it.enclosure[0] : it.enclosure;
      const encUrl = enc?.url ? resolveUrlMaybeRelative(enc.url, siteBase) : undefined;

      const fromHtml = firstImageFromHTML((it as any)["content:encoded"] || it.content, siteBase);
      const rawImage = encUrl || fromHtml;
      const image = allowedHost(rawImage) ? rawImage : undefined;

      const category = Array.isArray(it.categories) ? it.categories[0] : (it.categories as any);

      const rawSnippet = it.contentSnippet || (it["content:encoded"] || it.content || "");
      const excerpt = String(rawSnippet).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 240);

      return {
        id: it.guid || it.link || `${page}-${i}`,
        title: (it.title || "Untitled").trim(),
        url: it.link,
        excerpt,
        image,
        category,
        isoDate: (it as any).isoDate || it.pubDate,
      } as TrapNewsItem;
    });

    // Some WP installs might return more than pageSize; we’ll cap client-side label/calc.
    return items;
  } catch {
    return [];
  }
}
