// scripts/fetchTrapNews.ts

export type TrapNewsItem = {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  image?: string;
  isoDate?: string;
};

const BASE_URL = "https://trapcultureaz.com";

// Strip HTML tags and collapse whitespace
function stripHtml(html: string = ""): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function makeExcerpt(html: string = "", max = 220): string {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

async function getTrapNewsCategoryId(): Promise<number | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/categories?slug=trap-news`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Trap News category fetch failed", res.status);
      return null;
    }

    const cats = (await res.json()) as any[];
    const cat = cats[0];
    return cat?.id ?? null;
  } catch (err) {
    console.error("Error fetching Trap News category:", err);
    return null;
  }
}

export async function fetchTrapNews(limit = 60): Promise<TrapNewsItem[]> {
  try {
    const perPage = Math.min(limit, 40); // WP default max is 100; keep it reasonable
    const catId = await getTrapNewsCategoryId();

    const url =
      catId !== null
        ? `${BASE_URL}/wp-json/wp/v2/posts?categories=${catId}&per_page=${perPage}&_embed=1`
        : `${BASE_URL}/wp-json/wp/v2/posts?per_page=${perPage}&_embed=1`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Trap News posts fetch failed", res.status);
      return [];
    }

    const posts = (await res.json()) as any[];

    const items: TrapNewsItem[] = posts.map((post) => {
      const title = stripHtml(post?.title?.rendered ?? "Untitled");
      const excerptHtml = post?.excerpt?.rendered ?? "";
      const excerpt = makeExcerpt(excerptHtml);

      const image =
        post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
        undefined;

      const isoDate = post?.date_gmt
        ? new Date(post.date_gmt + "Z").toISOString()
        : post?.date
        ? new Date(post.date).toISOString()
        : undefined;

      return {
        id: String(post.id),
        title,
        url: post.link,
        excerpt,
        image,
        isoDate,
      };
    });

    return items;
  } catch (err) {
    console.error("Error in fetchTrapNews:", err);
    return [];
  }
}
