import React from "react";
import { ArrowRight, Eye, TrendingUp, HelpCircle, AlertCircle, Cpu, ShieldCheck } from "lucide-react";

export default function HomeSolutionFlowSection() {
  const loopSteps = [
    {
      code: "01",
      name: "OBSERVE",
      desc: "Live Mandi queue telemetry & truck arrivals ingested in real time.",
      icon: Eye,
    },
    {
      code: "02",
      name: "PREDICT",
      desc: "Machine learning forecasts processing delays & wait times per slot.",
      icon: TrendingUp,
    },
    {
      code: "03",
      name: "EXPLAIN",
      desc: "XAI identifies exact root causes of delay (moisture testing, weighbridge).",
      icon: HelpCircle,
    },
    {
      code: "04",
      name: "IDENTIFY",
      desc: "Detects alternative Mandi centres with minimal queue congestion.",
      icon: AlertCircle,
    },
    {
      code: "05",
      name: "ACT",
      desc: "Re-routes farmer slots dynamically to prevent gate traffic jams.",
      icon: Cpu,
    },
    {
      code: "06",
      name: "VERIFY",
      desc: "1:1 Face verification & SHA-256 audit ledger seal every transaction.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="solution"
      className="w-full py-20 bg-[#050705] border-b border-[#12351F]/40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs font-bold text-[#79C267] tracking-widest uppercase block">
            THE INTELLIGENCE LOOP
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F1EFE6] leading-tight">
            How AgriProcure manages <br />
            <span className="text-[#79C267]">end-to-end procurement.</span>
          </h2>
        </div>

        {/* Continuous Flow Loop Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loopSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.code}
                className="bg-[#0B120C] p-6 rounded-2xl border border-[#12351F] space-y-4 hover:border-[#1D5A2D] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#79C267] bg-[#12351F] px-2.5 py-1 rounded-md">
                    {step.code}
                  </span>
                  <Icon className="w-5 h-5 text-[#79C267]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-normal text-[#F1EFE6]">
                    {step.name}
                  </h3>
                  <p className="text-xs text-[#A9B0A5] font-sans font-normal mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
