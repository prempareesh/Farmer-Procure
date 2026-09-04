import React from "react";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function BenefitsSection() {
  const { navigateTo, t } = useApp();

  return (
    <section
      id="benefits"
      className="w-full py-20 lg:py-28 bg-[#050805] text-[#E8E7DE] border-b border-[#1A2E1E]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: Editorial Typography */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[11px] font-mono text-[#79C267] uppercase tracking-widest block">
            SMART SLOT RECOMMENDATION
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl text-[#F2F0E8] font-normal leading-[1.05] tracking-tight">
            Choose the slot <br />
            <span className="italic text-[#79C267]">before the queue</span>{" "}
            <br />
            chooses for you.
          </h2>

          <p className="text-sm text-[#A6ADA3] font-normal leading-relaxed max-w-lg">
            AgriProcure recommends optimal 15-minute slot windows based on
            predicted Mandi intake pressure, saving hours of reactive waiting in
            line.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigateTo("book-slot")}
              className="px-6 py-3.5 rounded-lg bg-[#12351F] hover:bg-[#164A29] border border-[#1A2E1E] text-[#F2F0E8] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Reserve Recommended Slot →
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Real Recommendation UI */}
        <div className="lg:col-span-6">
          <div className="bg-[#071008] rounded-2xl border border-[#1A2E1E] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-3 font-mono text-xs">
              <span className="text-[#A6ADA3] uppercase">
                AVAILABLE PROCURE SLOTS
              </span>
              <span className="text-[#79C267] font-bold">
                RECOMMENDED WINDOW
              </span>
            </div>

            {/* Recommended Slot Option */}
            <div className="p-4 bg-[#12351F] rounded-xl border border-[#79C267]/50 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#79C267]" />
                  <span className="font-mono text-base font-bold text-[#F2F0E8]">
                    02:00 PM – 02:30 PM
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#79C267] text-[#050805] text-[10px] font-mono font-black uppercase">
                  RECOMMENDED
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#E8E7DE]">
                <span>Expected wait: ~19 min</span>
                <span className="text-[#79C267]">Capacity: 6/20 (Optimal)</span>
              </div>
            </div>

            {/* Congested Alternative Slot Option */}
            <div className="p-4 bg-[#0A120C] rounded-xl border border-[#1A2E1E] opacity-60 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#A6ADA3]">04:00 PM – 04:30 PM</span>
                <span className="text-amber-400">HIGH CONGESTION</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#A6ADA3]">
                <span>Expected wait: ~47 min</span>
                <span>Capacity: 18/20 (Heavy Intake)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#A6ADA3] font-mono italic pt-1">
              • Recommendation algorithm protects farmer arrival distribution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
