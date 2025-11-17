"use client";

import { useEffect, useRef } from "react";

export default function BuyButtonAllProducts() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptURL =
      "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    function loadSdk(): Promise<void> {
      if ((window as any).ShopifyBuy && (window as any).ShopifyBuy.UI)
        return Promise.resolve();
      return new Promise((resolve) => {
        const s = document.createElement("script");
        s.async = true;
        s.src = scriptURL;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });
    }

    loadSdk().then(() => {
      const ShopifyBuy = (window as any).ShopifyBuy;
      const UI = ShopifyBuy.UI;

      const client = ShopifyBuy.buildClient({
        domain: "trap-culture-promotions.myshopify.com",
        storefrontAccessToken: "6a98b5d960fdd05356beab2f1e3d5b1b",
      });

      UI.onReady(client).then((ui: any) => {
        ui.createComponent("collection", {
          id: "344808423577", // All Products collection ID
          node: containerRef.current,
          moneyFormat: "%24%7B%7Bamount%7D%7D",
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(25% - 20px)",
                    "margin-left": "20px",
                    "margin-bottom": "50px",
                    "width": "calc(25% - 20px)",
                  },
                  img: {
                    "height": "calc(100% - 15px)",
                    "position": "absolute",
                    "left": "0",
                    "right": "0",
                    "top": "0",
                  },
                  imgWrapper: {
                    "padding-top": "calc(75% + 15px)",
                    "position": "relative",
                    "height": "0",
                  },
                },
                button: {
                  ":hover": { "background-color": "#d34bb2" },
                  "background-color": "#ea53c6",
                  ":focus": { "background-color": "#d34bb2" },
                  "border-radius": "40px",
                  "padding-left": "11px",
                  "padding-right": "11px",
                },
              },
              text: { button: "Add to cart" },
            },
            productSet: {
              styles: {
                products: {
                  "@media (min-width: 601px)": { "margin-left": "-20px" },
                },
              },
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true,
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px",
                  },
                },
                button: {
                  ":hover": { "background-color": "#d34bb2" },
                  "background-color": "#ea53c6",
                  ":focus": { "background-color": "#d34bb2" },
                  "border-radius": "40px",
                  "padding-left": "11px",
                  "padding-right": "11px",
                },
              },
              text: { button: "Add to cart" },
            },
            cart: {
              styles: {
                button: {
                  ":hover": { "background-color": "#d34bb2" },
                  "background-color": "#ea53c6",
                  ":focus": { "background-color": "#d34bb2" },
                  "border-radius": "40px",
                },
              },
              text: { total: "Subtotal", button: "Checkout" },
            },
            toggle: {
              styles: {
                toggle: {
                  "background-color": "#ea53c6",
                  ":hover": { "background-color": "#d34bb2" },
                  ":focus": { "background-color": "#d34bb2" },
                },
              },
            },
          },
        });
      });
    });
  }, []);

  return <div ref={containerRef} className="min-h-[800px]" />;
}
