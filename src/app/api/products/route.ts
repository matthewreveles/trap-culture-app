// app/api/products/route.ts
import { NextResponse } from "next/server";

const STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ??
  process.env.SHOPIFY_STORE_DOMAIN ??
  "trap-culture-promotions.myshopify.com";

type ShopifyProductJson = {
  id: number;
  handle: string;
  title: string;
  body_html: string;
  product_type: string;
  tags: string;
  images: { src: string }[];
  variants: {
    id: number;
    title: string;
    price: string;
    sku: string | null;
    available: boolean;
  }[];
};

type ProductSummary = {
  id: number;
  handle: string;
  title: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  price: string | null;
  imageUrl: string | null;
};

function normalizeProduct(p: ShopifyProductJson): ProductSummary {
  const firstVariant = p.variants[0];

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.body_html,
    productType: p.product_type,
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
    price: firstVariant?.price ?? null,
    imageUrl: p.images[0]?.src ?? null,
  };
}

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function GET() {
  try {
    const url = `https://${STORE_DOMAIN}/products.json?limit=250`;

    const res = await fetch(url, {
      // server-side fetch; no CORS issues here
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[/api/products] Shopify HTTP error:", res.status, text);
      return withCors(
        NextResponse.json(
          { ok: false, error: "Failed to fetch products from Shopify" },
          { status: 500 }
        )
      );
    }

    const json = (await res.json()) as { products: ShopifyProductJson[] };
    const products = json.products.map(normalizeProduct);

    return withCors(
      NextResponse.json(
        {
          ok: true,
          count: products.length,
          products,
        },
        { status: 200 }
      )
    );
  } catch (error: any) {
    console.error("[/api/products] Error:", error);
    return withCors(
      NextResponse.json(
        {
          ok: false,
          error: error?.message || "Unknown error",
        },
        { status: 500 }
      )
    );
  }
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}
