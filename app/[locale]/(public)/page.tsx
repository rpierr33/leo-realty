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
import { FaqSection } from "@/components/seo/FaqSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("homeTitle"), description: t("homeDescription") };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tFaq = await getTranslations({ locale, namespace: "FaqHome" });
  const tSection = await getTranslations({ locale, namespace: "FaqSection" });

  const faqItems = [
    { question: tFaq("q1"), answer: tFaq("a1") },
    { question: tFaq("q2"), answer: tFaq("a2") },
    { question: tFaq("q3"), answer: tFaq("a3") },
    { question: tFaq("q4"), answer: tFaq("a4") },
    { question: tFaq("q5"), answer: tFaq("a5") },
    { question: tFaq("q6"), answer: tFaq("a6") },
  ];

  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProgramsSection />
      <FeaturedListings />
      <HomeValuationCTA />
      <SavingsCalculator />
      <TeamPreview />
      <MortgageCalculator />
      <TestimonialsSection />
      <FaqSection label={tSection("label")} items={faqItems} />
      <CTABanner />
    </>
  );
}
