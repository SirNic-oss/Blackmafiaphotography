"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BrandStory() {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      imageRef.current.style.transform =
        `translateY(${window.scrollY * 0.2}px)`;
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <section
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-10
    "
    >
      <div className="grid md:grid-cols-2 gap-20">
        <div>
          <h2 className="text-white text-6xl">
            Our Story
          </h2>

          <p className="text-zinc-400 mt-10">
            Crafted luxury footwear designed
            for movement, confidence and
            timeless style.
          </p>
        </div>

        <img
          ref={imageRef}
          src="/products/story.jpg"
          alt="story"
          className="rounded-3xl"
        />
      </div>
    </section>
  );
}