// src/app/page.tsx
import Image from "next/image";

export const revalidate = 600;
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-96px-64px)] flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-8">
        {/* Centered Trappy face logo */}
        <Image
          src="/trapcultureface.webp"
          alt="Trap Culture"
          width={320}
          height={320}
          priority
          className="drop-shadow-[0_0_80px_rgba(232,87,255,0.7)]"
        />

        {/* Optional smaller horizontal logo with face, above footer */}
        <Image
          src="/trapculturehorizwithface.png"
          alt="Trap Culture Trap News"
          width={260}
          height={80}
          className="mt-4 opacity-80"
        />
      </div>
    </main>
  );
}
