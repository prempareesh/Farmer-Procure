import React from "react";
import { Camera, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function TrustSection() {
  const { t } = useApp();

  const verificationFlow = [
    {
      stage: "01. BOOKING",
      label: "Token Generated",
      desc: "Instant digital token issued with crop details & designated time window.",
    },
    {
      stage: "02. ARRIVAL",
      label: "Mandi Gate Check-In",
      desc: "Token scanned and validated by staff against scheduled slot roster.",
    },
    {
      stage: "03. VERIFY",
      label: "Cryptographic Seal",
      desc: "SHA-256 hash generated to seal stage progress and moisture readings.",
    },
    {
      stage: "04. PROCEED",
      label: "Procurement Complete",
      desc: "Weight & MSP calculations recorded directly to immutable audit ledger.",
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
            TRANSACTION INTEGRITY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F2F0E8] font-normal tracking-tight">
            Cryptographic Audit Pipeline
          </h2>
          <p className="text-xs text-[#A6ADA3] font-normal max-w-xl">
            Verifying every procurement stage with immutable cryptographic hash signatures, ensuring transparent pricing, zero slot trading, and instant receipt verification.
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
            <span className="font-bold">AUDIT SECURITY:</span>
          </div>
          <span>
            Every stage hash is linked in sequence. Tampering with any entry invalidates downstream records.
          </span>
        </div>
      </div>
    </section>
  );
}
