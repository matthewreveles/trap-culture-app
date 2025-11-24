// src/app/page.tsx
import Image from "next/image";

export const revalidate = 600;
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-96px-64px)] flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-8">
        {/* Centered Trappy face logo with Suns gradient background */}
        <div className="flex items-center justify-center">
          <Image
            src="/trapcultureface.webp"
            alt="Trap Culture"
            width={320}
            height={320}
            priority
            className="rounded-full bg-transparent drop-shadow-[0_0_35px_rgba(58,17,78,0.95)]"
          />
        </div>
        {/* Removed horizontal logo with face */}
      </div>
    </main>
  );
}
