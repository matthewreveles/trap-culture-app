// src/app/about/page.tsx

export const metadata = {
  title: "About • Trap Culture",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-24">
      {/* Heading */}
      <header className="mb-6">
        <h1 className="tc-about-heading font-bebas text-3xl tracking-[0.22em]">
          ABOUT
        </h1>
      </header>

      {/* Body card – orange in light, glassy in dark */}
      <section
        className="
          tc-about-card
          rounded-3xl border
          px-5 py-6 sm:px-7 sm:py-8
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
