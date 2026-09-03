import React from "react";
import HowAgriProcureWorks from "../components/HowAgriProcureWorks";
import { useApp } from "../context/AppContext";

export default function HowItWorksView() {
  const { initialWorkflowStep, t } = useApp();

  return (
    <div className="w-full min-h-screen bg-[#FAFBF8] text-[#111827] flex flex-col justify-between selection:bg-[#2E7D32] selection:text-white">
      {/* Header section */}
      <section className="w-full py-12 lg:py-16 bg-[#FAFBF8] border-b border-[#E8EFE6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#C8E6C9]">
            {t("interactiveDemoTag")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
            {t("howAgriProcureWorksTitle")}
          </h1>
          <p className="text-base text-gray-700 font-medium max-w-xl mx-auto">
            {t("howAgriProcureWorksSub")}
          </p>
        </div>
      </section>

      {/* Main Interactive Workflow Component */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10">
        <HowAgriProcureWorks initialStep={initialWorkflowStep} />
      </main>
    </div>
  );
}
