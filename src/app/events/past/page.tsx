// src/app/events/past/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import PhotoModal from "@/components/PhotoModal";

type Photo = {
  id: string;
  caption: string;
  created_time: string | null;
  imageUrl: string;
  width: number;
  height: number;
  link: string | null;
};

type ApiResponse = {
  success: boolean;
  photos: Photo[];
  paging: { nextCursor: string | null } | null;
  error?: string | null;
};

export default function PastEventsPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalPhoto, setModalPhoto] = useState<Photo | null>(null);

  // Prevent duplicate fetches for the same cursor
  const lastRequestedCursorRef = useRef<string>("__init__");

  const fetchPhotos = useCallback(async (cursor?: string | null) => {
    const cursorKey = cursor ?? "__first__";
    if (loading) return;
    if (lastRequestedCursorRef.current === cursorKey) return;

    lastRequestedCursorRef.current = cursorKey;

    try {
      setLoading(true);

      const url = cursor
        ? `/api/events/photos?cursor=${encodeURIComponent(cursor)}`
        : `/api/events/photos`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as ApiResponse;

      if (json?.success && Array.isArray(json.photos)) {
        setPhotos((prev) => [...prev, ...json.photos]);
        setNextCursor(json?.paging?.nextCursor ?? null);
      } else {
        // allow retry if API returns a soft-failure
        lastRequestedCursorRef.current = "__retry__";
        console.warn("Photo API returned non-success:", json?.error);
      }
    } catch (err) {
      // allow retry after failure
      lastRequestedCursorRef.current = "__retry__";
      console.error("Failed to load photos:", err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchPhotos(null);
  }, [fetchPhotos]);

  useEffect(() => {
    const onScroll = () => {
      if (loading || !nextCursor) return;

      if (
        window.innerHeight + window.scrollY + 400 >=
        document.documentElement.scrollHeight
      ) {
        fetchPhotos(nextCursor);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, nextCursor, fetchPhotos]);

  const title = useMemo(() => "Past Trap Culture Events", []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-white">
      <p className="mb-2 text-xs tracking-widest uppercase text-white/40">
        Trap Culture Archive
      </p>

      <h1 className="mb-4 text-4xl font-extrabold tc-gradient-text sm:text-5xl">
        {title}
      </h1>

      <p className="mb-10 max-w-2xl leading-relaxed text-white/70">
        A running archive of Trap Culture events — pool parties, night shoots,
        warehouse sessions, everything. Scroll through every shot from newest to
        oldest.
      </p>

      <PhotoGrid photos={photos} onPhotoClick={setModalPhoto} />

      {loading && <p className="mt-6 text-center text-white/60">Loading more…</p>}

      {!nextCursor && photos.length > 0 && (
        <p className="mt-8 text-center text-white/40">
          End of archive — more soon.
        </p>
      )}

      {modalPhoto && (
        <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
      )}
    </main>
  );
}
