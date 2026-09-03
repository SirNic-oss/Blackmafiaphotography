
import HeroSection from "@/components/sections/HeroSection";
import Testimonials from "@/components/sections/Testimonials";
import Link from "next/link";
import PortfolioGrid from "@/components/photography/PortfolioGrid";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="px-6 py-24"><div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-[1fr_1.1fr]"><div><p className="text-sm uppercase tracking-[0.25em] text-zinc-500">The Lumen approach</p><h2 className="mt-4 text-4xl font-semibold md:text-5xl">Natural direction. Lasting photographs.</h2></div><p className="max-w-xl self-end text-lg leading-8 text-zinc-400">From quiet portrait sessions to full-day celebrations, every experience is unhurried, collaborative and shaped around the people in front of the camera.</p></div></section>
      <section className="px-6 py-20"><div className="max-w-7xl mx-auto"><div className="mb-10 flex items-end justify-between gap-5"><div><p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Selected work</p><h2 className="mt-3 text-4xl font-semibold">Recent stories</h2></div><Link href="/portfolio" className="text-sm underline underline-offset-4">View portfolio</Link></div><PortfolioGrid limit={3} /></div></section>
      <Testimonials />
      <section className="px-6 pb-20"><div className="max-w-5xl mx-auto rounded-3xl bg-white p-10 text-black md:p-16"><p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Make it yours</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold md:text-5xl">Ready to create something meaningful?</h2><Link href="/booking" className="mt-8 inline-block rounded-full bg-black px-7 py-4 text-white">Book a session</Link></div></section>
    </>
  );
}
