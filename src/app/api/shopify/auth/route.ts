import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") ?? "";

  // This is where we actually want the embedded iframe to land.
  // You can change this to /dashboard or whatever later.
  const redirectUrl = new URL("https://trap-culture-app.vercel.app/", url);

  if (shop) {
    redirectUrl.searchParams.set("shop", shop);
  }
  redirectUrl.searchParams.set("embedded", "1");

  return Response.redirect(redirectUrl.toString(), 302);
}
