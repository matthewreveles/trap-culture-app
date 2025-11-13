export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-gradient-to-b from-zinc-900/30 to-black">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-white/70">
        © {new Date().getFullYear()} Trap Culture. All rights reserved.
      </div>
    </footer>
  );
}
