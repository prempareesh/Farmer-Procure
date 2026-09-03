import React from "react";
import { User, Sprout, ArrowRight, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FinalCtaBand() {
  const { navigateTo, currentLang, setLanguageModalOpen, t } = useApp();

  return (
    <footer
      id="get-started"
      className="w-full bg-[#FAFBF8] border-t border-[#E8EFE6]"
    >
      {/* FINAL CTA SECTION */}
      <div className="py-16 lg:py-20 px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            {t("finalCtaTitle")}
          </h2>
          <p className="text-sm font-semibold text-gray-600">
            {t("closingSubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* Primary CTA: Login / Get Started */}
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <User className="w-4 h-4 text-[#F9A825]" />
            <span>{t("btnGetStarted")}</span>
          </button>

          {/* Secondary CTA: Create Farmer ID */}
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 text-[#111827] font-bold text-sm border border-gray-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <span>{t("btnCreateId")}</span>
            <ArrowRight className="w-4 h-4 text-[#2E7D32]" />
          </button>
        </div>
      </div>

      {/* MINIMAL FOOTER */}
      <div className="py-6 px-6 lg:px-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1B4318] flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-[#111827] text-sm">
              {t("brandName")}
            </span>
            <span>•</span>
            <span>{t("copyright")}</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguageModalOpen(true)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span className="uppercase">{currentLang}</span>
            </button>

            <button
              onClick={() => navigateTo("auth")}
              className="text-[#1B4318] hover:underline font-bold cursor-pointer"
            >
              {t("login")} →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
