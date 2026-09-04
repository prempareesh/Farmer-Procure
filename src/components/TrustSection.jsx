import React from "react";
import { Camera, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function TrustSection() {
  const { t } = useApp();

  const verificationFlow = [
    {
      stage: "01. BOOKING",
      label: "Live Photo Captured",
      desc: "Captured during slot booking with real-time face alignment check.",
    },
    {
      stage: "02. ARRIVAL",
      label: "Mandi Gate Capture",
      desc: "Live camera capture taken by Mandi Staff upon tractor arrival.",
    },
    {
      stage: "03. VERIFY",
      label: "1:1 Face Verification",
      desc: "Cosine similarity compares arrival face against booking reference.",
    },
    {
      stage: "04. PROCEED",
      label: "Procurement Continued",
      desc: "Token is verified and farmer proceeds to Quality Moisture Testing.",
    },
  ];

  return (
    <section
      id="trust"
      className="w-full py-20 lg:py-28 bg-[#050805] text-[#E8E7DE] border-b border-[#1A2E1E]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono text-[#79C267] uppercase tracking-widest block">
            BIOMETRIC INTEGRITY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F2F0E8] font-normal tracking-tight">
            1:1 Identity Verification
          </h2>
          <p className="text-xs text-[#A6ADA3] font-normal max-w-xl">
            Verifying the farmer at arrival against the booking capture for the
            exact booking ID — preventing slot trading while strictly protecting
            biometric data.
          </p>
        </div>

        {/* 4-Stage Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {verificationFlow.map((item, idx) => (
            <div
              key={item.stage}
              className="p-5 rounded-2xl bg-[#071008] border border-[#1A2E1E] space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-2 font-mono text-xs">
                <span className="text-[#79C267] font-bold">{item.stage}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#79C267]" />
              </div>

              <div className="space-y-1">
                <h3 className="font-mono text-sm font-bold text-[#F2F0E8]">
                  {item.label}
                </h3>
                <p className="text-xs text-[#A6ADA3] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Privacy Banner */}
        <div className="p-4 bg-[#071008] rounded-xl border border-[#1A2E1E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#A6ADA3]">
          <div className="flex items-center gap-2 text-[#79C267]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-bold">PRIVACY & BIOMETRIC SECURITY:</span>
          </div>
          <span>
            Encrypted 128-d feature descriptors stored in private DB reference • Zero public buckets or localStorage storage.
          </span>
        </div>
      </div>
    </section>
  );
}
