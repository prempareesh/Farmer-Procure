import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Calendar,
  Ticket,
  Activity,
  TrendingUp,
  Wrench,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function HowAgriProcureWorks({ initialStep = 0 }) {
  const { t } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(
    typeof initialStep === "number" && initialStep >= 0 && initialStep < 8
      ? initialStep
      : 0,
  );
  const [direction, setDirection] = useState(1);

  React.useEffect(() => {
    if (
      typeof initialStep === "number" &&
      initialStep >= 0 &&
      initialStep < 8
    ) {
      setCurrentStepIndex((prev) => {
        setDirection(initialStep > prev ? 1 : -1);
        return initialStep;
      });
    }
  }, [initialStep]);

  const steps = [
    {
      num: "01",
      title: t("step01Title"),
      shortTitle: t("step01Short"),
      techTag: t("step01Tech"),
      explanation: t("step01Desc"),
      icon: UserCheck,
    },
    {
      num: "02",
      title: t("step02Title"),
      shortTitle: t("step02Short"),
      techTag: t("step02Tech"),
      explanation: t("step02Desc"),
      icon: Calendar,
    },
    {
      num: "03",
      title: t("step03Title"),
      shortTitle: t("step03Short"),
      techTag: t("step03Tech"),
      explanation: t("step03Desc"),
      icon: Ticket,
    },
    {
      num: "04",
      title: t("step04Title"),
      shortTitle: t("step04Short"),
      techTag: t("step04Tech"),
      explanation: t("step04Desc"),
      icon: Activity,
    },
    {
      num: "05",
      title: t("step05Title"),
      shortTitle: t("step05Short"),
      techTag: t("step05Tech"),
      explanation: t("step05Desc"),
      icon: TrendingUp,
    },
    {
      num: "06",
      title: t("step06Title"),
      shortTitle: t("step06Short"),
      techTag: t("step06Tech"),
      explanation: t("step06Desc"),
      icon: Wrench,
    },
    {
      num: "07",
      title: t("step07Title"),
      shortTitle: t("step07Short"),
      techTag: t("step07Tech"),
      explanation: t("step07Desc"),
      icon: CheckCircle2,
    },
    {
      num: "08",
      title: t("step08Title"),
      shortTitle: t("step08Short"),
      techTag: t("step08Tech"),
      explanation: t("step08Desc"),
      icon: ShieldCheck,
    },
  ];

  const activeStep = steps[currentStepIndex];
  const Icon = activeStep.icon;

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const goToStep = (idx) => {
    setDirection(idx > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(idx);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <section
      id="how-it-works"
      className="w-full py-20 lg:py-28 bg-[#050805] text-[#E8E7DE] border-b border-[#1A2E1E] relative"
    >
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono text-[#79C267] uppercase tracking-widest block">
            INTERACTIVE SYSTEM DEMONSTRATION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F2F0E8] font-normal tracking-tight">
            From booking to payout — one trusted flow.
          </h2>
        </div>

        {/* STEP PROCESS NAVIGATION BAR */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[700px] border-b border-[#1A2E1E] pb-4">
            {steps.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={s.num}
                  onClick={() => goToStep(idx)}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-serif text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#12351F] text-[#79C267] border border-[#79C267]/50"
                        : isPast
                          ? "bg-[#071008] text-[#79C267] border border-[#1A2E1E]"
                          : "bg-[#071008] text-[#A6ADA3] border border-[#1A2E1E]"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-xs font-mono tracking-wider transition-colors ${
                      isActive
                        ? "text-[#79C267] font-bold"
                        : isPast
                          ? "text-[#E8E7DE]"
                          : "text-[#A6ADA3]"
                    }`}
                  >
                    {s.shortTitle}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="text-[#1A2E1E] ml-1">→</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE STEP DEMO CARD */}
        <div className="relative min-h-[420px] flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStepIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full bg-[#071008] rounded-2xl border border-[#1A2E1E] p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#12351F] border border-[#1A2E1E] flex items-center justify-center text-[#79C267]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#79C267] uppercase">
                        STEP {activeStep.num}
                      </span>
                      <h3 className="font-serif text-xl text-[#F2F0E8] font-normal">
                        {activeStep.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#A6ADA3] block mt-0.5">
                      {activeStep.techTag}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#A6ADA3]">
                  {activeStep.num} / 08
                </div>
              </div>

              {/* PRODUCT UI INTERFACE REPRESENTATION */}
              <div className="flex-1 my-2">
                {/* STEP 01 — FARMER UI */}
                {currentStepIndex === 0 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between bg-[#071008] p-3 rounded-lg border border-[#1A2E1E]">
                      <div>
                        <div className="font-bold text-[#F2F0E8]">
                          Rameshwar Singh
                        </div>
                        <div className="text-[10px] text-[#A6ADA3]">
                          FRM-2026-000123 • Karnal, Haryana
                        </div>
                      </div>
                      <span className="text-[10px] text-[#79C267] bg-[#12351F] px-2.5 py-1 rounded-md border border-[#1A2E1E]">
                        Aadhaar Verified ✓
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-[#A6ADA3] uppercase block">
                        REGISTERED CROPS:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#071008] p-3 rounded-lg border border-[#1A2E1E] flex items-center justify-between">
                          <span>Paddy (Basmati 1121) • 4.5 Acres</span>
                          <span className="text-[#79C267] font-bold">90 Qtl</span>
                        </div>
                        <div className="bg-[#071008] p-3 rounded-lg border border-[#1A2E1E] flex items-center justify-between">
                          <span>Wheat (Sharbati) • 6.0 Acres</span>
                          <span className="text-[#79C267] font-bold">135 Qtl</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={goNext}
                      className="w-full py-3 rounded-lg bg-[#12351F] hover:bg-[#164A29] border border-[#1A2E1E] text-[#F2F0E8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Select Procurement Slot →</span>
                    </button>
                  </div>
                )}

                {/* STEP 02 — BOOK SLOT UI */}
                {currentStepIndex === 1 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#071008] p-3 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[10px] text-[#A6ADA3] block">
                          CROP / QUANTITY
                        </span>
                        <span className="text-[#F2F0E8] font-bold">
                          Paddy Basmati • 25 Qtl
                        </span>
                      </div>
                      <div className="bg-[#071008] p-3 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[10px] text-[#A6ADA3] block">
                          TARGET MANDI HUB
                        </span>
                        <span className="text-[#F2F0E8] font-bold">
                          Karnal Mandi (HR)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg border border-[#1A2E1E] bg-[#071008] text-[#A6ADA3] text-center">
                        08:00 AM (Available)
                      </div>
                      <div className="p-2.5 rounded-lg border border-red-900/50 bg-red-950/30 text-red-400 text-center">
                        09:00 AM (Full)
                      </div>
                      <div className="p-2.5 rounded-lg border border-amber-900/50 bg-amber-950/30 text-amber-400 text-center">
                        10:00 AM (Limited)
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#79C267] bg-[#12351F] text-[#79C267] font-bold text-center">
                        02:00 PM (Recommended)
                      </div>
                    </div>

                    <button
                      onClick={goNext}
                      className="w-full py-2.5 rounded-lg bg-[#12351F] hover:bg-[#164A29] border border-[#1A2E1E] text-[#F2F0E8] font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Confirm Procurement Slot →
                    </button>
                  </div>
                )}

                {/* STEP 03 — SMART TOKEN UI */}
                {currentStepIndex === 2 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#79C267] font-bold">
                        SLOT RESERVATION CONFIRMED
                      </span>
                      <span className="text-[#A6ADA3]">BK-2026-00147</span>
                    </div>

                    <div className="flex items-center justify-between bg-[#071008] p-4 rounded-lg border border-[#1A2E1E]">
                      <div>
                        <span className="text-[10px] text-[#A6ADA3] block">
                          ASSIGNED TOKEN
                        </span>
                        <span className="font-mono text-3xl font-bold text-[#79C267]">
                          P-147
                        </span>
                      </div>
                      <QrCode className="w-10 h-10 text-[#79C267]" />
                    </div>

                    <div className="text-[11px] text-[#A6ADA3] space-y-1">
                      <p>• Paddy (Basmati 1121) • 25 Quintal</p>
                      <p>• Karnal Mandi Hub • Slot: 02:00 PM - 02:30 PM</p>
                    </div>
                  </div>
                )}

                {/* STEP 04 — LIVE QUEUE UI */}
                {currentStepIndex === 3 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between bg-[#12351F] p-4 rounded-lg border border-[#1A2E1E]">
                      <div>
                        <span className="text-[10px] text-[#79C267] block">
                          YOUR TOKEN
                        </span>
                        <span className="text-2xl font-bold text-[#F2F0E8]">
                          P-147
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-400 font-bold block">
                          Est. Wait: 42 min
                        </span>
                        <span className="text-[10px] text-[#A6ADA3]">
                          Position #19 in Intake Lane
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[10px] text-[#A6ADA3] block">
                          AHEAD
                        </span>
                        <span className="font-bold text-[#F2F0E8]">18</span>
                      </div>
                      <div className="bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[10px] text-[#A6ADA3] block">
                          COUNTER
                        </span>
                        <span className="font-bold text-[#F2F0E8]">#03</span>
                      </div>
                      <div className="bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[10px] text-[#A6ADA3] block">
                          STATUS
                        </span>
                        <span className="font-bold text-[#79C267]">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 05 — AI PREDICTION UI */}
                {currentStepIndex === 4 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[9px] text-[#A6ADA3] block">
                          CURRENT QUEUE
                        </span>
                        <span className="font-bold text-[#F2F0E8]">72</span>
                      </div>
                      <div className="bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[9px] text-[#A6ADA3] block">
                          PRED. ARRIVALS
                        </span>
                        <span className="font-bold text-[#F2F0E8]">24</span>
                      </div>
                      <div className="bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[9px] text-[#A6ADA3] block">
                          PREDICTED WAIT
                        </span>
                        <span className="font-bold text-amber-400">42 min</span>
                      </div>
                      <div className="bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E]">
                        <span className="text-[9px] text-[#A6ADA3] block">
                          CONGESTION
                        </span>
                        <span className="font-bold text-amber-400 uppercase">
                          HIGH
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#12351F] p-3 rounded-lg border border-[#1A2E1E] text-xs">
                      <span className="text-[#79C267] font-bold block">
                        SMART RECOMMENDATION ENGINE
                      </span>
                      <p className="text-[#E8E7DE] text-[11px] mt-0.5">
                        Recommended: 02:00 PM – 02:30 PM (Expected wait reduced
                        to 19 min)
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 06 — SMART ACTION UI */}
                {currentStepIndex === 5 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-4 font-mono text-xs">
                    <div className="bg-[#071008] p-4 rounded-lg border border-amber-900/50 space-y-2">
                      <span className="text-amber-400 font-bold block">
                        BOTTLENECK SIGNAL DETECTED
                      </span>
                      <p className="text-[#E8E7DE] text-xs">
                        Weighbridge Counter #2 Latency &gt; 8.2 mins (↑ 3.1 min
                        above baseline)
                      </p>
                    </div>

                    <button
                      onClick={goNext}
                      className="w-full py-2.5 rounded-lg bg-[#12351F] hover:bg-[#164A29] border border-[#1A2E1E] text-[#F2F0E8] font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Dispatch Operational Action →
                    </button>
                  </div>
                )}

                {/* STEP 07 — PROCUREMENT STATUS UI */}
                {currentStepIndex === 6 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-4 font-mono text-xs">
                    <div className="bg-[#071008] p-4 rounded-lg border border-[#1A2E1E] space-y-2">
                      <span className="text-[#79C267] font-bold block">
                        7-STAGE PROCUREMENT MILESTONE LOG
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <span className="text-[#79C267]">BOOKED ✓</span>
                        <span className="text-[#79C267]">ARRIVED ✓</span>
                        <span className="text-[#79C267]">QUALITY ✓</span>
                        <span className="text-amber-400 font-bold">
                          WEIGHING ●
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 08 — VERIFY AUDIT UI */}
                {currentStepIndex === 7 && (
                  <div className="bg-[#0A120C] rounded-xl p-5 border border-[#1A2E1E] space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-2">
                      <span className="text-[#79C267] font-bold">
                        SHA-256 AUDIT LOG VERIFIED
                      </span>
                      <span className="text-[#79C267]">100% IMMUTABLE</span>
                    </div>
                    <div className="text-[10px] text-[#A6ADA3] bg-[#071008] p-2.5 rounded-lg border border-[#1A2E1E] break-all">
                      Hash:
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </div>
                  </div>
                )}
              </div>

              {/* Step Explanation Text */}
              <div className="bg-[#0A120C] p-4 rounded-xl border border-[#1A2E1E] text-center">
                <p className="text-xs text-[#E8E7DE] leading-relaxed">
                  "{activeStep.explanation}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION CONTROLS */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1A2E1E]">
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              currentStepIndex === 0
                ? "bg-[#071008] text-[#A6ADA3]/40 border border-[#1A2E1E] cursor-not-allowed"
                : "bg-[#0A120C] text-[#E8E7DE] border border-[#1A2E1E] hover:bg-[#12351F]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREVIOUS STEP</span>
          </button>

          <div className="flex items-center gap-2">
            {steps.map((s, idx) => (
              <button
                key={s.num}
                onClick={() => goToStep(idx)}
                aria-label={`Go to step ${s.num}`}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  idx === currentStepIndex
                    ? "w-6 h-1.5 bg-[#79C267]"
                    : "w-1.5 h-1.5 bg-[#1A2E1E] hover:bg-[#315C38]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentStepIndex === steps.length - 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              currentStepIndex === steps.length - 1
                ? "bg-[#071008] text-[#A6ADA3]/40 border border-[#1A2E1E] cursor-not-allowed"
                : "bg-[#12351F] text-[#F2F0E8] border border-[#1A2E1E] hover:bg-[#164A29]"
            }`}
          >
            <span>NEXT STEP</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
