// src/app/about/page.tsx

export const metadata = {
  title: "About • Trap Culture",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-24">
      {/* Heading */}
      <header className="mb-6">
        <h1 className="font-bebas text-3xl tracking-[0.22em] text-trap-purple-dark dark:text-white">
          ABOUT
        </h1>
      </header>

      {/* Body card – orange in light, glassy in dark */}
      <section
        className="
          rounded-3xl border
          bg-trap-orange-soft/90 text-trap-purple-dark
          px-5 py-6 sm:px-7 sm:py-8
          shadow-[0_18px_40px_rgba(0,0,0,0.35)]
          border-trap-purple-dark/12

          dark:bg-black/40 dark:text-gray-100 dark:border-white/10
        "
      >
        <p className="text-sm leading-relaxed tracking-[0.06em] sm:text-base">
          TRAP CULTURE BRIDGES ARIZONA&apos;S UNDERGROUND CREATIVE SCENE WITH A
          COMMUNITY-FIRST APPROACH TO ARTS, CANNABIS, MUSIC, AND EVENTS. OUR
          PLATFORM LIFTS LOCAL VOICES, DOCUMENTS CULTURE, AND AMPLIFIES THE
          MOVEMENTS SHAPING THE VALLEY.
        </p>

        <p className="mt-5 text-sm leading-relaxed tracking-[0.06em] sm:text-base">
          WHETHER THROUGH LIVE EVENTS, OUR TRAP NEWS BLOG, OR COLLABORATIONS
          ACROSS THE CITY, WE BUILD SPACES WHERE AUTHENTICITY THRIVES.
        </p>
      </section>
    </div>
  );
}
