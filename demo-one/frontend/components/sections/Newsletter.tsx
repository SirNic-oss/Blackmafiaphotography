"use client";

export default function Newsletter() {
  return (
    <section className="py-40">
      <div
        className="
        max-w-4xl
        mx-auto
        p-10
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
      "
      >
        <h2 className="text-white text-5xl">
          Stay Updated
        </h2>

        <div className="flex gap-4 mt-10">
          <input
            placeholder="Email Address"
            className="
            flex-1
            bg-white/10
            rounded-full
            px-6
            py-4
            text-white
          "
          />

          <button
            className="
            bg-white
            text-black
            px-8
            rounded-full
          "
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
