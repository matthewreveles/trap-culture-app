// src/app/shop/page.tsx

import type { Metadata } from "next";
import BuyButtonAllProducts from "@/components/BuyButtonAllProducts";

// This is allowed ONLY in a server component (no "use client" at the top)
export const metadata: Metadata = {
  title: "Trap Culture Shop",
  description: "Browse all Trap Culture products via our Shopify catalog.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Header strip */}
      <header className="mx-auto max-w-5xl px-4 py-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide uppercase">
          Trap Culture Shop
        </h1>
        <p className="text-sm text-white/60">
          All products from the Trap Culture Shopify store.
        </p>
      </header>

      {/* Shopify Buy Button "All Products" collection grid */}
      <main className="mx-auto max-w-6xl px-4 pb-12">
        <BuyButtonAllProducts />
      </main>
    </div>
  );
}
