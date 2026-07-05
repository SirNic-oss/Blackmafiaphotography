"use client";

export default function Testimonials() {
  return (
    <section className="py-40">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-6xl">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/5 p-8 rounded-3xl">
            <p className="text-white">
              Incredible quality.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl">
            <p className="text-white">
              Best shoes I've owned.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl">
            <p className="text-white">
              Luxury from start to finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}