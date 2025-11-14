// src/lib/trapNews.ts

export type TrapNewsItem = {
  id: string;
  title: string;
  url: string;
  image?: string | null;
  publishedAt?: string | null;
  source?: string | null;
};

const API_URL = "https://trapculturefeed.vercel.app/api/news"; 
// ⬆️ Replace with your real backend if needed

/**
 * Fetch a page of Trap News items
 */
export async function fetchTrapNews(page = 1, pageSize = 10): Promise<TrapNewsItem[]> {
  const res = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`, {
    next: { revalidate: 60 }, // cache for 60s (server component)
  });

  if (!res.ok) throw new Error("Failed to fetch Trap News");

  const data = await res.json();
  return data.items as TrapNewsItem[];
}

/**
 * Get the first page of news for initial rendering
 */
export async function getInitialItems(): Promise<TrapNewsItem[]> {
  return await fetchTrapNews(1, 10);
}
