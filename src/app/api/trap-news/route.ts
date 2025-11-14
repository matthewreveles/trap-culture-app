// src/app/api/trap-news/route.ts

import { NextResponse } from "next/server";
import { fetchTrapNews } from "@/lib/trapNews";

// 🔥 THIS FIXES YOUR BUILD ERROR:
// Next.js cannot statically prerender a route that uses `req.url`
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const cursor = searchParams.get("cursor");

    // If cursor-based pagination is being used by NewsListClient:
    if (cursor !== null) {
      const c = Number(cursor);
      if (!isNaN(c)) {
        const nextPage = Math.floor(c / pageSize) + 1;
        const items = await fetchTrapNews(nextPage, pageSize);
        return NextResponse.json({ items });
      }
    }

    // Default page-based fetch:
    const items = await fetchTrapNews(page, pageSize);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Trap News API error:", err);
    return NextResponse.json(
      { error: "Failed to load Trap News" },
      { status: 500 }
    );
  }
}
