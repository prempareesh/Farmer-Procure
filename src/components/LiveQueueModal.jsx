import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  BarChart3,
  AlertCircle,
  Clock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function LiveQueueModal({ isOpen, onClose }) {
  const [selectedMandi, setSelectedMandi] = useState("karnal");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mandiData = {
    karnal: {
      name: "Karnal Grain Mandi (Haryana)",
      status: "Optimal Queue Flow",
      statusColor: "bg-green-100 text-green-800 border-green-300",
      queueLength: "14 Tractors / Trucks",
      estWaitTime: "18 Minutes",
      weighingBridge: "4/4 Operational (100% capacity)",
      moistureLab: "2/2 Labs Running (Latency 4 mins)",
      aiAdvice:
        "Arrival condition is optimal right now. Surge predicted between 11:30 AM - 01:00 PM.",
      peakHours: [
        { time: "08:00 AM", load: 20 },
        { time: "10:00 AM", load: 35 },
        { time: "12:00 PM", load: 90 },
        { time: "02:00 PM", load: 60 },
        { time: "04:00 PM", load: 25 },
      ],
    },
    ludhiana: {
      name: "Ludhiana Central Procurement Hub (Punjab)",
      status: "Moderate Congestion",
      statusColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
      queueLength: "32 Tractors / Trucks",
      estWaitTime: "42 Minutes",
      weighingBridge: "3/4 Operational (75% capacity)",
      moistureLab: "1/2 Labs Running (Lab #2 Calibrating)",
      aiAdvice:
        "Book 03:00 PM slot to bypass current moisture testing lab queue.",
      peakHours: [
        { time: "08:00 AM", load: 45 },
        { time: "10:00 AM", load: 75 },
        { time: "12:00 PM", load: 95 },
        { time: "02:00 PM", load: 50 },
        { time: "04:00 PM", load: 30 },
      ],
    },
    nalgonda: {
      name: "Nalgonda Paddy Mandi (Telangana)",
      status: "Low Queue • Smooth Flow",
      statusColor: "bg-green-100 text-green-800 border-green-300",
      queueLength: "6 Vehicles",
      estWaitTime: "8 Minutes",
      weighingBridge: "2/2 Operational (100% capacity)",
      moistureLab: "2/2 Labs Running (Fast Track)",
      aiAdvice: "Excellent time for arrival. No waiting expected.",
      peakHours: [
        { time: "08:00 AM", load: 15 },
        { time: "10:00 AM", load: 30 },
        { time: "12:00 PM", load: 45 },
        { time: "02:00 PM", load: 40 },
        { time: "04:00 PM", load: 15 },
      ],
    },
  };

  const current = mandiData[selectedMandi];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 border-b border-[#1A2E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal text-[#F2F0E8] tracking-wide">Live Mandi Queue Telemetry</h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                Real-Time Bottleneck & SLA Tracker
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer ${isRefreshing ? "animate-spin" : ""}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-[#071008] font-mono">
          {/* Mandi Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Object.keys(mandiData).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMandi(key)}
                className={`px-4 py-2 border text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedMandi === key
                    ? "bg-[#164A29] text-[#F2F0E8] border-[#79C267]/50"
                    : "bg-[#050805] text-[#A6ADA3] border-[#1A2E1E] hover:border-[#79C267]/30 hover:text-[#F2F0E8]"
                }`}
              >
                {mandiData[key].name.split(" ")[0]} Mandi
              </button>
            ))}
          </div>

          {/* Mandi Info Card */}
          <div className="bg-[#050805] p-5 border border-[#1A2E1E] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-3">
              <div>
                <h4 className="text-lg font-serif text-[#F2F0E8]">
                  {current.name}
                </h4>
                <p className="text-[11px] font-mono text-[#A6ADA3]">
                  GPS Telemetry Stream • Live Updates Every 30s
                </p>
              </div>
              <span
                className="text-xs font-mono uppercase tracking-wider px-3 py-1 bg-[#0A180D] border border-[#79C267]/40 text-[#79C267]"
              >
                {current.status}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#071008] p-3 border border-[#1A2E1E]">
                <div className="flex items-center gap-1.5 text-[10px] text-[#A6ADA3] uppercase tracking-wider mb-1">
                  <Truck className="w-3.5 h-3.5 text-[#79C267]" />
                  Queue Length
                </div>
                <p className="text-sm font-mono text-[#F2F0E8]">
                  {current.queueLength}
                </p>
              </div>

              <div className="bg-[#071008] p-3 border border-[#1A2E1E]">
                <div className="flex items-center gap-1.5 text-[10px] text-[#A6ADA3] uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#79C267]" />
                  Est. Wait Time
                </div>
                <p className="text-sm font-mono text-[#79C267]">
                  {current.estWaitTime}
                </p>
              </div>

              <div className="bg-[#071008] p-3 border border-[#1A2E1E]">
                <div className="flex items-center gap-1.5 text-[10px] text-[#A6ADA3] uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#79C267]" />
                  Weighing Bridge
                </div>
                <p className="text-xs font-mono text-[#E8E7DE]">
                  {current.weighingBridge}
                </p>
              </div>

              <div className="bg-[#071008] p-3 border border-[#1A2E1E]">
                <div className="flex items-center gap-1.5 text-[10px] text-[#A6ADA3] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#79C267]" />
                  Moisture Lab
                </div>
                <p className="text-xs font-mono text-[#E8E7DE]">
                  {current.moistureLab}
                </p>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="bg-[#0A180D] p-3.5 border border-[#79C267]/40 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#79C267] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono text-[#79C267] uppercase tracking-wider block">
                  AI Prescriptive Intervention
                </span>
                <p className="text-xs font-serif text-[#F2F0E8] mt-0.5">
                  {current.aiAdvice}
                </p>
              </div>
            </div>

            {/* Peak Hours Forecast Bar Chart */}
            <div>
              <span className="text-xs font-mono text-[#A6ADA3] uppercase tracking-wider mb-2 block">
                Today's Congestion Peak Profile
              </span>
              <div className="flex items-end justify-between h-24 pt-4 px-2 bg-[#071008] border border-[#1A2E1E]">
                {current.peakHours.map((p, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                      style={{ height: `${p.load}%` }}
                      className={`w-6 transition-all duration-500 ${
                        p.load > 70
                          ? "bg-red-700 border border-red-500"
                          : p.load > 40
                            ? "bg-amber-700 border border-amber-500"
                            : "bg-[#164A29] border border-[#79C267]"
                      }`}
                    />
                    <span className="text-[10px] font-mono text-[#A6ADA3] mt-1">
                      {p.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              Close Live Tracker
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
