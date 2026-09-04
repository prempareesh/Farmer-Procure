import React from "react";
import HomeHeader from "../components/home/HomeHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import HomeProblemSection from "../components/home/HomeProblemSection";
import HomeSolutionFlowSection from "../components/home/HomeSolutionFlowSection";
import HomeCentreFinderSection from "../components/home/HomeCentreFinderSection";
import HomeIdentityVerificationSection from "../components/home/HomeIdentityVerificationSection";
import HomeFinalCtaBand from "../components/home/HomeFinalCtaBand";
import HomeFooter from "../components/home/HomeFooter";

export default function HomePageView() {
  return (
    <div className="min-h-screen w-full bg-[#050705] text-[#F1EFE6] flex flex-col justify-between font-sans selection:bg-[#12351F] selection:text-[#79C267]">
      {/* 1. Dark Navigation Header */}
      <HomeHeader />

      {/* 2. Premium Black + Deep Green Home Page Sections */}
      <main className="flex-1 flex flex-col justify-between overflow-x-hidden">
        <HomeHeroSection />
        <HomeProblemSection />
        <HomeSolutionFlowSection />
        <HomeCentreFinderSection />
        <HomeIdentityVerificationSection />
        <HomeFinalCtaBand />
      </main>

      {/* 3. Dark Home Footer */}
      <HomeFooter />
    </div>
  );
}
