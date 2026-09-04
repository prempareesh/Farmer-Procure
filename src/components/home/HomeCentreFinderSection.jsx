import React, { useState } from "react";
import { MapPin, Navigation, CheckCircle2, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HomeCentreFinderSection() {
  const { navigateTo } = useApp();
  const [selectedCentre, setSelectedCentre] = useState("b");

  const centres = [
    {
      id: "a",
      name: "Centre A (Karnal Main Mandi)",
      dist: "7.4 km",
      queue: "23 ahead",
      wait: "51 min",
      recommended: false,
    },
    {
      id: "b",
      name: "Centre B (Karnal West Hub)",
      dist: "11.2 km",
      queue: "8 ahead",
      wait: "18 min",
      recommended: true,
    },
    {
      id: "c",
      name: "Centre C (Gharaunda Sub-Mandi)",
      dist: "14.1 km",
      queue: "17 ahead",
      wait: "37 min",
      recommended: false,
    },
  ];

  return (
    <section
      id="centre-finder"
      className="w-full py-20 bg-[#050705] border-b border-[#12351F]/40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs font-bold text-[#79C267] tracking-widest uppercase block">
            SMART CENTRE RECOMMENDATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F1EFE6] leading-tight">
            Find the optimal procurement centre, <br />
            <span className="text-[#79C267]">not just the nearest one.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Centre Comparison & Recommendation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#0B120C] p-4 rounded-xl border border-[#12351F] font-mono text-xs text-[#A9B0A5] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#79C267]" />
                YOUR LOCATION: <strong className="text-[#F1EFE6]">Karnal Sector 4</strong>
              </span>
              <span className="text-[#79C267]">GPS ACTIVE</span>
            </div>

            {/* List of eligible centres */}
            <div className="space-y-3">
              {centres.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentre(c.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    c.recommended
                      ? "bg-[#12351F]/60 border-[#79C267]/60 text-[#F1EFE6]"
                      : "bg-[#0B120C] border-[#12351F] text-[#A9B0A5] hover:border-[#1D5A2D]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-lg font-normal text-[#F1EFE6]">
                          {c.name}
                        </h4>
                        {c.recommended && (
                          <span className="bg-[#79C267] text-[#050705] font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                            BEST OPTION
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs block">
                        Distance: {c.dist} | Queue: {c.queue}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-2xl text-[#79C267] block">
                        {c.wait}
                      </span>
                      <span className="font-mono text-[10px] uppercase">EST WAIT</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation Summary Banner */}
            <div className="bg-[#12351F]/80 p-5 rounded-2xl border border-[#79C267]/40 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#79C267]">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI RECOMMENDATION SUMMARY</span>
              </div>
              <p className="text-xs text-[#F1EFE6] font-sans leading-relaxed">
                "Although Centre B (Karnal West Hub) is slightly farther away (11.2 km vs 7.4 km), its lower queue (8 trucks) and faster predicted processing time (18 min vs 51 min) save 33 minutes overall."
              </p>
            </div>
          </div>

          {/* Right Column: Dark Map Interface Preview */}
          <div className="lg:col-span-6">
            <div className="bg-[#0B120C] rounded-2xl border border-[#12351F] p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#12351F] pb-3">
                <span className="font-mono text-xs font-bold text-[#79C267] uppercase tracking-wider">
                  DARK MAP PREVIEW — MANDI NETWORK
                </span>
                <span className="font-mono text-[10px] text-[#A9B0A5]">LIVE RADAR</span>
              </div>

              {/* Simulated Dark Map Canvas */}
              <div className="relative w-full h-80 bg-[#050705] rounded-xl border border-[#12351F] flex items-center justify-center overflow-hidden">
                {/* Radial grid lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#12351F_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

                {/* Farmer Pin */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#12351F] border-2 border-[#F1EFE6] flex items-center justify-center text-[#F1EFE6] shadow-lg">
                    <Navigation className="w-4 h-4 text-[#F1EFE6]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#F1EFE6] mt-1 bg-[#050705] px-1.5 py-0.5 rounded border border-[#12351F]">
                    Farmer Location
                  </span>
                </div>

                {/* Centre A Pin */}
                <div className="absolute top-1/4 right-1/3 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span className="font-mono text-[9px] text-amber-400 bg-[#050705] px-1 py-0.5 rounded mt-1">
                    Centre A (51m)
                  </span>
                </div>

                {/* Centre B Pin (RECOMMENDED) */}
                <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-[#12351F] border-2 border-[#79C267] flex items-center justify-center text-[#79C267] shadow-xl">
                    <MapPin className="w-5 h-5 text-[#79C267]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#79C267] font-bold bg-[#0B120C] px-2 py-0.5 rounded border border-[#79C267]/50 mt-1">
                    ★ Centre B (18m wait)
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigateTo("book-slot")}
                className="w-full py-3.5 rounded-lg bg-[#12351F] hover:bg-[#1D5A2D] border border-[#79C267]/40 text-[#F1EFE6] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Book Slot at Recommended Centre</span>
                <ArrowRight className="w-4 h-4 text-[#79C267]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
