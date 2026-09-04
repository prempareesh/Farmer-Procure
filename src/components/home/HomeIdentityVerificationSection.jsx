import React from "react";
import { Camera, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";

export default function HomeIdentityVerificationSection() {
  const steps = [
    {
      num: "01",
      title: "BOOKING",
      desc: "Farmer identity captured live during slot booking.",
      badge: "IDENTITY ENROLLED",
      icon: Camera,
    },
    {
      num: "02",
      title: "ARRIVAL",
      desc: "Live gate arrival camera capture at Mandi entrance.",
      badge: "GATE ARRIVAL",
      icon: UserCheck,
    },
    {
      num: "03",
      title: "VERIFY",
      desc: "1:1 biometric face descriptor vector comparison.",
      badge: "VERIFICATION PASSED",
      icon: ShieldCheck,
    },
    {
      num: "04",
      title: "PROCEED",
      desc: "Authorized MSP weighing & direct payout authorization.",
      badge: "MSP DISBURSED",
      icon: ArrowRight,
    },
  ];

  return (
    <section
      id="identity-verification"
      className="w-full py-20 bg-[#050705] border-b border-[#12351F]/40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs font-bold text-[#79C267] tracking-widest uppercase block">
            IDENTITY VERIFICATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F1EFE6] leading-tight">
            Seamless 1:1 Identity Verification <br />
            <span className="text-[#79C267]">at every procurement stage.</span>
          </h2>
        </div>

        {/* 4-Step Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#0B120C] p-6 rounded-2xl border border-[#12351F] space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#79C267] bg-[#12351F] px-2.5 py-1 rounded-md">
                    {step.num}
                  </span>
                  <Icon className="w-5 h-5 text-[#79C267]" />
                </div>

                <div>
                  <h3 className="font-serif text-xl font-normal text-[#F1EFE6]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#A9B0A5] font-sans mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="font-mono text-[9px] font-bold text-[#79C267] bg-[#12351F]/60 px-2 py-1 rounded border border-[#1D5A2D]">
                    {step.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
