import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SolutionFlowSection() {
  const { t } = useApp();
  const [activeStage, setActiveStage] = useState(0);

  const loopStages = [
    {
      num: "01",
      title: "OBSERVE",
      sub: "Telemetry Ingestion",
      desc: "Real-time telemetry collection across 500+ Mandi weighbridges, gate intake lane sensors, and slot booking data.",
      detail: "Active Sensors: 524 • Sensor Polling: 1.2s • Status: ONLINE",
    },
    {
      num: "02",
      title: "PREDICT",
      sub: "Congestion Forecasting",
      desc: "Forecast queue length, expected waiting time, and vehicle arrival surges up to 72 hours in advance using Scikit-Learn models.",
      detail: "Model Accuracy: 94.8% • SLA Horizon: 72 Hours • Retrained Daily",
    },
    {
      num: "03",
      title: "EXPLAIN",
      sub: "Root Cause Analytics",
      desc: "Explainable AI (XAI) decomposes waiting time into specific operational factors — moisture lab testing, weighbridge loading, or tractor uncoupling.",
      detail: "XAI Breakdown: Weighbridge #2 (+35%), Moisture Lab (+15%)",
    },
    {
      num: "04",
      title: "IDENTIFY",
      sub: "Bottleneck Detection",
      desc: "Detect stage delays before queues stall. Trigger automated operational alert signals to Mandi Command Tower officers.",
      detail: "Alert Latency: < 2 Minutes • Threshold: 20% Variance",
    },
    {
      num: "05",
      title: "ACT",
      sub: "Smart Slot Allocation",
      desc: "Dynamically recommend optimal slot times to farmers and dispatch auxiliary operators to congested Mandi weighbridges.",
      detail: "Intake Flattening: 82% Staggered Adherence Achieved",
    },
    {
      num: "06",
      title: "VERIFY",
      sub: "Tamper-Evident Ledger",
      desc: "Record every procurement transition in a cryptographic SHA-256 ledger for 100% auditability and direct MSP DBT payout.",
      detail: "Ledger State: VERIFIED TAMPER-EVIDENT • Hash Chain Intact",
    },
  ];

  return (
    <section
      id="solution"
      className="w-full py-20 lg:py-28 bg-[#050805] text-[#E8E7DE] border-b border-[#1A2E1E]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono text-[#79C267] uppercase tracking-widest block">
            THE INTELLIGENCE LOOP
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F2F0E8] font-normal tracking-tight">
            How AgriProcure sees, acts, and verifies.
          </h2>
          <p className="text-xs text-[#A6ADA3] font-normal max-w-xl">
            A continuous operational feedback loop linking the farmer, mandi
            staff, and command officers through one synchronized engine.
          </p>
        </div>

        {/* Continuous Visual Loop Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {loopStages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={stage.title}
                onClick={() => setActiveStage(idx)}
                className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                  isActive
                    ? "bg-[#071008] border-[#79C267] shadow-xl ring-1 ring-[#79C267]/30"
                    : "bg-[#0A120C] border-[#1A2E1E] hover:border-[#315C38]"
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-2">
                  <span className="font-serif text-3xl text-[#79C267] font-normal">
                    {stage.num}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#79C267]" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono text-xs font-bold text-[#F2F0E8] tracking-wider">
                    {stage.title}
                  </h3>
                  <p className="text-[10px] text-[#A6ADA3]">{stage.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-6 bg-[#071008] rounded-2xl border border-[#1A2E1E] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A2E1E] pb-3">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl text-[#79C267]">
                {loopStages[activeStage].num}
              </span>
              <div>
                <h4 className="font-mono text-sm font-bold text-[#F2F0E8]">
                  {loopStages[activeStage].title} —{" "}
                  {loopStages[activeStage].sub}
                </h4>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[#79C267] bg-[#12351F] px-3 py-1 rounded-md border border-[#1A2E1E]">
              {loopStages[activeStage].detail}
            </span>
          </div>

          <p className="text-xs text-[#E8E7DE] leading-relaxed">
            {loopStages[activeStage].desc}
          </p>
        </div>
      </div>
    </section>
  );
}
