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

export default function PhotoGrid({
  photos,
  onPhotoClick,
}: {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {photos.map((photo, index) => (
        <button
          key={`${photo.id}-${photo.created_time ?? "na"}-${index}`}
          type="button"
          onClick={() => onPhotoClick(photo)}
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        >
          {/* 1:1 tile */}
          <div className="aspect-square w-full">
            <img
              src={photo.imageUrl}
              alt={photo.caption || "Trap Culture event photo"}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          {photo.caption ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="truncate text-[10px] sm:text-xs text-white/90">
                {photo.caption}
              </p>
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
