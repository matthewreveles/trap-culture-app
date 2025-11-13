"use client";

import Image, { type ImageProps } from "next/image";

const ALLOWED = [
  "trapcultureaz.com",
  "images.squarespace-cdn.com",
  "i0.wp.com",
  "i1.wp.com",
  "i2.wp.com",
  "s0.wp.com",
  "www.concertarchives.org",
];

function isAllowedHost(src: string) {
  try {
    const host = new URL(src).hostname.toLowerCase();
    return ALLOWED.includes(host) || host.endsWith(".trapcultureaz.com") || host.endsWith(".wp.com");
  } catch {
    return false;
  }
}

export default function SafeImage(props: ImageProps) {
  const src = String(props.src ?? "");
  if (!isAllowedHost(src)) {
    return (
      <img
        src={src}
        alt={props.alt || ""}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loading="lazy"
      />
    );
  }
  return <Image {...props} />;
}
