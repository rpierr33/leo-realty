import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import ProgramsSection from "@/components/home/ProgramsSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import TeamPreview from "@/components/home/TeamPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import MortgageCalculator from "@/components/home/MortgageCalculator";
import CTABanner from "@/components/home/CTABanner";
import HomeValuationCTA from "@/components/home/HomeValuationCTA";
import SavingsCalculator from "@/components/home/SavingsCalculator";

export const metadata: Metadata = {
  title: "Leo Realty Capital Investments | South Florida Real Estate",
  description:
    "Leo Realty Inc — MR 2% | 32 Years In Business | No One Does It Better. Buy, sell, and rent with South Florida's most trusted brokerage. Mortgage financing through our partner KLE Mortgage.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProgramsSection />
      <FeaturedListings />
      {/* Lead magnet between featured properties and testimonials */}
      <HomeValuationCTA />
      <SavingsCalculator />
      <TeamPreview />
      <MortgageCalculator />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}
