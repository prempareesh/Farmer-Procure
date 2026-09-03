import React from "react";
import { User, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function HeroSection() {
  const { navigateTo, t } = useApp();

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full flex items-center min-h-[82vh] lg:min-h-[85vh] z-10 py-12 lg:py-16 overflow-hidden bg-[#FAFBF8] border-b border-[#E8EFE6]"
    >
      {/* 1. RIGHT-ALIGNED NATURAL FARMER & OXEN IMAGE ZONE */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[54%] pointer-events-none overflow-hidden z-0">
        <img
          src="/farmer_ultra_green.jpg"
          alt="Traditional Indian Farmer with oxen in emerald green field at sunrise"
          className="w-full h-full object-cover object-[75%_center] filter brightness-[1.01] contrast-[1.05] saturate-[1.1]"
        />

        {/* Soft Left-Edge Transition Blend to #FAFBF8 */}
        <div className="absolute left-0 inset-y-0 w-32 lg:w-56 bg-gradient-to-r from-[#FAFBF8] via-[#FAFBF8]/80 to-transparent" />

        {/* Top and Bottom Clean Fades */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#FAFBF8] via-[#FAFBF8]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#FAFBF8] via-[#FAFBF8]/40 to-transparent" />
      </div>

      {/* 2. LEFT CONTENT ZONE */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-xl lg:max-w-2xl space-y-6">
          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.08]">
              {t("heroHeadline1")} <br />
              <span className="text-[#1B4318]">{t("heroHeadline2")}</span>
            </h1>
          </div>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed max-w-lg">
            {t("heroDescription")}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            {/* Primary: Login / Get Started */}
            <button
              onClick={() => navigateTo("auth")}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#F9A825]" />
              <span>{t("btnGetStarted")}</span>
            </button>

            {/* Secondary: See How It Works */}
            <button
              onClick={scrollToHowItWorks}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#111827] font-bold text-sm border border-gray-300 shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <span>{t("btnHowItWorks")}</span>
              <ArrowRight className="w-4 h-4 text-[#2E7D32]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
