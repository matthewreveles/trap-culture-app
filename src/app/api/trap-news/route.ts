// src/app/api/trap-news/route.ts

import { NextResponse } from "next/server";
import { fetchTrapNews } from "@/lib/trapNews";

export const revalidate = 300; // 5 minutes

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const cursor = Number(searchParams.get("cursor") ?? null);

    // If using cursor-based pagination from NewsListClient
    if (!isNaN(cursor)) {
      const nextPage = Math.floor(cursor / pageSize) + 1;
      const items = await fetchTrapNews(nextPage, pageSize);

      return NextResponse.json({ items });
    }

    // Default page-based fetch
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
