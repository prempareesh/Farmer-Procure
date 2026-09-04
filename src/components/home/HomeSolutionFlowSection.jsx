import React from "react";
import {
  Calendar,
  Ticket,
  Activity,
  TrendingUp,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HomeSolutionFlowSection() {
  const { t } = useApp();

  const flowSteps = [
    { code: t("stepBook"), icon: Calendar },
    { code: t("stepToken"), icon: Ticket },
    { code: t("stepTrack"), icon: Activity },
    { code: t("stepPredict"), icon: TrendingUp },
    { code: t("stepAct"), icon: Cpu },
    { code: t("stepProcure"), icon: CheckCircle2 },
    { code: t("stepVerify"), icon: ShieldCheck },
  ];

  return (
    <section
      id="solution"
      className="w-full py-16 bg-[#FAFBF8] border-b border-[#E8EFE6] font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-black text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-[#C8E6C9]">
            THE AGRIPROCURE SOLUTION
          </span>
          <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            {t("solutionTitle")}
          </h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            {t("solutionSub")}
          </p>
        </div>

        {/* Visual Flow Pipeline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            {flowSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.code}
                  className="relative flex flex-col items-center p-3 rounded-2xl bg-[#FAFBF8] border border-gray-200 space-y-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1B4318] text-white flex items-center justify-center font-bold shadow-2xs">
                    <StepIcon className="w-4 h-4 text-[#F9A825]" />
                  </div>
                  <span className="text-xs font-black text-[#111827] tracking-wide">
                    {step.code}
                  </span>
                  {idx < flowSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E7D32] z-10" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#C8E6C9] text-center text-xs font-extrabold text-[#1B4318]">
            ⚡ Shared State Engine: Actions in Farmer, Staff, or Officer portals
            update the entire Mandi ecosystem live.
          </div>
        </div>
      </div>
    </section>
  );
}
