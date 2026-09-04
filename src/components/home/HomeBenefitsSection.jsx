import React from "react";
import { useApp } from "../../context/AppContext";

export default function BenefitsSection() {
  const { t } = useApp();

  return (
    <section
      id="benefits"
      className="w-full py-12 lg:py-16 bg-[#FAFBF8] border-b border-[#E8EFE6] selection:bg-[#2E7D32] selection:text-white"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-10">
        {/* Editorial Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            {t("benefitsTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
            Replacing queue uncertainty with predictive timing and operational
            clarity.
          </p>
        </div>

        {/* Human-Designed Editorial 3-Column Composition */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200/80 pt-2">
          {/* Column 1: Farmers */}
          <div className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200/60">
              <span className="text-lg select-none">≡ƒî╛</span>
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                {t("benefitsFarmerTitle")}
              </h3>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700 leading-normal">
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsFarmer1")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsFarmer2")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsFarmer3")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsFarmer4")}</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Mandi Staff */}
          <div className="py-6 md:py-0 md:px-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200/60">
              <span className="text-lg select-none">ΓÜÖ∩╕Å</span>
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                {t("benefitsStaffTitle")}
              </h3>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700 leading-normal">
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsStaff1")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsStaff2")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsStaff3")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsStaff4")}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Command Officers */}
          <div className="py-6 md:py-0 md:px-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200/60">
              <span className="text-lg select-none">≡ƒ¢í∩╕Å</span>
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                {t("benefitsOfficerTitle")}
              </h3>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700 leading-normal">
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsOfficer1")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsOfficer2")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsOfficer3")}</span>
              </li>
              <li className="flex items-start gap-2.5 group hover:text-[#1B4318] transition-colors">
                <span className="text-[#2E7D32] font-bold text-xs shrink-0 select-none">
                  Γ£ô
                </span>
                <span>{t("benefitsOfficer4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
