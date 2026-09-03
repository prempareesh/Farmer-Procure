import React from "react";
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ProblemSection() {
  const { t } = useApp();

  return (
    <section
      id="problem"
      className="w-full py-16 lg:py-20 bg-white border-b border-[#E8EFE6]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-black uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>REAL-WORLD CHALLENGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            {t("problemTitle")}
          </h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            {t("problemSub")}
          </p>
        </div>

        {/* 2 Focused Problem Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Panel 1: For Farmers */}
          <div className="bg-[#FAFBF8] p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {t("problemFarmerTitle")}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">
                  Unpredictable Mandi Visits
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{t("problemFarmer1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{t("problemFarmer2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{t("problemFarmer3")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{t("problemFarmer4")}</span>
              </li>
            </ul>
          </div>

          {/* Panel 2: For Staff & Officers */}
          <div className="bg-[#FAFBF8] p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B4318] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {t("problemStaffTitle")}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">
                  Operational Bottlenecks
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                <span>{t("problemStaff1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                <span>{t("problemStaff2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                <span>{t("problemStaff3")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                <span>{t("problemStaff4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
