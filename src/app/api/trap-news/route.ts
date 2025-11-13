import { NextResponse } from "next/server";
import { fetchTrapNewsPage } from "@/lib/trapNews";

export const revalidate = 300; // 5 min

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    // Default to 10; WordPress typically returns 10 per page.
    const pageSize = Math.min(50, Math.max(5, Number(searchParams.get("pageSize") || 10)));

    const items = await fetchTrapNewsPage(page, pageSize);

    // hasMore: assume more pages exist when we got a "full" page back.
    const hasMore = items.length >= pageSize;

    return NextResponse.json(
      { page, pageSize, total: null, items, hasMore },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=900" } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Feed error" }, { status: 500 });
  }
}
