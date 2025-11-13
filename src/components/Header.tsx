"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="pt-8 md:pt-12">
      <section className="mx-auto max-w-7xl px-6">
        <div className="mx-auto w-full flex items-center justify-center">
          <Image
            src="/trapcultureface.webp"
            alt="Trap Culture mascot"
            width={640}
            height={640}
            priority
            className="hero-glow w-64 sm:w-80 md:w-96 lg:w-[28rem] h-auto"
          />
        </div>
      </section>
    </header>
  );
}
