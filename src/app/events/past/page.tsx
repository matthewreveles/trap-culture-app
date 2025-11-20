"use client";

import { useEffect, useState, useCallback } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import PhotoModal from "@/components/PhotoModal";

interface Photo {
  id: string;
  caption: string;
  created_time: string | null;
  imageUrl: string;
  width: number;
  height: number;
  link: string | null;
}

export default function PastEventsPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalPhoto, setModalPhoto] = useState<Photo | null>(null);

  const fetchPhotos = useCallback(async (cursor?: string | null) => {
    try {
      setLoading(true);

      const url = cursor
        ? `/api/events/photos?cursor=${cursor}`
        : `/api/events/photos`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.success && Array.isArray(json.photos)) {
        setPhotos((prev) => [...prev, ...json.photos]);
        setNextCursor(json.paging?.nextCursor ?? null);
      }
    } catch (err) {
      console.error("Failed to load photos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    const onScroll = () => {
      if (loading || !nextCursor) return;

      const buffer = 400;
      if (
        window.innerHeight + window.scrollY + buffer >=
        document.body.offsetHeight
      ) {
        fetchPhotos(nextCursor);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, nextCursor, fetchPhotos]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 text-white">
      {/* Section Header */}
      <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-3">
        Trap Culture Archive
      </p>

      <h1 className="text-5xl font-extrabold mb-4 tc-gradient-text">
        Past Trap Culture Events
      </h1>

      <p className="text-white/70 mb-10 max-w-2xl leading-relaxed">
        A running archive of Trap Culture events — pool parties, night shoots,
        warehouse sessions, everything. Scroll through every shot from newest to
        oldest.
      </p>

      {/* Grid */}
      <PhotoGrid photos={photos} onPhotoClick={setModalPhoto} />

      {/* Infinite scroll loader */}
      {loading && (
        <p className="text-center text-white/50 mt-6">Loading more…</p>
      )}

      {/* End of archive */}
      {!nextCursor && photos.length > 0 && (
        <p className="text-center text-white/40 mt-10">
          End of archive — more updates soon.
        </p>
      )}

      {/* Modal */}
      {modalPhoto && (
        <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
      )}
    </main>
  );
}
