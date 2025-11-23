// src/components/PhotoGrid.tsx
"use client";

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
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
};

export default function PhotoGrid({ photos, onPhotoClick }: Props) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section aria-label="Past Trap Culture event photos" className="mt-4">
      <div
        className="
          grid
          grid-cols-3 gap-2
          sm:grid-cols-4
          md:grid-cols-5
          lg:grid-cols-6
        "
      >
        {photos.map((photo, index) => (
          <button
            key={`${photo.id}-${index}`}  // ensure unique key even if FB reuses IDs
            type="button"
            onClick={() => onPhotoClick(photo)}
            className="
              group
              relative
              overflow-hidden
              rounded-xl
              border border-white/5
              bg-zinc-900/80
              focus:outline-none
              focus:ring-2
              focus:ring-fuchsia-500
            "
          >
            {/* 1:1 square thumbnail */}
            <div className="aspect-square w-full relative">
              <img
                src={photo.imageUrl}
                alt={photo.caption || 'Trap Culture event photo'}
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                  transition-transform duration-200
                  group-hover:scale-105
                "
                loading="lazy"
              />
            </div>

            {/* caption overlay */}
            {photo.caption && (
              <div className="pointer-events-none absolute bottom-1 inset-x-1">
                <p className="truncate px-1.5 text-[10px] text-white/80 drop-shadow">
                  {photo.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
