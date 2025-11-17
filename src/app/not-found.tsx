export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24 text-center space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-white/70">
        That page isn’t live yet. Try the menu or head back to{" "}
        <a href="/" className="underline text-gradient">Home</a>.
      </p>
    </main>
  );
}
