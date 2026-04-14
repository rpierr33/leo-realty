import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import ProgramsSection from "@/components/home/ProgramsSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import TeamPreview from "@/components/home/TeamPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import MortgageCalculator from "@/components/home/MortgageCalculator";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Leo Realty Capital Investments | South Florida Real Estate & Mortgage",
  description:
    "Leo Realty Inc — MR 2% | 32 Years In Business | No One Does It Better. Buy, sell, rent and finance your dream home with South Florida's most trusted brokerage.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProgramsSection />
      <FeaturedListings />
      <TeamPreview />
      <MortgageCalculator />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}
