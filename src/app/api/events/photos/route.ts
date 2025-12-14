// src/app/api/events/photos/route.ts
import { NextRequest, NextResponse } from "next/server";

const GRAPH_VERSION = "v24.0";

// Prefer the EVENTS envs, fall back to the older names if present
const PAGE_ID =
  process.env.FACEBOOK_PAGE_ID_EVENTS || process.env.FB_PAGE_ID;
const ACCESS_TOKEN =
  process.env.FACEBOOK_PAGE_ACCESS_TOKEN_EVENTS || process.env.FB_ACCESS_TOKEN;

// ---- Types ----

type GraphImage = {
  height: number;
  width: number;
  source: string;
};

type GraphPhoto = {
  id: string;
  name?: string;
  created_time?: string;
  images?: GraphImage[];
  link?: string;
};

type GraphAlbum = {
  id: string;
  name: string;
  count?: number;
  created_time?: string;
};

type GraphError = {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  fbtrace_id?: string;
};

type ApiPhoto = {
  id: string;
  caption: string;
  created_time: string;
  imageUrl: string;
  width: number;
  height: number;
  link: string | null;
};

// ---- Helpers ----

function buildAlbumsUrl() {
  const params = new URLSearchParams({
    fields: "id,name,count,created_time",
    limit: "50",
    access_token: ACCESS_TOKEN || "",
  });

  return `https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/albums?${params.toString()}`;
}

function buildAlbumPhotosUrl(albumId: string, limit = 200) {
  const params = new URLSearchParams({
    fields: "id,name,created_time,images,link",
    limit: String(limit),
    access_token: ACCESS_TOKEN || "",
  });

  return `https://graph.facebook.com/${GRAPH_VERSION}/${albumId}/photos?${params.toString()}`;
}

async function fetchJson<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  const text = await res.text();

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("[/api/events/photos] Failed to parse JSON from Graph:", {
      url,
      text,
      err,
    });
    throw new Error("Failed to parse Graph API response");
  }
}

function isGraphError(obj: unknown): obj is { error: GraphError } {
  if (!obj || typeof obj !== "object") return false;
  return "error" in obj;
}

// ---- Main handler ----

export async function GET(req: NextRequest) {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    console.error("[/api/events/photos] Missing PAGE_ID or ACCESS_TOKEN env vars", {
      PAGE_ID: !!PAGE_ID,
      ACCESS_TOKEN: !!ACCESS_TOKEN,
    });

    return NextResponse.json(
      {
        success: false,
        photos: [],
        paging: null,
        error: "Missing Facebook configuration",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const cursorParam = searchParams.get("cursor") ?? "0";
  const offset = Number.isNaN(Number(cursorParam)) ? 0 : Number(cursorParam);
  const PAGE_SIZE = 25;

  try {
    // 1) Fetch albums for this page
    const albumsUrl = buildAlbumsUrl();
    console.log("[/api/events/photos] Fetching albums");

    const albumsResponse = await fetchJson<{
      data?: GraphAlbum[];
      paging?: { cursors?: { before?: string; after?: string } };
      error?: GraphError;
    }>(albumsUrl);

    if (albumsResponse?.error) {
      console.error("[/api/events/photos] Album fetch error:", {
        error: albumsResponse.error,
      });

      return NextResponse.json(
        {
          success: false,
          photos: [],
          paging: null,
          error: `Graph API album error: ${
            albumsResponse.error.message || "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }

    const albums = albumsResponse.data || [];

    // Filter out obvious non-event junk (keep everything else)
    const filteredAlbums = albums.filter((album) => {
      const name = (album.name || "").toLowerCase();
      if (name.includes("cover photos")) return false;
      if (name.includes("profile pictures")) return false;
      return true;
    });

    console.log("[/api/events/photos] Albums discovered:", {
      total: albums.length,
      filtered: filteredAlbums.length,
    });

    // 2) Fetch photos from each album in parallel
    const photosByAlbum = await Promise.all(
      filteredAlbums.map(async (album) => {
        const url = buildAlbumPhotosUrl(album.id);

        const albumPhotosRes = await fetchJson<{
          data?: GraphPhoto[];
          paging?: { cursors?: { before?: string; after?: string } };
          error?: GraphError;
        }>(url);

        if (albumPhotosRes?.error) {
          console.error("[/api/events/photos] Error fetching album photos:", {
            albumId: album.id,
            albumName: album.name,
            error: albumPhotosRes.error,
          });
          return [] as GraphPhoto[];
        }

        return albumPhotosRes.data || [];
      })
    );

    // 3) Flatten, normalize, sort newest → oldest
    const flattened: ApiPhoto[] = photosByAlbum
      .flat()
      .filter((p) => p.images && p.images.length > 0 && p.created_time)
      .map((p) => {
        const bestImage = p.images![0]; // largest first
        return {
          id: p.id,
          caption: p.name ?? "",
          created_time: p.created_time!,
          imageUrl: bestImage.source,
          width: bestImage.width,
          height: bestImage.height,
          link: p.link ?? null,
        };
      })
      .sort((a, b) => {
        const aTime = new Date(a.created_time).getTime();
        const bTime = new Date(b.created_time).getTime();
        return bTime - aTime;
      });

    // 4) Dedupe by photo id (Graph can repeat photos across albums / “mobile uploads”)
    // Keep ordering from `flattened` (already newest-first).
    const uniqueMap = new Map<string, ApiPhoto>();
    for (const p of flattened) {
      if (!uniqueMap.has(p.id)) uniqueMap.set(p.id, p);
    }
    const uniquePhotos = Array.from(uniqueMap.values());

    // 5) Paginate (offset cursor)
    const totalCount = uniquePhotos.length;
    const slice = uniquePhotos.slice(offset, offset + PAGE_SIZE);
    const nextCursor =
      offset + PAGE_SIZE < totalCount ? String(offset + PAGE_SIZE) : null;

    console.log("[/api/events/photos] Aggregated photos:", {
      totalCount,
      returned: slice.length,
      offset,
      nextCursor,
      deduped: flattened.length - uniquePhotos.length,
    });

    return NextResponse.json({
      success: true,
      photos: slice,
      paging: { nextCursor },
      error: null,
    });
  } catch (err: any) {
    console.error("[/api/events/photos] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        photos: [],
        paging: null,
        error: err?.message || "Failed to load photos",
      },
      { status: 500 }
    );
  }
}
