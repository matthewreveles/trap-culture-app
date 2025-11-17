// src/components/SafeImage.tsx
import Image, { type ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt?: string;
}

/**
 * Decide whether we should pass this src through next/image.
 * We only optimize:
 * - local assets ("/foo.png")
 * - trapcultureaz.com images
 */
function canUseNextImage(src: string): boolean {
  try {
    // Relative path -> treat as local asset
    if (src.startsWith("/")) return true;

    const { hostname } = new URL(src);

    return (
      hostname === "trapcultureaz.com" ||
      hostname === "www.trapcultureaz.com"
    );
  } catch {
    // If URL parsing fails, play it safe and *don’t* use next/image.
    return false;
  }
}

export default function SafeImage({
  src,
  alt = "",
  className,
  ...props
}: SafeImageProps) {
  // No src? Render a simple placeholder box.
  if (!src) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center text-xs text-zinc-400 ${
          className ?? ""
        }`}
      >
        No image
      </div>
    );
  }

  // For any non-TrapCulture / non-local URL, use a plain <img>
  // so we don’t trigger next/image domain restrictions.
  if (!canUseNextImage(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  }

  // From here down, we’re safe to use next/image.
  const { width, height, ...rest } = props;

  // If width & height are provided, use standard fixed-size image.
  if (typeof width === "number" && typeof height === "number") {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...rest}
      />
    );
  }

  // Otherwise, use fill layout inside a relative, sized parent.
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={props.sizes ?? "100vw"}
      className={className}
      {...rest}
    />
  );
}
