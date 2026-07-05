import Link from "next/link";

export default function StoryPage() {
  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-6xl font-bold mb-8">Our Story</h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-6">
          Demo One began with a simple belief: footwear should feel as
          refined as it looks. Every silhouette is designed for movement,
          crafted with premium materials, and finished with obsessive
          attention to detail.
        </p>
        <p className="text-zinc-400 text-lg leading-relaxed mb-10">
          From the studio to the street, we build collections that balance
          luxury aesthetics with everyday performance — so you never have to
          choose between style and comfort.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-4 rounded-full bg-white text-black font-medium hover:opacity-90 transition-opacity"
        >
          Shop the collection
        </Link>
      </div>
    </main>
  );
}
