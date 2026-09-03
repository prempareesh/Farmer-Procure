import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Calendar,
  Ticket,
  Activity,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  QrCode,
  ChevronRight,
  ChevronLeft,
  Building,
  ShieldCheck,
  Cpu,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AboutView() {
  const { navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [journeyStep, setJourneyStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const steps = [
    {
      num: "01",
      title: "FARMER",
      shortTitle: "FARMER",
      techTag: "FARMER ↓ USER REQUEST",
      explanation:
        "Farmer logs in and selects the crop and quantity for procurement.",
      icon: UserCheck,
      isAi: false,
    },
    {
      num: "02",
      title: "BOOK SLOT",
      shortTitle: "BOOK SLOT",
      techTag: "USER REQUEST → API → BACKEND → DATABASE",
      explanation:
        "The system checks available capacity before confirming the selected slot.",
      icon: Calendar,
      isAi: false,
    },
    {
      num: "03",
      title: "SMART TOKEN",
      shortTitle: "TOKEN",
      techTag: "BOOKING REQUEST → BACKEND → UNIQUE TOKEN → DATABASE",
      explanation:
        "After successful booking, the backend generates a unique token linked to the procurement request.",
      icon: Ticket,
      isAi: false,
    },
    {
      num: "04",
      title: "LIVE QUEUE",
      shortTitle: "QUEUE",
      techTag: "LIVE STATUS UPDATE",
      explanation:
        "The farmer can see live queue progress and estimated waiting time.",
      icon: Activity,
      isAi: false,
    },
    {
      num: "05",
      title: "AI PREDICTION",
      shortTitle: "AI PREDICTION",
      techTag:
        "LIVE DATA → PANDAS / NUMPY → PYTHON + SCIKIT-LEARN → PREDICTION → SMART RECOMMENDATION",
      explanation:
        "The system analyses current and historical operational patterns to estimate congestion and recommend a better arrival window.",
      icon: TrendingUp,
      isAi: true,
    },
    {
      num: "06",
      title: "SMART ACTION",
      shortTitle: "ACTION",
      techTag: "PRACTICAL ACTIONS FOR FARMER & OFFICIAL",
      explanation:
        "Predictions become practical actions for both farmers and procurement staff.",
      icon: Cpu,
      isAi: false,
    },
    {
      num: "07",
      title: "PROCUREMENT",
      shortTitle: "PROCUREMENT",
      techTag: "STATUS UPDATE",
      explanation:
        "Each stage updates the transaction status so progress remains visible.",
      icon: CheckCircle2,
      isAi: false,
    },
    {
      num: "08",
      title: "AUDIT",
      shortTitle: "AUDIT",
      techTag: "JWT + SHA-256 + HMAC",
      explanation:
        "Authentication controls access, while cryptographic integrity mechanisms help detect changes to critical records.",
      icon: ShieldCheck,
      isAi: false,
    },
  ];

  const activeStep = steps[journeyStep];
  const ActiveIcon = activeStep.icon;

  const goNextStep = () => {
    if (journeyStep < steps.length - 1) {
      setDirection(1);
      setJourneyStep((prev) => prev + 1);
    }
  };

  const goPrevStep = () => {
    if (journeyStep > 0) {
      setDirection(-1);
      setJourneyStep((prev) => prev - 1);
    }
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFBF8] text-[#111827] flex flex-col justify-between selection:bg-[#2E7D32] selection:text-white">
      {/* SECTION 01 — HERO */}
      <section className="relative w-full py-16 lg:py-24 bg-[#FAFBF8] border-b border-[#E8EFE6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9]">
                <Building className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span className="text-[11px] font-black tracking-widest text-[#1B4318] uppercase">
                  ABOUT AGRIPROCURE
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.08]">
                SMARTER PROCUREMENT.
                <br />
                <span className="text-[#1B4318]">
                  FROM BOOKING TO BETTER DECISIONS.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
                AgriProcure connects farmers and procurement centres through
                intelligent slot booking, live queue visibility, predictive
                analytics and traceable procurement workflows.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection("farmer-experience")}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-sm shadow-2xs transition-all cursor-pointer active:scale-98"
                >
                  <span>EXPLORE FARMER JOURNEY</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#111827] font-bold text-sm border border-gray-300 shadow-2xs transition-all cursor-pointer active:scale-98"
                >
                  <span>EXPLORE HOW IT WORKS</span>
                  <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
                </button>
              </div>
            </div>

            {/* Right Hero Product Composition Showcase */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3 font-sans">
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>PRODUCT INTERFACE SUITE SHOWCASE</span>
                <span className="text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full font-bold">
                  INTEGRATED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Farmer UI Mock */}
                <div className="bg-[#FAFBF8] p-3 rounded-2xl border border-gray-200 space-y-1">
                  <div className="text-[9px] text-[#2E7D32] font-black uppercase">
                    FARMER PORTAL
                  </div>
                  <div className="font-extrabold text-[#111827]">
                    Rameshwar Singh
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Paddy • 25 Qtl
                  </div>
                  <div className="bg-[#1B4318] text-white text-[9px] font-bold px-2 py-1 rounded-lg text-center mt-2">
                    Slot Booked 02:00 PM
                  </div>
                </div>

                {/* Queue UI Mock */}
                <div className="bg-[#FAFBF8] p-3 rounded-2xl border border-gray-200 space-y-1">
                  <div className="text-[9px] text-[#2E7D32] font-black uppercase">
                    LIVE QUEUE
                  </div>
                  <div className="font-extrabold text-[#111827]">
                    Token #P-147
                  </div>
                  <div className="text-[10px] text-amber-700 font-bold">
                    Est. Wait: 42 min
                  </div>
                  <div className="bg-[#E8F5E9] text-[#1B4318] text-[9px] font-bold px-2 py-1 rounded-lg text-center mt-2">
                    Position #19
                  </div>
                </div>

                {/* AI Prediction UI Mock */}
                <div className="bg-[#1B4318] text-white p-3 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-[9px] text-[#F9A825] font-black uppercase">
                    AI PREDICTION
                  </div>
                  <div className="text-[11px] font-extrabold">
                    Queue 72 • Risk HIGH
                  </div>
                  <div className="text-[10px] text-[#C8E6C9]">
                    Smart Slot: 02:00 PM
                  </div>
                  <div className="text-[9px] text-white/70">
                    Wait reduced to 19 min
                  </div>
                </div>

                {/* Official Dashboard UI Mock */}
                <div className="bg-[#FAFBF8] p-3 rounded-2xl border border-gray-200 space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-[9px] text-[#1B4318] font-black uppercase">
                    OFFICIAL COMMAND
                  </div>
                  <div className="font-extrabold text-red-600 text-[11px]">
                    Weighing Bottleneck
                  </div>
                  <div className="text-[10px] text-gray-600">Capacity 80%</div>
                  <div className="bg-red-50 text-red-800 text-[9px] font-bold px-2 py-1 rounded-lg text-center mt-2 border border-red-200">
                    Review Capacity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY SECTION NAVIGATION BAR */}
      <div className="sticky top-[61px] z-30 w-full bg-[#FAFBF8]/95 backdrop-blur-md border-b border-[#E8EFE6] px-6 lg:px-12 py-3 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[700px] text-xs font-bold">
          {[
            { id: "overview", label: "Overview" },
            { id: "features-map", label: "Feature Map" },
            { id: "how-it-works", label: "How It Works" },
            { id: "farmer-experience", label: "Farmer Experience" },
            { id: "official-experience", label: "Official Experience" },
            { id: "trust-security", label: "Trust & Security" },
            { id: "architecture", label: "Architecture" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-[#1B4318] text-white shadow-xs"
                  : "text-gray-600 hover:text-[#1B4318] hover:bg-[#E8F5E9]/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-20">
        {/* SECTION 02 — WHAT IS AGRIPROCURE? */}
        <section id="overview" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              WHAT IS AGRIPROCURE?
            </h2>
          </div>

          {/* System Architecture Visual Diagram */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-5 text-xs font-sans">
              <div className="px-6 py-3 rounded-2xl bg-[#1B4318] text-white font-black text-base shadow-sm tracking-wide">
                AGRIPROCURE
              </div>

              <div className="w-full border-t-2 border-dashed border-[#2E7D32]" />

              <div className="grid grid-cols-2 gap-8 sm:gap-16 w-full text-center">
                <div className="bg-[#FAFBF8] p-4 rounded-2xl border border-gray-200 space-y-1">
                  <div className="text-xs font-black text-[#2E7D32] uppercase">
                    FARMER
                  </div>
                  <div className="text-xs font-bold text-gray-700 bg-white p-2 rounded-xl border border-gray-200">
                    BOOK & TRACK
                  </div>
                </div>

                <div className="bg-[#FAFBF8] p-4 rounded-2xl border border-gray-200 space-y-1">
                  <div className="text-xs font-black text-[#1B4318] uppercase">
                    OFFICIAL
                  </div>
                  <div className="text-xs font-bold text-gray-700 bg-white p-2 rounded-xl border border-gray-200">
                    MONITOR & ACT
                  </div>
                </div>
              </div>

              <div className="text-[#2E7D32]">
                <ArrowDown className="w-4 h-4" />
              </div>

              <div className="w-full bg-[#FAFBF8] p-3 rounded-xl border border-gray-200 text-center font-bold text-gray-700">
                SHARED DATA
              </div>

              <div className="text-[#2E7D32]">
                <ArrowDown className="w-4 h-4" />
              </div>

              <div className="w-full bg-[#1B4318] text-white p-3 rounded-xl text-center font-extrabold">
                AI INTELLIGENCE
              </div>

              <div className="text-[#2E7D32]">
                <ArrowDown className="w-4 h-4" />
              </div>

              <div className="w-full bg-[#E8F5E9] text-[#1B4318] p-3.5 rounded-xl border border-[#C8E6C9] text-center font-black uppercase tracking-wider">
                BETTER DECISIONS
              </div>
            </div>
          </div>

          <p className="text-center text-sm sm:text-base text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
            "AgriProcure is a predictive procurement platform that helps farmers
            plan their arrival while giving procurement staff visibility into
            queues, congestion and operational bottlenecks."
          </p>
        </section>

        {/* SECTION 03 — FEATURES (CONNECTED FEATURE MAP) */}
        <section
          id="features-map"
          className="space-y-8 border-t border-gray-200 pt-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              WHAT AGRIPROCURE PROVIDES
            </h2>
            <p className="text-sm font-semibold text-gray-600">
              Interconnected core capabilities grouped by role and system
              intelligence.
            </p>
          </div>

          {/* Connected Feature Map Visual */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <span className="px-6 py-2.5 rounded-2xl bg-[#1B4318] text-white font-black text-sm uppercase tracking-wider">
                AGRIPROCURE CORE PLATFORM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* FARMER GROUP */}
              <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="text-xs font-black text-[#2E7D32] uppercase pb-2 border-b border-gray-200 flex items-center justify-between">
                  <span>FARMER</span>
                  <span>BOOKING</span>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />{" "}
                    Registration & Login
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />{" "}
                    Multi-Crop Profile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" /> Slot
                    Booking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />{" "}
                    Unique Token
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" /> Live
                    Queue
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />{" "}
                    Procurement Status
                  </li>
                </ul>
              </div>

              {/* INTELLIGENCE GROUP */}
              <div className="bg-[#1B4318] text-white p-5 rounded-2xl space-y-3 shadow-sm">
                <div className="text-xs font-black text-[#F9A825] uppercase pb-2 border-b border-white/15 flex items-center justify-between">
                  <span>INTELLIGENCE</span>
                  <span>PREDICT</span>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-white/90">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" />{" "}
                    Waiting-Time Prediction
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" /> Demand
                    Prediction
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" />{" "}
                    Congestion Prediction
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" />{" "}
                    Bottleneck Detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" /> Smart
                    Slot Recommendation
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" />{" "}
                    Explainable Prediction
                  </li>
                </ul>
              </div>

              {/* OFFICIAL GROUP */}
              <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="text-xs font-black text-[#1B4318] uppercase pb-2 border-b border-gray-200 flex items-center justify-between">
                  <span>OFFICIAL</span>
                  <span>MONITOR</span>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4318]" /> Live
                    Monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4318]" /> Risk
                    Alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4318]" />{" "}
                    Bottleneck Visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4318]" />{" "}
                    Recommended Actions
                  </li>
                </ul>
              </div>
            </div>

            {/* TRUST LAYER AT BOTTOM */}
            <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#C8E6C9] flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#1B4318]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>
                  TRUST LAYER: JWT AUTHENTICATION • SHA-256 / HMAC INTEGRITY •
                  TAMPER-EVIDENT AUDIT TRAIL
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigateTo("home")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-[#1B4318] font-bold text-xs border border-gray-300 shadow-2xs transition-all cursor-pointer"
            >
              <span>VIEW ALL FEATURES</span>
              <ArrowRight className="w-4 h-4 text-[#2E7D32]" />
            </button>
          </div>
        </section>

        {/* SECTION 04 — HOW IT WORKS (INTERACTIVE STEP-BY-STEP PROCESS) */}
        <section
          id="how-it-works"
          className="space-y-8 border-t border-gray-200 pt-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              HOW AGRIPROCURE WORKS
            </h2>
            <p className="text-sm font-semibold text-gray-600">
              From a farmer's first request to completed procurement.
            </p>
          </div>

          {/* Interactive Step Navigator Bar */}
          <div className="w-full overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center justify-between min-w-[700px] border-b border-gray-200 pb-3 px-2">
              {steps.map((s, idx) => {
                const isActive = idx === journeyStep;
                const isPast = idx < journeyStep;
                return (
                  <button
                    key={s.num}
                    onClick={() => {
                      setDirection(idx > journeyStep ? 1 : -1);
                      setJourneyStep(idx);
                    }}
                    className="flex items-center gap-1.5 cursor-pointer group"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isActive
                          ? "bg-[#1B4318] text-white scale-105"
                          : isPast
                            ? "bg-[#E8F5E9] text-[#2E7D32]"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {s.num}
                    </div>
                    <span
                      className={`text-xs font-bold ${isActive ? "text-[#1B4318]" : "text-gray-400"}`}
                    >
                      {s.shortTitle}
                    </span>
                    {idx < steps.length - 1 && (
                      <span className="text-gray-300 ml-1">→</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Step Content Container */}
          <div className="relative min-h-[420px] max-w-4xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={journeyStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xs"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activeStep.isAi
                          ? "bg-[#1B4318] text-[#F9A825]"
                          : "bg-[#E8F5E9] text-[#2E7D32]"
                      }`}
                    >
                      <ActiveIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#2E7D32]">
                          STAGE {activeStep.num}
                        </span>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#111827]">
                          {activeStep.title}
                        </h3>
                        {activeStep.isAi && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#F9A825] text-gray-900">
                            CORE USP
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 font-bold block mt-0.5">
                        {activeStep.techTag}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {activeStep.num} / 08
                  </span>
                </div>

                {/* UI MOCKUPS FOR EACH OF THE 8 STAGES */}
                <div className="my-2">
                  {/* STEP 01 — FARMER */}
                  {journeyStep === 0 && (
                    <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 space-y-3 font-sans">
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 text-xs font-bold">
                        <div>Rameshwar Singh (FRM-2026-000123)</div>
                        <span className="text-[#2E7D32]">Taraori, Karnal</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                          Paddy (Basmati) • 90 Qtl
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                          Wheat (Sharbati) • 135 Qtl
                        </div>
                      </div>
                      <div className="bg-[#1B4318] text-white p-2.5 rounded-xl text-center text-xs font-bold">
                        [ BOOK PROCUREMENT SLOT ]
                      </div>
                    </div>
                  )}

                  {/* STEP 02 — BOOK SLOT */}
                  {journeyStep === 1 && (
                    <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 space-y-3 font-sans">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                          Crop: Paddy (Basmati)
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                          Quantity: 25 Quintal
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                        <div className="bg-white p-2 rounded-xl border border-gray-200 opacity-60">
                          08:00 AM AVAILABLE
                        </div>
                        <div className="bg-red-50 p-2 rounded-xl border border-red-200 text-red-700">
                          09:00 AM FULL
                        </div>
                        <div className="bg-[#E8F5E9] p-2 rounded-xl border-2 border-[#2E7D32] text-[#1B4318] font-black">
                          02:00 PM CONFIRMED
                        </div>
                      </div>
                      <div className="bg-[#1B4318] text-white p-2.5 rounded-xl text-center text-xs font-bold">
                        CONFIRM SLOT
                      </div>
                    </div>
                  )}

                  {/* STEP 03 — SMART TOKEN */}
                  {journeyStep === 2 && (
                    <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 space-y-3 font-sans">
                      <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex justify-between text-xs font-bold border-b border-gray-100 pb-2">
                          <span className="text-[#2E7D32]">
                            BOOKING CONFIRMED ✓
                          </span>
                          <span className="text-gray-400 font-mono">
                            BK-2026-00147
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                              TOKEN NUMBER
                            </div>
                            <div className="text-3xl font-black text-[#1B4318]">
                              P-147
                            </div>
                          </div>
                          <QrCode className="w-12 h-12 text-[#1B4318]" />
                        </div>
                        <div className="text-[11px] text-gray-600">
                          Paddy • 25 Qtl • Karnal Mandi • 02:00 PM – 02:30 PM
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 04 — LIVE QUEUE */}
                  {journeyStep === 3 && (
                    <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 space-y-3 font-sans">
                      <div className="bg-[#1B4318] text-white p-3 rounded-xl flex justify-between text-xs font-bold">
                        <div>TOKEN P-147</div>
                        <div className="text-[#F9A825]">Est. Wait: 42 min</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                        <div className="bg-white p-2 rounded-xl border border-gray-200">
                          Ahead: 18
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-gray-200">
                          Counter: 03
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-gray-200">
                          Wait: 42m
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-gray-200">
                          Pos: #19
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200">
                        <span className="text-[#2E7D32]">ENTRY ✓</span> →{" "}
                        <span className="text-[#2E7D32]">QUALITY ✓</span> →{" "}
                        <span className="text-amber-800 bg-amber-100 px-1 rounded">
                          WEIGHING ●
                        </span>{" "}
                        → <span className="text-gray-400">PROCUREMENT ○</span>
                      </div>
                    </div>
                  )}

                  {/* STEP 05 — AI PREDICTION */}
                  {journeyStep === 4 && (
                    <div className="bg-[#1B4318] text-white p-5 rounded-2xl space-y-3 font-sans shadow-md">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                        <div className="bg-white/10 p-2 rounded-lg">
                          Queue: 72
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg">
                          Arrivals: 24
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg text-[#F9A825]">
                          Wait: 42 min
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg text-red-400">
                          Risk: HIGH
                        </div>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-xl text-[10px] font-mono flex justify-between text-white/70">
                        <span>Actual vs Predicted Forecast</span>
                        <span className="text-[#81C784]">
                          Scikit-learn Model
                        </span>
                      </div>
                      <div className="bg-[#2E7D32] p-3 rounded-xl text-xs space-y-0.5">
                        <div className="text-[9px] text-[#C8E6C9] font-black uppercase">
                          SMART SLOT RECOMMENDATION
                        </div>
                        <div className="font-extrabold text-white text-sm">
                          Recommended: 02:00 PM – 02:30 PM
                        </div>
                        <div className="text-[11px] text-[#E8F5E9]">
                          Expected wait: 19 min
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 06 — SMART ACTION */}
                  {journeyStep === 5 && (
                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                      <div className="bg-[#FAFBF8] p-4 rounded-xl border border-gray-200 space-y-1">
                        <div className="text-[#2E7D32] font-black">
                          FARMER ACTION
                        </div>
                        <div>Recommended Slot: 02:00 PM</div>
                        <div className="text-gray-500">
                          Expected Wait: 19 min
                        </div>
                      </div>
                      <div className="bg-[#FAFBF8] p-4 rounded-xl border border-gray-200 space-y-1">
                        <div className="text-[#1B4318] font-black">
                          OFFICIAL ACTION
                        </div>
                        <div className="text-red-700 font-bold">
                          Bottleneck: WEIGHING
                        </div>
                        <div className="text-[#1B4318] font-bold">
                          Action: "Review capacity"
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 07 — PROCUREMENT */}
                  {journeyStep === 6 && (
                    <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 font-sans space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-xs font-bold text-gray-700">
                        <div className="bg-white p-2 rounded-xl border text-[#2E7D32]">
                          BOOKED ✓
                        </div>
                        <div className="bg-white p-2 rounded-xl border text-[#2E7D32]">
                          ARRIVED ✓
                        </div>
                        <div className="bg-white p-2 rounded-xl border text-[#2E7D32]">
                          QUALITY ✓
                        </div>
                        <div className="bg-amber-100 p-2 rounded-xl border text-amber-900">
                          WEIGHING ●
                        </div>
                        <div className="bg-white p-2 rounded-xl border text-gray-400">
                          PROCUREMENT ○
                        </div>
                        <div className="bg-white p-2 rounded-xl border text-gray-400">
                          PAYMENT ○
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 08 — AUDIT */}
                  {journeyStep === 7 && (
                    <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 font-mono text-xs space-y-3">
                      <div className="flex justify-between text-[11px] font-bold text-[#1B4318] border-b border-gray-200 pb-2">
                        <span>CRYPTOGRAPHIC INTEGRITY LINK</span>
                        <span>JWT + SHA-256 + HMAC</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center font-bold text-[#2E7D32]">
                        RECORD HASH A → RECORD HASH B → RECORD HASH C (VERIFIED
                        ✓)
                      </div>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-center">
                  <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                    "{activeStep.explanation}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Nav Buttons */}
          <div className="flex items-center justify-between max-w-4xl mx-auto pt-4">
            <button
              onClick={goPrevStep}
              disabled={journeyStep === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                journeyStep === 0
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white text-[#111827] border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>

            <div className="flex items-center gap-2">
              {steps.map((s, idx) => (
                <button
                  key={s.num}
                  onClick={() => {
                    setDirection(idx > journeyStep ? 1 : -1);
                    setJourneyStep(idx);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    idx === journeyStep
                      ? "w-6 h-2 bg-[#2E7D32]"
                      : "w-2 h-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNextStep}
              disabled={journeyStep === steps.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                journeyStep === steps.length - 1
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-[#1B4318] text-white hover:bg-[#2E7D32]"
              }`}
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigateTo("home")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1B4318] hover:underline cursor-pointer"
            >
              <span>EXPLORE HOW IT WORKS →</span>
            </button>
          </div>
        </section>

        {/* SECTION 05 — FARMER EXPERIENCE */}
        <section
          id="farmer-experience"
          className="space-y-8 border-t border-gray-200 pt-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              DESIGNED AROUND THE FARMER
            </h2>
          </div>

          {/* Timeline flow */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#111827] overflow-x-auto pb-2">
              <span>LOGIN</span> <span>→</span>
              <span>SELECT CROP</span> <span>→</span>
              <span>BOOK</span> <span>→</span>
              <span>TOKEN</span> <span>→</span>
              <span>TRACK</span> <span>→</span>
              <span>ARRIVE</span> <span>→</span>
              <span>PROCURE</span> <span>→</span>
              <span>VIEW STATUS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs font-bold">
              <div className="bg-[#FAFBF8] p-4 rounded-2xl border border-gray-200 text-[#1B4318]">
                LESS UNCERTAINTY
              </div>
              <div className="bg-[#FAFBF8] p-4 rounded-2xl border border-gray-200 text-[#1B4318]">
                BETTER ARRIVAL PLANNING
              </div>
              <div className="bg-[#FAFBF8] p-4 rounded-2xl border border-gray-200 text-[#1B4318]">
                LIVE VISIBILITY
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 06 — OFFICIAL EXPERIENCE */}
        <section
          id="official-experience"
          className="space-y-8 border-t border-gray-200 pt-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              FROM QUEUE MANAGEMENT TO OPERATIONAL INTELLIGENCE
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
              <div className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-200">
                <div className="text-[9px] text-gray-400 font-bold uppercase">
                  Queue
                </div>
                <div className="text-xl font-black text-[#111827]">72</div>
              </div>
              <div className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-200">
                <div className="text-[9px] text-gray-400 font-bold uppercase">
                  Waiting Time
                </div>
                <div className="text-xl font-black text-[#111827]">48 min</div>
              </div>
              <div className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-200">
                <div className="text-[9px] text-gray-400 font-bold uppercase">
                  Congestion Risk
                </div>
                <div className="text-xs font-black text-red-600 uppercase mt-1">
                  HIGH
                </div>
              </div>
              <div className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-200">
                <div className="text-[9px] text-gray-400 font-bold uppercase">
                  Centre Capacity
                </div>
                <div className="text-xl font-black text-[#1B4318]">80%</div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-xs font-bold text-red-800">
              BOTTLENECK DETECTED: WEIGHING
            </div>

            <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#C8E6C9] text-xs font-bold text-[#1B4318]">
              RECOMMENDED ACTION: "Review additional weighing capacity."
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold text-[#111827]">
              LIVE DATA → RISK → BOTTLENECK → ACTION
            </div>

            <p className="text-center text-xs text-gray-600 font-medium">
              "Officials can move from simply observing the queue to
              understanding where the process is slowing down."
            </p>
          </div>
        </section>

        {/* SECTION 07 — HOW THE INTELLIGENCE WORKS */}
        <section className="space-y-8 border-t border-gray-200 pt-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              FROM DATA TO DECISION
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-4xl mx-auto space-y-5 font-mono text-xs">
            <div className="bg-[#FAFBF8] p-4 rounded-xl border border-gray-200 text-center font-bold text-gray-700">
              HISTORICAL DATA + CURRENT BOOKINGS + QUEUE STATE + PROCESSING
              TIMES + ARRIVAL PATTERNS
            </div>

            <div className="text-center text-[#2E7D32]">↓</div>

            <div className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-200 text-center font-bold text-gray-700">
              DATA PROCESSING
            </div>

            <div className="text-center text-[#2E7D32]">↓</div>

            <div className="bg-[#1B4318] text-white p-3 rounded-xl text-center font-black">
              PYTHON + SCIKIT-LEARN
            </div>

            <div className="text-center text-[#2E7D32]">↓</div>

            <div className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-200 text-center font-bold text-[#111827]">
              WAIT-TIME • DEMAND • CONGESTION PREDICTION
            </div>

            <div className="text-center text-[#2E7D32]">↓</div>

            <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#C8E6C9] text-center font-extrabold text-[#1B4318]">
              SMART SLOT + OFFICIAL ACTION
            </div>
          </div>
        </section>

        {/* SECTION 08 — TRUST */}
        <section
          id="trust-security"
          className="space-y-8 border-t border-gray-200 pt-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              TRUST BUILT INTO THE FLOW
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-4xl mx-auto space-y-6">
            <div className="text-center text-xs font-mono font-bold text-gray-400">
              JWT AUTHENTICATION
            </div>

            <div className="flex items-center justify-between text-xs font-extrabold text-gray-700 bg-[#FAFBF8] p-4 rounded-2xl border border-gray-200 overflow-x-auto">
              <span>BOOKING</span> <span>→</span>
              <span>ARRIVAL</span> <span>→</span>
              <span>QUALITY</span> <span>→</span>
              <span>WEIGHING</span> <span>→</span>
              <span>PROCUREMENT</span> <span>→</span>
              <span>PAYMENT</span>
            </div>

            <div className="text-center text-xs font-mono font-bold text-[#2E7D32]">
              SHA-256 / HMAC INTEGRITY HASHING
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold text-[#1B4318]">
              <div className="bg-[#E8F5E9] p-3 rounded-xl border border-[#C8E6C9]">
                TRACEABLE
              </div>
              <div className="bg-[#E8F5E9] p-3 rounded-xl border border-[#C8E6C9]">
                TAMPER-EVIDENT
              </div>
              <div className="bg-[#E8F5E9] p-3 rounded-xl border border-[#C8E6C9]">
                REVIEWABLE
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 09 — TECHNICAL ARCHITECTURE */}
        <section
          id="architecture"
          className="space-y-8 border-t border-gray-200 pt-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              BEHIND THE EXPERIENCE
            </h2>
          </div>

          <div className="bg-[#FAFBF8] p-8 rounded-3xl border border-gray-200 max-w-4xl mx-auto space-y-4 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-white rounded-xl border border-gray-200 font-bold text-[#111827]">
              <span>FARMER / OFFICIAL</span> <span>→</span>
              <span>REACT</span> <span>→</span>
              <span>API REQUEST</span> <span>→</span>
              <span>NODE.JS + EXPRESS</span> <span>→</span>
              <span>SUPABASE / POSTGRESQL</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-[#E8F5E9] rounded-xl border border-[#C8E6C9] font-extrabold text-[#1B4318]">
              <span>DATA</span> <span>→</span>
              <span>PYTHON + SCIKIT-LEARN</span> <span>→</span>
              <span>PREDICTION</span> <span>→</span>
              <span>RECOMMENDATION</span> <span>→</span>
              <span>REACT DASHBOARD</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 text-center text-gray-500 font-bold">
              CROSS-CUTTING SECURITY: JWT AUTHENTICATION + SHA-256 / HMAC
              INTEGRITY
            </div>
          </div>
        </section>

        {/* SECTION 10 — COMPLETE SYSTEM */}
        <section className="space-y-8 border-t border-gray-200 pt-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              ONE FLOW. TWO USERS. BETTER DECISIONS.
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-5 text-xs font-sans">
              <div className="px-6 py-3 rounded-2xl bg-[#1B4318] text-white font-black text-sm">
                AGRIPROCURE
              </div>
              <div className="grid grid-cols-2 gap-12 w-full text-center">
                <div className="bg-[#FAFBF8] p-4 rounded-xl border border-gray-200 space-y-1">
                  <div className="font-extrabold text-[#2E7D32]">FARMER</div>
                  <div className="text-[11px] text-gray-600">
                    BOOK → TOKEN → QUEUE → AI PREDICTION
                  </div>
                </div>
                <div className="bg-[#FAFBF8] p-4 rounded-xl border border-gray-200 space-y-1">
                  <div className="font-extrabold text-[#1B4318]">OFFICIAL</div>
                  <div className="text-[11px] text-gray-600">
                    VIEW → RISK → BOTTLENECK → ACTION
                  </div>
                </div>
              </div>
              <div className="w-full bg-[#E8F5E9] p-3 rounded-xl border border-[#C8E6C9] text-center font-extrabold text-[#1B4318]">
                PROCUREMENT → VERIFY
              </div>
            </div>
          </div>
        </section>

        {/* Illustrative Prototype Notice */}
        <div className="text-center text-xs text-gray-400 font-medium pt-8 border-t border-gray-200">
          * Note: All metrics, booking references and figures on this page
          represent illustrative demonstration data for prototype evaluation.
        </div>
      </div>
    </div>
  );
}
