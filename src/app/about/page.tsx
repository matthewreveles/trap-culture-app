// src/app/about/page.tsx
export const metadata = {
  title: "About • Trap Culture",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-28 space-y-8">
      <header className="space-y-3">
        <h1 className="text-[42px] leading-none font-extrabold tracking-tight">
          <span className="tc-gradient-text">About</span>
        </h1>

        <div className="tc-gradient-line" />
      </header>

      <p className="text-white/80 leading-relaxed">
        Trap Culture bridges Arizona’s underground creative scene with a
        community-first approach to arts, cannabis, music, and events. Our
        platform lifts local voices, documents culture, and amplifies the
        movements shaping the Valley.
      </p>

      <p className="text-white/70 leading-relaxed">
        Whether through live events, our Trap News blog, or collaborations
        across the city, we build spaces where authenticity thrives.
      </p>
    </main>
  );
}
