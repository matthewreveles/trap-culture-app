// src/app/shop/page.tsx

import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Trap DropSite",
  description:
    "Trap DropSite is your hub for Trap Culture clothes, accessories, collabs and more.",
};

// We depend on external JSON, so keep this dynamic
export const dynamic = "force-dynamic";

const TC_SHOP_API_BASE =
  process.env.NEXT_PUBLIC_TC_SHOP_API_BASE ??
  "https://trap-shopify-website-build.vercel.app";

type TrapProduct = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  price: string | null;
  imageUrl: string | null;
};

type TrapProductsResponse = {
  ok: boolean;
  count: number;
  products: TrapProduct[];
};

// ---------- Data helpers ----------

async function fetchTrapProducts(): Promise<TrapProduct[]> {
  try {
    const res = await fetch(`${TC_SHOP_API_BASE}/api/products`, {
      // cache a little, but still keep it relatively fresh
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("[Trap DropSite] Failed to fetch products:", res.status);
      return [];
    }

    const data = (await res.json()) as TrapProductsResponse;

    if (!data.ok || !Array.isArray(data.products)) {
      console.error("[Trap DropSite] Unexpected API shape:", data);
      return [];
    }

    return data.products;
  } catch (err) {
    console.error("[Trap DropSite] Error fetching products:", err);
    return [];
  }
}

function normalizeTags(tags?: string[]) {
  return (tags ?? []).map((t) => t.toLowerCase());
}

function inSection(
  product: TrapProduct,
  options: {
    tags?: string[];
    typeIncludes?: string[];
  },
) {
  const t = normalizeTags(product.tags);
  const pt = (product.productType ?? "").toLowerCase();

  if (options.tags) {
    for (const tag of options.tags) {
      if (t.includes(tag.toLowerCase())) return true;
    }
  }

  if (options.typeIncludes) {
    for (const frag of options.typeIncludes) {
      if (pt.includes(frag.toLowerCase())) return true;
    }
  }

  return false;
}

function splitBySections(products: TrapProduct[]) {
  const nightOut = products.filter((p) =>
    inSection(p, {
      tags: ["night-out", "nightout", "night fit"],
      typeIncludes: ["night", "club", "party"],
    }),
  );

  const stayIn = products.filter((p) =>
    inSection(p, {
      tags: ["stay-in", "stay in", "lounge", "cozy"],
      typeIncludes: ["lounge", "hoodie", "jogger", "sweats"],
    }),
  );

  const bestSellers = products.filter((p) =>
    inSection(p, {
      tags: ["bestseller", "best-seller", "best seller"],
      typeIncludes: ["bestseller"],
    }),
  );

  const featuredDrops = products.filter((p) =>
    inSection(p, {
      tags: ["featured-drop", "featured", "drop"],
      typeIncludes: ["drop"],
    }),
  );

  // Pool / summer / beach fits
  const summerPool = products.filter((p) =>
    inSection(p, {
      tags: ["summer", "pool", "beach", "swim"],
      typeIncludes: ["bikini", "swim", "shorts", "crop top"],
    }),
  );

  // Winter line / cold-weather fits
  const winterTrap = products.filter((p) =>
    inSection(p, {
      tags: ["winter", "cold-weather", "winter-line"],
      typeIncludes: ["hoodie", "sweatshirt", "sweater", "beanie", "balaclava"],
    }),
  );

  return {
    nightOut,
    stayIn,
    bestSellers,
    featuredDrops,
    summerPool,
    winterTrap,
    everything: products,
  };
}

function formatPrice(product: TrapProduct) {
  if (!product.price) return null;

  const amount = parseFloat(product.price);
  if (Number.isNaN(amount)) return null;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} USD`;
  }
}

// ---------- UI helpers ----------

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-bebas text-xl tracking-[0.3em] uppercase text-primary">
          {title}
        </h2>
        <p className="tc-body-text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </header>
  );
}

function ProductGrid({ products }: { products: TrapProduct[] }) {
  if (!products.length) {
    return (
      <p className="tc-body-text-sm text-muted-foreground">
        Nothing in this section just yet. New drops are in the works.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const price = formatPrice(product);

        return (
          <article
            key={product.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm"
          >
            {/* Product image */}
            {product.imageUrl ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <Image
                  src={product.imageUrl}
                  alt={product.title || "Trap Culture product"}
                  fill
                  className="object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-muted/40">
                <span className="tc-body-text-sm text-muted-foreground">
                  Image coming soon
                </span>
              </div>
            )}

            {/* Body */}
            <div className="flex flex-1 flex-col gap-2 px-4 py-4">
              <h3 className="font-bebas text-lg tracking-[0.18em] uppercase">
                {product.title}
              </h3>

              {product.productType && (
                <p className="tc-body-text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {product.productType}
                </p>
              )}

              {price && (
                <p className="tc-body-text-sm font-medium text-primary">
                  {price}
                </p>
              )}

              <p className="tc-body-text-xs text-muted-foreground">
                Pieces built to keep you in rotation. Tap through for full
                sizing and details.
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ---------- Page ----------

export default async function ShopPage() {
  const products = await fetchTrapProducts();

  const {
    nightOut,
    stayIn,
    bestSellers,
    featuredDrops,
    summerPool,
    winterTrap,
    everything,
  } = splitBySections(products);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO / INTRO */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-8">
        <header className="space-y-3">
          <p className="tc-body-text-sm font-bebas tracking-[0.35em] uppercase text-primary">
            Trap Culture
          </p>

          <h1 className="font-bebas text-3xl tracking-[0.32em] uppercase sm:text-4xl">
            Trap DropSite
          </h1>

          <p className="tc-body-text max-w-2xl text-sm text-muted-foreground">
            Clothes \\ Accessories \\ Collabs and more — built for late nights,
            loud rooms and low-key smoke sessions.
          </p>
        </header>

        {/* Promo pill */}
        <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-xs">
          <span className="font-bebas tracking-[0.25em] uppercase text-primary">
            New drop
          </span>
          <span className="tc-body-text-sm text-muted-foreground">
            Winter Trap line is live. Start with a Night-out Fit or keep it
            chill with Stay-in Gear.
          </span>
        </div>
      </section>

      {/* SECTIONED STOREFRONT */}
      <section className="border-t border-border/60 bg-card/80">
        <div className="mx-auto max-w-6xl space-y-12 px-4 pb-20 pt-8 sm:px-6">
          {/* Night-out Fit */}
          <div>
            <SectionHeader
              title="Night-out Fit"
              subtitle="Pieces built for clubs, rooftops, festivals and any night that runs long."
            />
            <ProductGrid products={nightOut} />
          </div>

          {/* Stay-in Gear */}
          <div>
            <SectionHeader
              title="Stay-in Gear"
              subtitle="Cozy sets, hoodies and loungers for movie marathons and solo sessions."
            />
            <ProductGrid products={stayIn} />
          </div>

          {/* Pool & Summer Fits */}
          <div>
            <SectionHeader
              title="Pool & Summer Fits"
              subtitle="Bikinis, crops and matching sets built for pool days, festivals and beach runs."
            />
            <ProductGrid products={summerPool} />
          </div>

          {/* Winter Trap Line */}
          <div>
            <SectionHeader
              title="Winter Trap Line"
              subtitle="Hoodies, sweaters, beanies and balaclavas for cold nights and late lots."
            />
            <ProductGrid products={winterTrap} />
          </div>

          {/* Best Sellers */}
          <div>
            <SectionHeader
              title="Best Sellers"
              subtitle="Trap Culture staples that stay in heavy rotation."
            />
            <ProductGrid products={bestSellers} />
          </div>

          {/* Featured Drops */}
          <div>
            <SectionHeader
              title="Featured Drops"
              subtitle="Limited runs, collabs and experimental pieces from the Trap DropSite."
            />
            <ProductGrid products={featuredDrops} />
          </div>

          {/* Everything */}
          <div>
            <SectionHeader
              title="Everything"
              subtitle="Scroll the full Trap DropSite catalog in one go."
            />
            <ProductGrid products={everything} />
          </div>
        </div>
      </section>
    </main>
  );
}
