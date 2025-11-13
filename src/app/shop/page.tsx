"use client";

import dynamic from "next/dynamic";

// Dynamically import to disable SSR (Shopify Buy Button only runs client-side)
const BuyButtonAllProducts = dynamic(() => import("@/components/BuyButtonAllProducts"), {
  ssr: false,
});

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-28 pb-24 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
        <span className="text-gradient">Shop</span>
      </h1>

      <section className="w-full">
        <BuyButtonAllProducts />
      </section>
    </main>
  );
}
