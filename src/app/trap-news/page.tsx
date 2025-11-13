// src/app/trap-news/page.tsx
export const revalidate = 600;
export const dynamic = "force-static";
export const runtime = "nodejs";

import { fetchTrapNewsPage } from "@/lib/trapNews";
import NewsListClient from "@/components/NewsListClient";
import FitHeading from "@/components/FitHeading";
import FitText from "@/components/FitText";

export default async function TrapNewsPage() {
  const pageSize = 10;
  const initialItems = await fetchTrapNewsPage(1, pageSize);

  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-28 space-y-8">
      {/* ───── Hero Header ───── */}
      <header className="text-center space-y-6">
        {/* Responsive auto-fitting headline */}
        <FitHeading
          className="mx-auto max-w-full"
          min={56}
          max={180}
        />

        {/* Responsive tagline with gradient + underline “Lit” */}
        <FitText
          className="mx-auto max-w-full text-white/80"
          min={16}
          max={28}
          style={{
            fontWeight: 500,
            letterSpacing: "-0.015em",
            fontStyle: "italic",
          }}
        >
          <span>All the news that’s </span>
          <span className="tc-underline-grad">
            <span className="tc-gradient-text font-extrabold italic">
              Lit
            </span>
          </span>
          <span> to print!</span>
        </FitText>

        {/* Divider line using global gradient */}
      </header>

      {/* ───── Content Feed ───── */}
      {!initialItems.length ? (
        <p className="text-white/70 text-center">
          No posts found yet. Check back soon.
        </p>
      ) : (
        <NewsListClient
          initialItems={initialItems}
          initialPage={1}
          pageSize={pageSize}
        />
      )}
    </main>
  );
}
