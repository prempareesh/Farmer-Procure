import React from "react";
import { ArrowRight, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function HeroSection() {
  const { navigateTo, t } = useApp();

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[85vh] flex items-center py-16 lg:py-24 bg-[#050805] text-[#E8E7DE] border-b border-[#1A2E1E] overflow-hidden"
    >
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(18,53,31,0.25),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT COLUMN: Editorial Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <span className="text-[11px] font-mono font-semibold text-[#79C267] uppercase tracking-widest block">
              MINISTRY OF AGRICULTURE • SMART PROCUREMENT TELEMETRY
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F2F0E8] leading-[1.08] tracking-tight font-normal">
              Procurement that <br />
              <span className="italic text-[#79C267]">sees the queue</span>{" "}
              <br />
              before it becomes a problem.
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[#A6ADA3] font-normal leading-relaxed max-w-xl">
            {t("heroDescription")}
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => navigateTo("auth")}
              className="px-6 py-3.5 rounded-lg bg-[#12351F] hover:bg-[#164A29] border border-[#1A2E1E] text-[#F2F0E8] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              {t("btnBookSlot")}
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="px-6 py-3.5 rounded-lg bg-transparent hover:bg-[#071008] border border-[#1A2E1E] text-[#E8E7DE] hover:text-[#79C267] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t("btnHowItWorks")}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#79C267]" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Embedded Real Product UI Composition */}
        <div className="lg:col-span-5">
          <div className="bg-[#071008] rounded-2xl border border-[#1A2E1E] p-6 space-y-5 shadow-2xl">
            {/* Header Strip */}
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
                  Procurement Centre Telemetry
                </span>
                <h3 className="font-serif text-base text-[#F2F0E8] font-normal">
                  Karnal Central Grain Mandi
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#12351F] border border-[#1A2E1E] text-[#79C267] text-[10px] font-mono font-bold">
                LIVE QUEUE
              </span>
            </div>

            {/* Token & Waiting Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#0A120C] rounded-xl border border-[#1A2E1E]">
                <span className="text-[10px] font-mono text-[#A6ADA3] block">
                  NOW SERVING
                </span>
                <span className="font-mono text-2xl font-bold text-[#79C267] mt-0.5 block">
                  P-147
                </span>
                <span className="text-[10px] text-[#A6ADA3]">Position #19</span>
              </div>

              <div className="p-3.5 bg-[#0A120C] rounded-xl border border-[#1A2E1E]">
                <span className="text-[10px] font-mono text-[#A6ADA3] block">
                  ESTIMATED WAIT
                </span>
                <span className="font-mono text-2xl font-bold text-[#F2F0E8] mt-0.5 block">
                  ~42 min
                </span>
                <span className="text-[10px] text-[#A6ADA3]">
                  18 Trucks in Lane
                </span>
              </div>
            </div>

            {/* Stage Latency Telemetry */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#A6ADA3]">WEIGHING BRIDGE #2</span>
                <span className="text-amber-400 font-bold">
                  8.2 min (+3.1 min delay)
                </span>
              </div>
              <div className="w-full bg-[#12351F] rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full w-[78%]" />
              </div>
            </div>

            {/* Operational Recommendation Box */}
            <div className="p-3.5 bg-[#12351F]/40 rounded-xl border border-[#1A2E1E] text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#79C267] font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono uppercase text-[10px]">
                  Smart Operational Signal
                </span>
              </div>
              <p className="text-[#E8E7DE] text-[11px] leading-relaxed">
                Dispatch auxiliary operator to Weighbridge Counter #2 to clear
                intake lane backlog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
