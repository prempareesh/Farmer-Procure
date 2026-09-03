import React, { useState } from "react";
import {
  UserCheck,
  Calendar,
  Ticket,
  Activity,
  TrendingUp,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sparkles,
  Eye,
  Building,
  BarChart3,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FeaturesView() {
  const { navigateTo, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: t("catAll") || "All Capabilities" },
    { id: "farmer", label: t("catFarmer") || "Farmer Portal" },
    { id: "intelligence", label: t("catIntelligence") || "AI Intelligence" },
    { id: "trust", label: t("catTrust") || "Trust & Security" },
    { id: "official", label: t("catOfficial") || "Official Management" },
  ];

  const featuresList = [
    // FARMER
    {
      category: "farmer",
      title: "Registration / Login",
      icon: UserCheck,
      desc: "Mobile OTP & Farmer ID authentication with JWT persistent session security.",
      actionLabel: "TEST LOGIN PORTAL",
      action: () => navigateTo("auth"),
      stepTarget: 1,
    },
    {
      category: "farmer",
      title: "Multi-Crop Profile",
      icon: Layers,
      desc: "Register and manage Paddy, Wheat, Mustard and coarse grains within one profile.",
      actionLabel: "SEE IN WORKFLOW →",
      action: () => navigateTo("how-it-works", { step: 1 }),
      stepTarget: 1,
    },
    {
      category: "farmer",
      title: "Slot Booking",
      icon: Calendar,
      desc: "Capacity-checked arrival scheduling to eliminate uncoordinated surges at Mandi gates.",
      actionLabel: "SEE IN WORKFLOW →",
      action: () => navigateTo("how-it-works", { step: 2 }),
      stepTarget: 2,
    },
    {
      category: "farmer",
      title: "Unique Token",
      icon: Ticket,
      desc: "Cryptographically hashed digital booking receipt pass linking farmer, crop and time slot.",
      actionLabel: "SEE TOKEN DEMO →",
      action: () => navigateTo("how-it-works", { step: 3 }),
      stepTarget: 3,
    },
    {
      category: "farmer",
      title: "Live Queue",
      icon: Activity,
      desc: "Real-time telemetry showing farmers ahead, current counter and estimated wait.",
      actionLabel: "TRACK LIVE QUEUE →",
      action: () => navigateTo("how-it-works", { step: 4 }),
      stepTarget: 4,
    },
    {
      category: "farmer",
      title: "Procurement Status",
      icon: CheckCircle2,
      desc: "Traceable stage updates from entry and quality check to weighing and payment.",
      actionLabel: "SEE LIFECYCLE →",
      action: () => navigateTo("how-it-works", { step: 6 }),
      stepTarget: 6,
    },

    // INTELLIGENCE
    {
      category: "intelligence",
      title: "Waiting-Time Prediction",
      icon: TrendingUp,
      desc: "Python/Scikit-learn model forecasting estimated gate-to-counter waiting minutes.",
      actionLabel: "SEE AI MODEL →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },
    {
      category: "intelligence",
      title: "Demand Prediction",
      icon: BarChart3,
      desc: "Arrival volume forecasting based on registered crop yields and booking density.",
      actionLabel: "SEE AI MODEL →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },
    {
      category: "intelligence",
      title: "Congestion Prediction",
      icon: Sparkles,
      desc: "Early warning risk scoring (LOW, MODERATE, HIGH) before bottleneck formation.",
      actionLabel: "SEE AI MODEL →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },
    {
      category: "intelligence",
      title: "Bottleneck Detection",
      icon: Cpu,
      desc: "Automated identification of operational delays at weighbridges or quality counters.",
      actionLabel: "SEE AI MODEL →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },
    {
      category: "intelligence",
      title: "Smart Slot Recommendation",
      icon: Calendar,
      desc: "Optimal slot allocation engine suggesting lower-wait windows to arriving farmers.",
      actionLabel: "SEE AI MODEL →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },
    {
      category: "intelligence",
      title: "Explainable Prediction",
      icon: Eye,
      desc: "Transparent risk factors and rule-based fallback when model confidence is low.",
      actionLabel: "SEE AI MODEL →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },

    // TRUST
    {
      category: "trust",
      title: "JWT Authentication",
      icon: Lock,
      desc: "Secure stateless session tokens protecting user data and role-based access.",
      actionLabel: "VIEW AUDIT CHAIN →",
      action: () => navigateTo("audit"),
      stepTarget: 6,
    },
    {
      category: "trust",
      title: "Transaction Integrity",
      icon: ShieldCheck,
      desc: "End-to-end payload validation ensuring booking parameters remain untampered.",
      actionLabel: "VIEW AUDIT CHAIN →",
      action: () => navigateTo("audit"),
      stepTarget: 6,
    },
    {
      category: "trust",
      title: "SHA-256 / HMAC",
      icon: Lock,
      desc: "Cryptographic hash signatures stamped onto every milestone record.",
      actionLabel: "VIEW AUDIT CHAIN →",
      action: () => navigateTo("audit"),
      stepTarget: 6,
    },
    {
      category: "trust",
      title: "Tamper-Evident Audit Trail",
      icon: ShieldCheck,
      desc: "Sequential block hash linkage alerting staff immediately if previous records change.",
      actionLabel: "VIEW AUDIT CHAIN →",
      action: () => navigateTo("audit"),
      stepTarget: 6,
    },

    // OFFICIAL
    {
      category: "official",
      title: "Live Monitoring",
      icon: Building,
      desc: "Central command telemetry showing Mandi throughput, queue length and gate status.",
      actionLabel: "SEE IN WORKFLOW →",
      action: () => navigateTo("how-it-works", { step: 4 }),
      stepTarget: 4,
    },
    {
      category: "official",
      title: "Risk Alerts",
      icon: Sparkles,
      desc: "Immediate notifications sent to supervisors when surge threshold is breached.",
      actionLabel: "SEE IN WORKFLOW →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },
    {
      category: "official",
      title: "Bottleneck Visibility",
      icon: Cpu,
      desc: "Real-time processing time comparison (Current vs Baseline) per counter.",
      actionLabel: "SEE IN WORKFLOW →",
      action: () => navigateTo("how-it-works", { step: 5 }),
      stepTarget: 5,
    },
    {
      category: "official",
      title: "Recommended Actions",
      icon: CheckCircle2,
      desc: 'Actionable guidance (e.g., "Review weighing capacity") for staff decision support.',
      actionLabel: "SEE IN WORKFLOW →",
      action: () => navigateTo("how-it-works", { step: 6 }),
      stepTarget: 6,
    },
  ];

  const filteredFeatures =
    selectedCategory === "all"
      ? featuresList
      : featuresList.filter((f) => f.category === selectedCategory);

  return (
    <div className="w-full min-h-screen bg-[#FAFBF8] text-[#111827] flex flex-col justify-between selection:bg-[#2E7D32] selection:text-white">
      {/* Hero Header */}
      <section className="w-full py-16 lg:py-20 bg-[#FAFBF8] border-b border-[#E8EFE6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9]">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="text-[11px] font-black tracking-widest text-[#1B4318] uppercase">
              AGRIPROCURE SYSTEM CAPABILITIES
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
            WHAT AGRIPROCURE PROVIDES
          </h1>

          <p className="text-base sm:text-lg text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Explorable features designed for farmers, Mandi procurement staff,
            AI congestion analytics, and tamper-evident record security.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-10">
        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1B4318] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((item, idx) => {
            const Icon = item.icon;
            const isIntelligence = item.category === "intelligence";

            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                  isIntelligence
                    ? "bg-[#1B4318] text-white border-[#1B4318]"
                    : "bg-white text-[#111827] border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isIntelligence
                          ? "bg-white/10 text-[#F9A825]"
                          : "bg-[#E8F5E9] text-[#2E7D32]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isIntelligence
                          ? "bg-[#F9A825] text-gray-900"
                          : item.category === "trust"
                            ? "bg-amber-100 text-amber-900"
                            : item.category === "official"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-[#E8F5E9] text-[#1B4318]"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-extrabold ${isIntelligence ? "text-white" : "text-[#111827]"}`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-xs font-medium leading-relaxed ${isIntelligence ? "text-white/80" : "text-gray-600"}`}
                  >
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100/20">
                  <button
                    onClick={item.action}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isIntelligence
                        ? "bg-[#F9A825] text-gray-900 hover:bg-[#ffb732]"
                        : "bg-[#FAFBF8] text-[#1B4318] border border-gray-200 hover:bg-[#E8F5E9]"
                    }`}
                  >
                    <span>{item.actionLabel}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection Banner to How It Works */}
        <div className="bg-[#E8F5E9] p-8 rounded-3xl border border-[#C8E6C9] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-black text-[#2E7D32] uppercase tracking-wider">
              COMPLETE PRODUCT EXPERIENCE
            </span>
            <h4 className="text-xl font-extrabold text-[#1B4318]">
              WANT TO SEE HOW THESE FEATURES WORK TOGETHER?
            </h4>
            <p className="text-xs text-gray-600 font-medium">
              Explore the step-by-step interactive workflow from booking to
              procurement.
            </p>
          </div>

          <button
            onClick={() => navigateTo("how-it-works", { step: 1 })}
            className="px-6 py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs shadow-2xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>EXPLORE HOW IT WORKS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
