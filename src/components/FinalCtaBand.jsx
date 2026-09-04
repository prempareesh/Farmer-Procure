import React from "react";
import { User, Sprout, ArrowRight, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FinalCtaBand() {
  const { navigateTo, currentLang, setLanguageModalOpen, t } = useApp();

  return (
    <footer
      id="get-started"
      className="w-full bg-[#050805] border-t border-[#1A2E1E]"
    >
      {/* FINAL CTA SECTION */}
      <div className="py-20 lg:py-28 px-6 lg:px-12 max-w-6xl mx-auto text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-[11px] font-mono text-[#79C267] uppercase tracking-[0.25em]">
            OPERATIONAL ACCESS
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F2F0E8] tracking-tight leading-[1.15]">
            {t("finalCtaTitle")}
          </h2>
          <p className="text-base text-[#A6ADA3] max-w-xl mx-auto font-sans leading-relaxed">
            {t("closingSubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {/* Primary CTA: Login / Get Started */}
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-widest border border-[#79C267]/30 transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-[#79C267]" />
            <span>{t("btnGetStarted")}</span>
          </button>

          {/* Secondary CTA: Create Farmer ID */}
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-sm bg-[#071008] hover:bg-[#0A120C] text-[#E8E7DE] font-mono text-xs uppercase tracking-widest border border-[#1A2E1E] transition-all cursor-pointer"
          >
            <span>{t("btnCreateId")}</span>
            <ArrowRight className="w-4 h-4 text-[#79C267]" />
          </button>
        </div>
      </div>

      {/* MINIMAL FOOTER */}
      <div className="py-6 px-6 lg:px-12 border-t border-[#1A2E1E] bg-[#071008]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A6ADA3]">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#164A29] flex items-center justify-center border border-[#79C267]/30">
              <Sprout className="w-3.5 h-3.5 text-[#79C267]" />
            </div>
            <span className="font-serif text-[#F2F0E8] text-sm tracking-wide">
              {t("brandName")}
            </span>
            <span className="text-[#1A2E1E]">|</span>
            <span className="text-[11px] text-[#A6ADA3]">
              {t("copyright")}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setLanguageModalOpen(true)}
              className="flex items-center gap-1.5 text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#79C267]" />
              <span className="uppercase">{currentLang}</span>
            </button>

            <button
              onClick={() => navigateTo("auth")}
              className="text-[#79C267] hover:underline font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              {t("login")} →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

