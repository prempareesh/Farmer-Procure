import React from "react";
import { ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ClosingBand() {
  const { navigateTo, t } = useApp();

  return (
    <section className="w-full py-12 bg-[#050805] text-[#E8E7DE] border-t border-[#1A2E1E] font-mono">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        {/* Action Link / Button */}
        <div>
          <button
            onClick={() => navigateTo("book-slot")}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-serif text-[#F2F0E8] hover:text-[#79C267] transition-colors group cursor-pointer"
          >
            <span>{t("btnBookSlot")}</span>
            <ArrowRight className="w-4 h-4 text-[#79C267] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Minimal Copyright Notice */}
        <div className="pt-6 border-t border-[#1A2E1E] text-[11px] text-[#A6ADA3] font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t("copyright")}</span>
          <span className="text-[#A6ADA3]/60">{t("brandTagline")}</span>
        </div>
      </div>
    </section>
  );
}
