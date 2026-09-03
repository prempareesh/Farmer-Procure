import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  TrendingUp,
  HelpCircle,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function USPSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "OBSERVE",
      num: "01",
      title: "OBSERVE",
      subtitle: "Data Ingestion",
      icon: Eye,
      description:
        "Collect live procurement telemetry, Mandi arrivals, vehicle registrations, and historical MSP queue data in real-time.",
      metrics: "500+ Mandi Sensors Active",
      tag: "Real-Time Ingestion",
      detailCard: {
        heading: "Continuous Queue & Weight Telemetry",
        bullets: [
          "Automatic RFID & license plate scanning at Mandi gates",
          "Live weighing bridge integration for crop load measurement",
          "Weather & crop harvest trend data streams",
        ],
      },
    },
    {
      id: "PREDICT",
      num: "02",
      title: "PREDICT",
      subtitle: "Congestion Forecasting",
      icon: TrendingUp,
      description:
        "Forecast queue length, estimated waiting times, and surge spikes up to 72 hours in advance using predictive AI algorithms.",
      metrics: "94.8% Congestion Accuracy",
      tag: "Predictive AI",
      detailCard: {
        heading: "Deep Queue Length Neural Models",
        bullets: [
          "Arrival rate vs. processing throughput forecasting",
          "Wait-time distribution estimation per Mandi slot",
          "Peak hour congestion warnings sent to farmers via SMS",
        ],
      },
    },
    {
      id: "EXPLAIN",
      num: "03",
      title: "EXPLAIN",
      subtitle: "Root Cause Analytics",
      icon: HelpCircle,
      description:
        "Show explainable insights into why congestion may occur — whether due to weighing delay, moisture testing, or unloading equipment.",
      metrics: "XAI Bottleneck Breakdown",
      tag: "Explainable AI (XAI)",
      detailCard: {
        heading: "Transparent Decision Explainability",
        bullets: [
          "Identify exact delay vectors (e.g., Moisture Testing Lab overload)",
          "Shapley value breakdown of gate congestion drivers",
          "Transparent reason codes for recommended schedule adjustments",
        ],
      },
    },
    {
      id: "IDENTIFY",
      num: "04",
      title: "IDENTIFY",
      subtitle: "Operational Bottlenecks",
      icon: AlertTriangle,
      description:
        "Automatically detect operational bottlenecks in real time and notify procurement officers before queues stall.",
      metrics: "< 2 Min Alert Latency",
      tag: "Anomaly Detection",
      detailCard: {
        heading: "Instant Bottleneck Isolation",
        bullets: [
          "Real-time alert dispatch to Mandi Supervisors",
          "Stalled tractor queue isolation & rerouting triggers",
          "Moisture meter calibration & lab check warnings",
        ],
      },
    },
    {
      id: "ACT",
      num: "05",
      title: "ACT",
      subtitle: "Smart Slot Allocation",
      icon: Zap,
      description:
        "Recommend optimal slot times to farmers, dynamically balancing Mandi loads and eliminating hours of waiting in line.",
      metrics: "Smooth Arrival Distribution",
      tag: "Dynamic Load Balancing",
      detailCard: {
        heading: "Farmer-Centric Smart Scheduling",
        bullets: [
          "Multi-channel slot booking (Web, WhatsApp, USSD, CSC)",
          "Staggered token allocation with 15-minute precision",
          "Priority routing for elderly & small-holder farmers",
        ],
      },
    },
    {
      id: "VERIFY",
      num: "06",
      title: "VERIFY",
      subtitle: "Tamper-Evident Chain",
      icon: CheckCircle2,
      description:
        "Maintain immutable, tamper-evident SHA-256 digital audit trails for every transaction to guarantee trust & MSP compliance.",
      metrics: "100% Cryptographic Audit",
      tag: "Trusted Audit Chain",
      detailCard: {
        heading: "Cryptographic MSP Receipt Verification",
        bullets: [
          "SHA-256 hash generation for every slot & weighing slip",
          "Immutable audit ledger preventing fraud & fake tokens",
          "Publicly verifiable digital receipt for payment disbursement",
        ],
      },
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FAF8F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#A5D6A7]">
            OUR USP & CORE PIPELINE
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#1B1B1B]">
            How Procure Intelligence Works
          </h2>
          <p className="mt-3 text-base text-gray-600 font-medium">
            From raw Mandi queue observation to cryptographic verification — an
            end-to-end AI workflow built for trust and speed.
          </p>
        </div>

        {/* Pipeline Step Navigator */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 border text-center ${
                  isActive
                    ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-lg shadow-[#2E7D32]/20 scale-105 z-10"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#2E7D32] hover:bg-[#E8F5E9]/40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F5E9] text-[#2E7D32]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black tracking-wider">
                  {step.title}
                </span>
                <span
                  className={`text-[10px] font-medium mt-1 ${
                    isActive ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {step.subtitle}
                </span>

                {/* Arrow connector between steps on lg */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-gray-300 pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Step Detail Active Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Detail Content */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1 rounded-xl">
                    Stage {steps[activeStep].num}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F9A825]/15 text-[#B78103] border border-[#F9A825]/30">
                    {steps[activeStep].tag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">
                  {steps[activeStep].title}: {steps[activeStep].subtitle}
                </h3>

                <p className="text-base text-gray-700 leading-relaxed font-medium">
                  {steps[activeStep].description}
                </p>

                <div className="pt-2">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">
                    Key Operational Features:
                  </h4>
                  <ul className="space-y-2.5">
                    {steps[activeStep].detailCard.bullets.map(
                      (bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-sm text-gray-700 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* Right Visual Tech Box */}
              <div className="lg:col-span-5 bg-[#FAF8F2] rounded-2xl p-6 border border-[#E8E4D9]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      System Status
                    </span>
                    <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-ping" />
                      Active SLA Model
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2">
                    <p className="text-xs text-gray-500 font-semibold">
                      Engine Metric:
                    </p>
                    <p className="text-xl font-black text-[#2E7D32]">
                      {steps[activeStep].metrics}
                    </p>
                  </div>

                  <div className="bg-[#1B4318] text-white p-4 rounded-xl space-y-2 font-mono text-xs">
                    <div className="text-white/60 text-[10px]">
                      # Cryptographic Payload Hash
                    </div>
                    <div className="text-[#A5D6A7] break-all">
                      SHA256: 7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a
                    </div>
                    <div className="text-[10px] text-white/50 pt-1">
                      Status: Verified & Tamper-Evident
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
