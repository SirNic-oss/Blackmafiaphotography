
import HeroSection from "@/components/sections/HeroSection";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import LuxuryGrid from "@/components/sections/LuxuryGrid";
import InteractiveShowcase from "@/components/sections/InteractiveShowcase";
import BrandStory from "@/components/sections/BrandStory";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <FeaturedCollection />

      <LuxuryGrid />

      <InteractiveShowcase />

      <BrandStory />

      <Testimonials />

      <Newsletter />
    </>
  );
}