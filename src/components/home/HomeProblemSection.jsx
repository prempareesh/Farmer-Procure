import React from "react";
import { AlertTriangle, Clock, Layers, Activity, TrendingUp } from "lucide-react";

export default function HomeProblemSection() {
  return (
    <section
      id="problem"
      className="w-full py-20 bg-[#050705] border-b border-[#12351F]/40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        {/* Editorial Statement Header */}
        <div className="max-w-3xl space-y-4">
          <span className="font-mono text-xs font-bold text-[#79C267] tracking-widest uppercase block">
            PREDICTIVE INTELLIGENCE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F1EFE6] leading-tight">
            Before the queue becomes a problem, <br />
            <span className="text-[#79C267]">AgriProcure sees it coming.</span>
          </h2>
        </div>

        {/* Real Product Fragment Container */}
        <div className="bg-[#0B120C] p-8 rounded-2xl border border-[#12351F] shadow-2xl max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-[#12351F] pb-4">
            <div>
              <span className="font-mono text-[10px] text-[#A9B0A5] uppercase tracking-wider block">
                MANDI TELEMETRY FRAGMENT
              </span>
              <h3 className="font-serif text-xl font-normal text-[#F1EFE6]">
                Karnal Central Grain Mandi (HR)
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 font-mono text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>CONGESTION HIGH</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#050705] p-5 rounded-xl border border-[#12351F]">
              <span className="font-mono text-[10px] text-[#A9B0A5] uppercase tracking-wider block">
                FARMERS AHEAD
              </span>
              <span className="font-serif text-3xl text-[#F1EFE6] block mt-1">
                18 Ahead
              </span>
              <span className="font-mono text-[10px] text-[#A9B0A5] block mt-1">
                Lane 3 Gate Entry
              </span>
            </div>

            <div className="bg-[#050705] p-5 rounded-xl border border-[#12351F]">
              <span className="font-mono text-[10px] text-[#A9B0A5] uppercase tracking-wider block">
                EXPECTED WAIT TIME
              </span>
              <span className="font-serif text-3xl text-[#79C267] block mt-1">
                42 Min
              </span>
              <span className="font-mono text-[10px] text-[#A9B0A5] block mt-1">
                Predicted by SLA Engine
              </span>
            </div>

            <div className="bg-[#050705] p-5 rounded-xl border border-[#12351F]">
              <span className="font-mono text-[10px] text-[#A9B0A5] uppercase tracking-wider block">
                WEIGHING BRIDGE #2
              </span>
              <span className="font-serif text-3xl text-amber-400 block mt-1">
                8.2 Min
              </span>
              <span className="font-mono text-[10px] text-gray-400 block mt-1">
                Baseline: 5.1 Min
              </span>
            </div>
          </div>

          <div className="bg-[#12351F]/40 p-4 rounded-xl border border-[#1D5A2D] text-xs font-mono text-[#F1EFE6] flex items-center justify-between">
            <span>⚡ AUTOMATED BOTTLENECK INTERVENTION DISPATCHED TO MANDI STAFF</span>
            <span className="text-[#79C267] font-bold">STATUS: ACTIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
