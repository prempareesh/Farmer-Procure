import React from "react";
import { Sprout, Globe, ArrowUpRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

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
    <footer className="w-full bg-[#111C10] text-[#FAFBF8] border-t border-[#1F331D] selection:bg-[#2E7D32] selection:text-white">
      {/* LAYER 1: MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* BRAND COLUMN (Left: 5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825] border border-white/15">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block">
                  {t("brandName")}
                </span>
                <span className="text-[11px] text-[#A5D6A7] font-semibold">
                  {t("brandTagline")}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-normal max-w-md">
              {t("footerDesc")}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-[#A5D6A7] font-mono font-medium">
                ≡ƒî▒ {t("footerProjectTag")}
              </span>
            </div>
          </div>

          {/* NAVIGATION COLUMNS (Right: 7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* COLUMN 1: QUICK ACCESS */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-[#A5D6A7] uppercase tracking-wider">
                {t("footerNavQuickAccess")}
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold text-white/80">
                <li>
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavHome")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavHowItWorks")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("auth")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 text-[#F9A825] cursor-pointer"
                  >
                    <span>{t("footerNavSignIn")}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: FOR FARMERS */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-[#A5D6A7] uppercase tracking-wider">
                {t("footerNavForFarmers")}
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold text-white/80">
                <li>
                  <button
                    onClick={() => navigateTo("book-slot")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavBookSlot")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("queue")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavLiveQueue")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("farmer-dash")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavFarmerPortal")}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: PLATFORM */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-[11px] font-black text-[#A5D6A7] uppercase tracking-wider">
                {t("footerNavPlatform")}
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold text-white/80">
                <li>
                  <button
                    onClick={() => scrollToSection("problem")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavAbout")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("benefits")}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavFeatures")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("footerNavContact")}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 2: BOTTOM LEGAL & COPYRIGHT STRIP */}
      <div className="border-t border-white/10 bg-[#0B120B] py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/60">
          {/* Copyright Notice */}
          <div className="text-center sm:text-left">
            <span>{t("footerCopyright")}</span>
          </div>

          {/* Legal Links & Language Selector */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-white/60">
              <span className="hover:text-white cursor-pointer">
                {t("footerPrivacy")}
              </span>
              <span>ΓÇó</span>
              <span className="hover:text-white cursor-pointer">
                {t("footerTerms")}
              </span>
              <span>ΓÇó</span>
              <span className="hover:text-white cursor-pointer">
                {t("footerAccessibility")}
              </span>
            </div>

            {/* Language Trigger */}
            <button
              onClick={() => setLanguageModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-xs font-bold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#F9A825]" />
              <span className="uppercase">{currentLang}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
