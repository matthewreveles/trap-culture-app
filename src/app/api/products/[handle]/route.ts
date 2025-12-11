// app/api/products/[handle]/route.ts
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

type ProductDetail = {
  id: number;
  handle: string;
  title: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  images: string[];
  variants: {
    id: number;
    title: string;
    price: string;
    available: boolean;
    sku: string | null;
  }[];
};

function normalizeProduct(p: ShopifyProductJson): ProductDetail {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.body_html,
    productType: p.product_type,
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
    images: p.images.map((img) => img.src),
    variants: p.variants.map((v) => ({
      id: v.id,
      title: v.title,
      price: v.price,
      available: v.available,
      sku: v.sku,
    })),
  };
}

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// Note the Promise in params to keep Next 16 happy
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    const url = `https://${STORE_DOMAIN}/products/${handle}.json`;
    const res = await fetch(url, { cache: "no-store" });

    if (res.status === 404) {
      return withCors(
        NextResponse.json(
          { ok: false, error: "Product not found" },
          { status: 404 }
        )
      );
    }

    if (!res.ok) {
      const text = await res.text();
      console.error(
        `[/api/products/${handle}] Shopify HTTP error:`,
        res.status,
        text
      );
      return withCors(
        NextResponse.json(
          { ok: false, error: "Failed to fetch product from Shopify" },
          { status: 500 }
        )
      );
    }

    const json = (await res.json()) as { product: ShopifyProductJson };
    const product = normalizeProduct(json.product);

    return withCors(
      NextResponse.json(
        {
          ok: true,
          product,
        },
        { status: 200 }
      )
    );
  } catch (error: any) {
    console.error("[/api/products/[handle]] Error:", error);
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
