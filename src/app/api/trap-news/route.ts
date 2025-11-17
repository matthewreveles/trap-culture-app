// src/app/api/trap-news/route.ts
import { NextResponse } from "next/server";
import { fetchTrapNews } from "scripts/fetchTrapNews";

// Cache the feed for 10 minutes at the edge / CDN
export const revalidate = 600;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(
      50,
      Math.max(5, Number(searchParams.get("pageSize") || 20))
    );

    // Pull a big chunk, then slice into pages
    const all = await fetchTrapNews(300);

    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

    const hasMore = start + pageSize < all.length;

    return NextResponse.json(
      {
        page,
        pageSize,
        total: all.length,
        items,
        hasMore,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Trap News feed error" },
      { status: 500 }
    );
  }
}
