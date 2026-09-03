import React from "react";
import { UserCheck, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function BenefitsSection() {
  const { t } = useApp();

  return (
    <section
      id="benefits"
      className="w-full py-16 lg:py-20 bg-white border-b border-[#E8EFE6]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-black text-[#1B4318] bg-[#FAFBF8] px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-gray-200">
            SYSTEM-WIDE ADVANTAGES
          </span>
          <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            {t("benefitsTitle")}
          </h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Replacing queue uncertainty with predictive timing and operational
            clarity.
          </p>
        </div>

        {/* 3 Column Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Column 1: For Farmers */}
          <div className="bg-[#FAFBF8] p-6 rounded-3xl border border-gray-200 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#111827]">
                {t("benefitsFarmerTitle")}
              </h3>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsFarmer1")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsFarmer2")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsFarmer3")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsFarmer4")}</span>
              </li>
            </ul>
          </div>

          {/* Column 2: For Mandi Staff */}
          <div className="bg-[#FAFBF8] p-6 rounded-3xl border border-gray-200 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#1B4318] text-white flex items-center justify-center font-bold">
                <Users className="w-4 h-4 text-[#F9A825]" />
              </div>
              <h3 className="text-sm font-extrabold text-[#111827]">
                {t("benefitsStaffTitle")}
              </h3>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1B4318] shrink-0" />
                <span>{t("benefitsStaff1")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1B4318] shrink-0" />
                <span>{t("benefitsStaff2")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1B4318] shrink-0" />
                <span>{t("benefitsStaff3")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1B4318] shrink-0" />
                <span>{t("benefitsStaff4")}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: For Command Officers */}
          <div className="bg-[#FAFBF8] p-6 rounded-3xl border border-gray-200 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#1B4318] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#111827]">
                {t("benefitsOfficerTitle")}
              </h3>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsOfficer1")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsOfficer2")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsOfficer3")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{t("benefitsOfficer4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
