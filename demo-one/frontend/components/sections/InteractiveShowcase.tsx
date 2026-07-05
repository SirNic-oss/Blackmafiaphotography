"use client";

import { useEffect, useState } from "react";

export default function InteractiveShowcase() {
  const [position, setPosition] =
    useState({
      x: 0,
      y: 0,
    });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener(
        "mousemove",
        move
      );
    };
  }, []);

  return (
    <section className="h-screen relative overflow-hidden">
      <div
        className="
        absolute
        w-96
        h-96
        rounded-full
        blur-3xl
        bg-white/10
      "
        style={{
          left: position.x - 150,
          top: position.y - 150,
        }}
      />

      <div className="relative z-10 h-full flex items-center justify-center">
        <h2 className="text-7xl text-white">
          Interactive Experience
        </h2>
      </div>
    </section>
  );
}