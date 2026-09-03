import React from "react";
import { User, ShieldAlert, Check, TrendingUp, Cpu } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FarmerOfficialOutcome() {
  const { navigateTo } = useApp();

  return (
    <section className="w-full py-16 bg-[#FAFBF8] border-t border-[#E8EFE6] relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header Concept Connection */}
        <div className="text-center max-w-md mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9]">
            <Cpu className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1B4318]">
              INTEGRATED DECISION ENGINE
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            ONE SYSTEM • TWO USERS • BETTER DECISIONS
          </h2>
        </div>

        {/* 2 Lightweight Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative">
          {/* Central AI Connection Line (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-[#C8E6C9] items-center justify-center shadow-xs">
            <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
          </div>

          {/* LEFT: FARMER */}
          <div
            onClick={() => navigateTo("book-slot")}
            className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#A5D6A7] hover:shadow-sm transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest block">
                      USER 01
                    </span>
                    <h3 className="text-base font-extrabold text-[#111827]">
                      FARMER
                    </h3>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                  Predictable Arrival
                </span>
              </div>

              <ul className="space-y-3 pt-1">
                <li className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                  <div className="w-4 h-4 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#2E7D32]" />
                  </div>
                  <span>Better Slot</span>
                </li>

                <li className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                  <div className="w-4 h-4 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#2E7D32]" />
                  </div>
                  <span>Less Waiting</span>
                </li>

                <li className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                  <div className="w-4 h-4 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#2E7D32]" />
                  </div>
                  <span>Live Status</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs font-bold text-[#2E7D32] flex items-center justify-between border-t border-gray-50">
              <span>Farmer Portal</span>
              <span>Book Slot →</span>
            </div>
          </div>

          {/* RIGHT: OFFICIAL */}
          <div
            onClick={() => navigateTo("officer-dash")}
            className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#A5D6A7] hover:shadow-sm transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#1B4318] flex items-center justify-center font-bold">
                    <ShieldAlert className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest block">
                      USER 02
                    </span>
                    <h3 className="text-base font-extrabold text-[#111827]">
                      OFFICIAL
                    </h3>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#1B4318] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Mandi Command
                </span>
              </div>

              <ul className="space-y-3 pt-1">
                <li className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                  <div className="w-4 h-4 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#2E7D32]" />
                  </div>
                  <span>Risk Alerts</span>
                </li>

                <li className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                  <div className="w-4 h-4 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#2E7D32]" />
                  </div>
                  <span>Bottleneck Identification</span>
                </li>

                <li className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                  <div className="w-4 h-4 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#2E7D32]" />
                  </div>
                  <span>Recommended Action</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs font-bold text-[#1B4318] flex items-center justify-between border-t border-gray-50">
              <span>Official Command</span>
              <span>Monitor Queue →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
