import React from "react";
import { User, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HomeFinalCtaBand() {
  const { navigateTo } = useApp();

  return (
    <section
      id="get-started"
      className="w-full py-24 bg-[#050705] border-b border-[#12351F]/40 text-center"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-8">
        <div className="space-y-4">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F1EFE6] leading-tight">
            Make procurement <br />
            <span className="text-[#79C267]">more predictable.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A9B0A5] font-sans max-w-lg mx-auto">
            Join thousands of farmers, Mandi staff, and state officers managing
            predictable grain procurement.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2.5 px-8 py-4 rounded-lg bg-[#12351F] hover:bg-[#1D5A2D] border border-[#79C267]/40 text-[#F1EFE6] font-mono text-xs uppercase tracking-wider shadow-xl cursor-pointer transition-all"
          >
            <User className="w-4 h-4 text-[#79C267]" />
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </section>
  );
}
