// src/components/PhotoModal.tsx
"use client";

import { useEffect } from "react";

type Photo = {
  id: string;
  caption: string;
  created_time: string | null;
  imageUrl: string;
  width: number;
  height: number;
  link: string | null;
};

type Props = {
  photo: Photo;
  onClose: () => void;
};

export default function PhotoModal({ photo, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const formattedDate =
    photo.created_time &&
    new Date(photo.created_time).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Trap Culture photo detail"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-[92vw] max-w-3xl overflow-hidden rounded-2xl bg-black/90 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs text-white/80 hover:bg-black"
        >
          Close
        </button>

        <img
          src={photo.imageUrl}
          alt={photo.caption || "Trap Culture event photo"}
          className="max-h-[70vh] w-full object-contain bg-black"
        />

        <div className="border-t border-white/10 px-4 py-3 text-sm text-white/80">
          {formattedDate && (
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
              {formattedDate}
            </p>
          )}

          {photo.caption && (
            <p className="mb-2 leading-snug">{photo.caption}</p>
          )}

          {photo.link && (
            <a
              href={photo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-fuchsia-400 hover:text-fuchsia-300 underline"
            >
              View on Facebook
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
