import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("homeTitle"), description: t("homeDescription") };
}

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
