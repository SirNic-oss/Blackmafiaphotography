"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden px-6">
      <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=90" alt="Celebration captured in warm light" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="max-w-7xl mx-auto w-full z-10">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display max-w-3xl text-white text-5xl md:text-7xl leading-tight"
        >
          Photographs that feel like you
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-zinc-300 mt-5 text-xl md:text-2xl"
        >
          Lumen Studio documents celebrations, connection and the beautifully ordinary moments in between.
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/booking"
            className="inline-block mt-10 px-8 py-4 rounded-full bg-white text-black font-medium"
          >
            Book a session
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
