// src/lib/tcShopData.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_TC_STORE_API_BASE_URL || "http://localhost:3000";

type TrapProduct = {
  id: string;
  handle: string;
  title: string;
  productType?: string;
  descriptionHtml?: string;
  availableForSale?: boolean;
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  tags?: string[];
};

export async function getTrapProducts(): Promise<TrapProduct[]> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `[TC Shop Data] ${res.status} ${res.statusText} when fetching /api/products`
    );
  }

  const json = await res.json();

  if (!json.ok) {
    throw new Error(
      `[TC Shop Data] API responded with error: ${json.error ?? "unknown"}`
    );
  }

  return json.products as TrapProduct[];
}
