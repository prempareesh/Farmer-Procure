import React from "react";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function TrustSection() {
  const { t } = useApp();

  const recordedStages = [
    "Booking",
    "Arrival",
    "Quality Check",
    "Weighing",
    "Procurement",
    "Payment",
    "Completion",
  ];

  return (
    <section
      id="trust"
      className="w-full py-16 bg-[#FAFBF8] border-b border-[#E8EFE6]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#1B4318] text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>TRANSPARENCY LAYER</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            {t("trustTitle")}
          </h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            {t("trustSub")}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-extrabold">
            {recordedStages.map((stage, idx) => (
              <React.Fragment key={stage}>
                <span className="bg-[#FAFBF8] px-3.5 py-2 rounded-xl border border-gray-200 text-gray-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {stage}
                </span>
                {idx < recordedStages.length - 1 && (
                  <span className="text-gray-300">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-4 bg-[#1B4318] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#F9A825]" />
              <span>CRYPTOGRAPHIC INTEGRITY:</span>
            </div>
            <span className="font-mono text-[11px] text-[#C8E6C9]">
              {t("trustBadge")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
