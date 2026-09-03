import React from "react";
import { ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ClosingBand() {
  const { navigateTo, t } = useApp();

  return (
    <section className="w-full py-12 bg-[#FAFBF8] border-t border-[#E8EFE6]">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        {/* Action Link / Button */}
        <div>
          <button
            onClick={() => navigateTo("book-slot")}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#1B4318] hover:text-[#2E7D32] transition-colors group cursor-pointer"
          >
            <span>{t("btnBookSlot")}</span>
            <ArrowRight className="w-4 h-4 text-[#2E7D32] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Minimal Copyright Notice */}
        <div className="pt-6 border-t border-gray-100 text-[11px] text-gray-500 font-medium flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t("copyright")}</span>
          <span className="text-gray-400">{t("brandTagline")}</span>
        </div>
      </div>
    </section>
  );
}
