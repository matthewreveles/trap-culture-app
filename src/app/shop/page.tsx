// src/app/shop/page.tsx

import type { Metadata } from "next";
import BuyButtonAllProducts from "@/components/BuyButtonAllProducts";

export const metadata: Metadata = {
  title: "Trap Culture Shop",
  description: "Browse all Trap Culture products via our Shopify catalog.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-24">
        <header className="mb-10 space-y-3">
          <p className="tc-body-text-sm font-bebas tracking-[0.35em] uppercase">
            Trap Culture Shop
          </p>

          <h1 className="tc-section-title font-bebas text-[40px] md:text-[52px] leading-none">
            Shop the collection
          </h1>

          <p className="tc-body-text max-w-2xl text-muted-foreground">
            All official Trap Culture merch, powered by our Shopify catalog.
          </p>
        </header>

        <div className="rounded-3xl border border-border bg-card/80 p-4 md:p-6">
          {/* Existing Shopify Buy Button "all products" grid */}
          <BuyButtonAllProducts />
        </div>
      </section>
    </main>
  );
}
