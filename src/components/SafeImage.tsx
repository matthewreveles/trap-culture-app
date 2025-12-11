// src/components/SafeImage.tsx
import React from "react";
import Image from "next/image";

type SafeImageProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
> & {
  src?: string | null;
  alt?: string;
};

// These should stay in sync with next.config.ts where possible.
const ALLOWED_IMAGE_HOSTS = [
  "cdn.shopify.com",
  "trapcultureaz.com",
  "www.trapcultureaz.com",
];

function canUseNextImage(src: string): boolean {
  // Local /public assets are always fine.
  if (src.startsWith("/")) return true;

  try {
    const url = new URL(src);
    return ALLOWED_IMAGE_HOSTS.includes(url.hostname);
  } catch {
    // If it's not a valid URL and not a local path, play it safe.
    return false;
  }
}

export function SafeImage(props: SafeImageProps) {
  const { src, alt = "", ...rest } = props;

  if (!src) {
    return null;
  }

  if (canUseNextImage(src)) {
    // Use Next's optimized <Image /> for known-safe hosts.
    return <Image src={src} alt={alt} {...rest} />;
  }

  // Fallback: plain <img> for any unknown/one-off host
  // so Next's image config doesn't crash the page.
  const { fill, ...restWithoutFill } = rest as any;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...restWithoutFill} />
  );
}
