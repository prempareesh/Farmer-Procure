import React from "react";
import { Sprout, Globe, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const {
    navigateTo,
    currentView,
    currentLang,
    setLanguageModalOpen,
    setContactModalOpen,
    t,
  } = useApp();

  const scrollToSection = (id) => {
    if (currentView !== "home") {
      navigateTo("home");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#050805] text-[#E8E7DE] border-t border-[#1A2E1E]">
      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* BRAND COLUMN */}
          <div className="lg:col-span-5 space-y-4">
            <div
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-[#12351F] border border-[#1A2E1E] flex items-center justify-center text-[#79C267]">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-normal text-[#F2F0E8] tracking-wider">
                AGRIPROCURE
              </span>
            </div>

            <p className="text-xs text-[#A6ADA3] leading-relaxed max-w-md">
              {t("footerDesc")}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#071008] border border-[#1A2E1E] text-[11px] text-[#79C267] font-mono">
                {t("footerProjectTag")}
              </span>
            </div>
          </div>

          {/* NAVIGATION COLUMNS */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* COLUMN 1: QUICK ACCESS */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#79C267] uppercase tracking-widest">
                {t("footerNavQuickAccess")}
              </h4>
              <ul className="space-y-2 text-xs font-medium text-[#A6ADA3]">
                <li>
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavHome")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavHowItWorks")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("auth")}
                    className="hover:text-[#79C267] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavSignIn")}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: FOR FARMERS */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#79C267] uppercase tracking-widest">
                {t("footerNavForFarmers")}
              </h4>
              <ul className="space-y-2 text-xs font-medium text-[#A6ADA3]">
                <li>
                  <button
                    onClick={() => navigateTo("book-slot")}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavBookSlot")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("queue")}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavLiveQueue")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("farmer-dash")}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavFarmerPortal")}
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: PLATFORM */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-[11px] font-bold text-[#79C267] uppercase tracking-widest">
                {t("footerNavPlatform")}
              </h4>
              <ul className="space-y-2 text-xs font-medium text-[#A6ADA3]">
                <li>
                  <button
                    onClick={() => scrollToSection("problem")}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavAbout")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("benefits")}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavFeatures")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="hover:text-[#F2F0E8] transition-colors cursor-pointer"
                  >
                    {t("footerNavContact")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL STRIP */}
      <div className="border-t border-[#1A2E1E] bg-[#071008] py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#A6ADA3]">
          <div className="text-center sm:text-left">
            <span>{t("footerCopyright")}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[#A6ADA3]">
              <span className="hover:text-[#F2F0E8] cursor-pointer">
                {t("footerPrivacy")}
              </span>
              <span>•</span>
              <span className="hover:text-[#F2F0E8] cursor-pointer">
                {t("footerTerms")}
              </span>
              <span>•</span>
              <span className="hover:text-[#F2F0E8] cursor-pointer">
                {t("footerAccessibility")}
              </span>
            </div>

            <button
              onClick={() => setLanguageModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#12351F] text-[#F2F0E8] hover:bg-[#164A29] border border-[#1A2E1E] transition-colors text-xs font-bold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#79C267]" />
              <span className="uppercase">{currentLang}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
