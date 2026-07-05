"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="h-screen flex items-center justify-center relative">
      <div className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-7xl font-bold"
        >
          Luxury Footwear
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-300 mt-5"
        >
          Crafted for movement.
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/shop"
            className="inline-block mt-10 px-8 py-4 rounded-full bg-white text-black font-medium"
          >
            Shop Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}