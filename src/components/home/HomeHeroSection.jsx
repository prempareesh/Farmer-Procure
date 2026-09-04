import React from "react";
import { User, ArrowRight, Activity, Clock, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HomeHeroSection() {
  const { navigateTo } = useApp();

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full flex flex-col justify-between z-10 py-16 lg:py-24 overflow-hidden bg-[#050705] border-b border-[#12351F]/40"
    >
      {/* 1. RIGHT-ALIGNED AGRICULTURAL HERO IMAGE WITH ATMOSPHERIC BLEND */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[54%] pointer-events-none overflow-hidden z-0">
        <img
          src="/farmer_ultra_green.jpg"
          alt="Indian Farmer working with oxen in emerald paddy field at sunrise"
          className="w-full h-full object-cover object-[70%_center] filter brightness-[0.88] contrast-[1.1] saturate-[1.15]"
        />

        {/* Soft Left-Edge Atmospheric Gradient Transition to #050705 */}
        <div className="absolute left-0 inset-y-0 w-48 lg:w-72 bg-gradient-to-r from-[#050705] via-[#050705]/85 to-transparent" />

        {/* Top and Bottom Fades */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#050705] via-[#050705]/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#050705] via-[#050705]/70 to-transparent" />
      </div>

      {/* 2. LEFT EDITORIAL CONTENT ZONE */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-xl lg:max-w-2xl space-y-8">
          {/* Main Times New Roman Editorial Headline */}
          <div className="space-y-3">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#F1EFE6] tracking-tight leading-[1.05]">
              Smarter <br />
              Procurement <br />
              <span className="text-[#79C267]">for Stronger Farmers</span>
            </h1>
          </div>

          {/* Single Concise Supporting Statement */}
          <p className="text-sm sm:text-base text-[#A9B0A5] font-sans font-normal leading-relaxed max-w-md">
            Predict queues, avoid bottlenecks, and choose the procurement centre
            and time that save farmers unnecessary waiting.
          </p>

          {/* Clean Primary & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <button
              onClick={() => navigateTo("auth")}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#12351F] hover:bg-[#1D5A2D] border border-[#79C267]/40 text-[#F1EFE6] font-mono text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all duration-200"
            >
              <User className="w-4 h-4 text-[#79C267]" />
              <span>Login / Get Started</span>
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="flex items-center gap-2 text-[#A9B0A5] hover:text-[#F1EFE6] font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4 text-[#79C267]" />
            </button>
          </div>
        </div>

        {/* 3. ELEGANT PRODUCT TELEMETRY DATA STRIP */}
        <div className="mt-16 pt-8 border-t border-[#12351F]/40 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-6 bg-[#0B120C]/90 p-4 rounded-xl border border-[#12351F] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#79C267] animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-[#79C267] tracking-widest uppercase">
                LIVE PROCUREMENT INTELLIGENCE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-[#A9B0A5] block text-[10px] uppercase">ACTIVE MANDIS</span>
                <span className="text-[#F1EFE6] font-bold">72 ACTIVE</span>
              </div>
              <div>
                <span className="text-[#A9B0A5] block text-[10px] uppercase">CONGESTION RISK</span>
                <span className="text-amber-400 font-bold">HIGH CONGESTION</span>
              </div>
              <div>
                <span className="text-[#A9B0A5] block text-[10px] uppercase">AVG BOTTLENECK</span>
                <span className="text-[#F1EFE6] font-bold">8.2 MIN</span>
              </div>
              <div>
                <span className="text-[#A9B0A5] block text-[10px] uppercase">EST WAIT TIME</span>
                <span className="text-[#79C267] font-bold">18 MIN PREDICTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
