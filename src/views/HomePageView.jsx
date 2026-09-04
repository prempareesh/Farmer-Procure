import React from "react";
import HomeHeader from "../components/home/HomeHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import HomeProblemSection from "../components/home/HomeProblemSection";
import HomeSolutionFlowSection from "../components/home/HomeSolutionFlowSection";
import HomeHowAgriProcureWorks from "../components/home/HomeHowAgriProcureWorks";
import HomeBenefitsSection from "../components/home/HomeBenefitsSection";
import HomeTrustSection from "../components/home/HomeTrustSection";
import HomeFinalCtaBand from "../components/home/HomeFinalCtaBand";
import HomeFooter from "../components/home/HomeFooter";

export default function HomePageView() {
  return (
    <div className="min-h-screen w-full bg-[#FAFBF8] text-[#111827] flex flex-col justify-between font-sans selection:bg-[#2E7D32] selection:text-white">
      {/* 1. Restored Light Navigation Header */}
      <HomeHeader />

      {/* 2. Restored Light Home Page Content Sections */}
      <main className="flex-1 flex flex-col justify-between overflow-x-hidden">
        <HomeHeroSection />
        <HomeProblemSection />
        <HomeSolutionFlowSection />
        <HomeHowAgriProcureWorks />
        <HomeBenefitsSection />
        <HomeTrustSection />
        <HomeFinalCtaBand />
      </main>

      {/* 3. Restored Light Home Footer */}
      <HomeFooter />
    </div>
  );
}
