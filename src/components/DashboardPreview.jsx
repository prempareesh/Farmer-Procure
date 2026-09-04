import React, { useState } from "react";
import { LayoutDashboard, AlertCircle, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function DashboardPreview({ onBookSlotClick }) {
  const { navigateTo, t } = useApp();
  const [activeTab, setActiveTab] = useState("telemetry");

  const auditLogs = [
    {
      id: "TX-9021",
      time: "10:42 AM",
      farmer: "Sukhdev Singh",
      mandi: "Karnal Central",
      crop: "Paddy Grade A",
      hash: "0x8f2a...4b12",
      status: "VERIFIED",
    },
    {
      id: "TX-9020",
      time: "10:38 AM",
      farmer: "Anand Verma",
      mandi: "Ludhiana Hub",
      crop: "Wheat Sharbati",
      hash: "0x3c9e...9a41",
      status: "VERIFIED",
    },
    {
      id: "TX-9019",
      time: "10:31 AM",
      farmer: "Kavita Reddy",
      mandi: "Nalgonda Main",
      crop: "Paddy Grade A",
      hash: "0x1d7b...0e88",
      status: "VERIFIED",
    },
    {
      id: "TX-9018",
      time: "10:25 AM",
      farmer: "Rameshwar Singh",
      mandi: "Patiala Mandi",
      crop: "Mustard",
      hash: "0x5e4f...2c11",
      status: "VERIFIED",
    },
  ];

  return (
    <section
      id="dashboard"
      className="py-20 lg:py-28 bg-[#050805] text-[#E8E7DE] border-b border-[#1A2E1E]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono text-[#79C267] uppercase tracking-widest block">
            LIVE COMMAND TELEMETRY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F2F0E8] font-normal tracking-tight">
            Procurement Command Centre
          </h2>
          <p className="text-xs text-[#A6ADA3] font-normal max-w-xl">
            Real-time Mandi intake pressure, automated weighbridge bottleneck
            detection, and cryptographic transaction logging.
          </p>
        </div>

        {/* Dashboard Frame Container */}
        <div className="bg-[#071008] rounded-2xl border border-[#1A2E1E] overflow-hidden shadow-2xl space-y-0">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#0A120C] border-b border-[#1A2E1E] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#12351F] border border-[#1A2E1E] flex items-center justify-center text-[#79C267]">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-base text-[#F2F0E8] block">
                  Karnal Central Grain Mandi
                </span>
                <span className="text-[10px] font-mono text-[#A6ADA3]">
                  Node #42-Karnal • Live Operational Telemetry
                </span>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center bg-[#050805] p-1 rounded-lg border border-[#1A2E1E]">
              <button
                onClick={() => setActiveTab("telemetry")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === "telemetry"
                    ? "bg-[#12351F] text-[#79C267] border border-[#1A2E1E]"
                    : "text-[#A6ADA3] hover:text-[#F2F0E8]"
                }`}
              >
                Intake Telemetry
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === "audit"
                    ? "bg-[#12351F] text-[#79C267] border border-[#1A2E1E]"
                    : "text-[#A6ADA3] hover:text-[#F2F0E8]"
                }`}
              >
                SHA-256 Ledger
              </button>
            </div>
          </div>

          {/* Tab Content 1: Telemetry */}
          {activeTab === "telemetry" ? (
            <div className="p-6 lg:p-8 space-y-6">
              {/* Top Operational Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#0A120C] rounded-xl border border-[#1A2E1E] space-y-1">
                  <span className="text-[10px] font-mono text-[#A6ADA3] block uppercase">
                    ACTIVE QUEUE CAPACITY
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#F2F0E8] block">
                    72 / 90
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    80% Operational Intake Pressure
                  </span>
                </div>

                <div className="p-4 bg-[#0A120C] rounded-xl border border-[#1A2E1E] space-y-1">
                  <span className="text-[10px] font-mono text-[#A6ADA3] block uppercase">
                    CONGESTION STATUS
                  </span>
                  <span className="font-mono text-2xl font-bold text-amber-400 block">
                    HIGH
                  </span>
                  <span className="text-[10px] text-[#A6ADA3]">
                    18 Vehicles in Intake Lane
                  </span>
                </div>

                <div className="p-4 bg-[#0A120C] rounded-xl border border-[#1A2E1E] space-y-1">
                  <span className="text-[10px] font-mono text-[#A6ADA3] block uppercase">
                    CURRENT BOTTLENECK
                  </span>
                  <span className="font-mono text-xl font-bold text-[#F2F0E8] truncate block">
                    Weighbridge #2
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    8.2 min current vs 5.1 min baseline
                  </span>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-4 bg-[#12351F]/40 rounded-xl border border-[#1A2E1E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>RECOMMENDED INTERVENTION ACTION</span>
                  </div>
                  <p className="text-xs text-[#E8E7DE]">
                    "Review additional weighing capacity at Bridge #2 to restore
                    target latency SLA."
                  </p>
                </div>
                <button
                  onClick={() => navigateTo("auth")}
                  className="px-5 py-2.5 rounded-lg bg-[#12351F] hover:bg-[#164A29] border border-[#1A2E1E] text-[#79C267] font-mono font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer"
                >
                  Deploy Action →
                </button>
              </div>
            </div>
          ) : (
            /* Tab Content 2: Ledger */
            <div className="p-6 lg:p-8 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between text-[#A6ADA3] pb-2 border-b border-[#1A2E1E]">
                <span>IMMUTABLE TRANSACTION LOG</span>
                <span className="text-[#79C267] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SHA-256 VERIFIED
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A2E1E] text-[#A6ADA3] text-[10px] uppercase font-mono">
                      <th className="py-2.5 px-3">Token ID</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Farmer</th>
                      <th className="py-2.5 px-3">Mandi Hub</th>
                      <th className="py-2.5 px-3">Crop</th>
                      <th className="py-2.5 px-3">SHA-256 Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2E1E] text-[#E8E7DE]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#0A120C]">
                        <td className="py-2.5 px-3 font-bold text-[#79C267]">
                          {log.id}
                        </td>
                        <td className="py-2.5 px-3 text-[#A6ADA3]">
                          {log.time}
                        </td>
                        <td className="py-2.5 px-3 font-semibold">
                          {log.farmer}
                        </td>
                        <td className="py-2.5 px-3 text-[#A6ADA3]">
                          {log.mandi}
                        </td>
                        <td className="py-2.5 px-3 text-[#A6ADA3]">
                          {log.crop}
                        </td>
                        <td className="py-2.5 px-3 text-[#79C267]">
                          {log.hash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
