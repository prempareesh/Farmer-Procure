import React from "react";
import { AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ProblemSection() {
  const { t } = useApp();

  return (
    <section
      id="problem"
      className="w-full py-20 lg:py-28 bg-[#050805] text-[#E8E7DE] border-b border-[#1A2E1E]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT: Oversized Editorial Statement */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[11px] font-mono text-[#79C267] uppercase tracking-widest block">
            THE PROCUREMENT CHALLENGE
          </span>

          <h2 className="font-serif text-5xl sm:text-6xl text-[#F2F0E8] font-normal leading-[1.05] tracking-tight">
            18 farmers ahead. <br />
            <span className="italic text-[#A6ADA3] text-4xl sm:text-5xl">
              Zero queue visibility.
            </span>
          </h2>

          <p className="text-sm text-[#A6ADA3] leading-relaxed max-w-lg">
            Traditional grain procurement forces farmers into unmanaged daily
            queues, while Mandi staff face unpredictable arrival spikes and
            unidentified weighbridge bottlenecks.
          </p>

          <div className="pt-2 text-xs font-mono text-[#79C267] space-y-1">
            <p>• Unchecked arrival congestion</p>
            <p>• Unidentified stage-level delays</p>
            <p>• Uneven counter load distribution</p>
          </div>
        </div>

        {/* RIGHT: Operational Workload Breakdown Card */}
        <div className="lg:col-span-6">
          <div className="bg-[#071008] rounded-2xl border border-[#1A2E1E] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
              <div>
                <span className="font-mono text-xs text-[#79C267] font-bold block">
                  TOKEN P-147
                </span>
                <span className="text-xs text-[#A6ADA3]">
                  Position #19 in Intake Lane
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-[#F2F0E8] font-bold block">
                  EXPECTED WAIT 42 MIN
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  Bottleneck Detected
                </span>
              </div>
            </div>

            {/* Stage Breakdown */}
            <div className="space-y-4">
              <div className="p-3 bg-[#0A120C] rounded-xl border border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#F2F0E8] block font-bold">
                    QUALITY LAB CHECK
                  </span>
                  <span className="text-[10px] text-[#A6ADA3]">
                    Moisture & grain purity analysis
                  </span>
                </div>
                <span className="text-[#79C267]">6.2 min (Normal)</span>
              </div>

              <div className="p-3 bg-[#12351F]/40 rounded-xl border border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#F2F0E8] block font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    WEIGHBRIDGE #2
                  </span>
                  <span className="text-[10px] text-amber-400">
                    Gross tare loading bottleneck
                  </span>
                </div>
                <span className="text-amber-400 font-bold">
                  8.2 min (↑ 3.1 min above baseline)
                </span>
              </div>

              <div className="p-3 bg-[#0A120C] rounded-xl border border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#F2F0E8] block font-bold">
                    PROCUREMENT VOUCHER
                  </span>
                  <span className="text-[10px] text-[#A6ADA3]">
                    MSP purchase logging
                  </span>
                </div>
                <span className="text-[#79C267]">4.8 min (Normal)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#A6ADA3] italic border-t border-[#1A2E1E] pt-3">
              Waiting is not simply people × fixed minutes — AgriProcure
              pinpoints the exact stage bottleneck in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
