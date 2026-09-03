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
      isAi: false,
    },
    {
      num: "02",
      title: t("step02Title"),
      shortTitle: t("step02Short"),
      techTag: t("step02Tech"),
      explanation: t("step02Desc"),
      icon: Calendar,
      isAi: false,
    },
    {
      num: "03",
      title: t("step03Title"),
      shortTitle: t("step03Short"),
      techTag: t("step03Tech"),
      explanation: t("step03Desc"),
      icon: Ticket,
      isAi: false,
    },
    {
      num: "04",
      title: t("step04Title"),
      shortTitle: t("step04Short"),
      techTag: t("step04Tech"),
      explanation: t("step04Desc"),
      icon: Activity,
      isAi: false,
    },
    {
      num: "05",
      title: t("step05Title"),
      shortTitle: t("step05Short"),
      techTag: t("step05Tech"),
      explanation: t("step05Desc"),
      icon: TrendingUp,
      isAi: true,
    },
    {
      num: "06",
      title: t("step06Title"),
      shortTitle: t("step06Short"),
      techTag: t("step06Tech"),
      explanation: t("step06Desc"),
      icon: Wrench,
      isAi: true,
    },
    {
      num: "07",
      title: t("step07Title"),
      shortTitle: t("step07Short"),
      techTag: t("step07Tech"),
      explanation: t("step07Desc"),
      icon: CheckCircle2,
      isAi: false,
    },
    {
      num: "08",
      title: t("step08Title"),
      shortTitle: t("step08Short"),
      techTag: t("step08Tech"),
      explanation: t("step08Desc"),
      icon: ShieldCheck,
      isAi: false,
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

  // Animation variants for smooth horizontal slide/fade
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
    <section
      id="how-it-works"
      className="w-full py-12 lg:py-16 bg-[#FAFBF8] border-t border-[#E8EFE6] relative selection:bg-[#2E7D32] selection:text-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            {t("howAgriProcureWorksTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            {t("howAgriProcureWorksSub")}
          </p>
        </div>

        {/* TOP STEP PROCESS NAVIGATION BAR */}
        <div className="w-full mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-between min-w-[700px] border-b border-gray-200 pb-3 px-2">
            {steps.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={s.num}
                  onClick={() => goToStep(idx)}
                  className="flex items-center gap-1.5 group cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#1B4318] text-white shadow-xs scale-105"
                        : isPast
                          ? "bg-[#E8F5E9] text-[#2E7D32]"
                          : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-xs font-bold tracking-tight transition-colors ${
                      isActive
                        ? "text-[#1B4318]"
                        : isPast
                          ? "text-[#2E7D32]"
                          : "text-gray-400 group-hover:text-gray-600"
                    }`}
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

        {/* ACTIVE STEP DEMO CARD */}
        <div className="relative min-h-[420px] sm:min-h-[440px] flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStepIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 flex flex-col justify-between"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeStep.isAi
                        ? "bg-[#1B4318] text-[#F9A825]"
                        : "bg-[#E8F5E9] text-[#2E7D32]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#2E7D32] uppercase">
                        {t("stepLabel")} {activeStep.num}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#111827]">
                        {activeStep.title}
                      </h3>
                      {activeStep.isAi && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#F9A825] text-gray-900 tracking-wider">
                          CORE USP
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 block mt-0.5">
                      {activeStep.techTag}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  {activeStep.num} / 08
                </div>
              </div>

              {/* REALISTIC PRODUCT UI INTERFACE REPRESENTATION */}
              <div className="flex-1 my-2">
                {/* STEP 01 — FARMER UI */}
                {currentStepIndex === 0 && (
                  <div className="bg-[#FAFBF8] rounded-2xl p-5 border border-gray-200 space-y-4 font-sans">
                    {/* Farmer Profile Strip */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 select-none">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1B4318] text-white flex items-center justify-center font-bold text-xs">
                          RS
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-[#111827]">
                            Rameshwar Singh
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            FRM-2026-000123 • Karnal, Haryana
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
                        {t("verifiedIdentity")}
                      </span>
                    </div>

                    {/* Registered Crops List */}
                    <div className="space-y-2 select-none">
                      <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                        {t("registeredCropsLabel")}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-[#111827]">
                              Paddy (Basmati 1121)
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {t("areaLabel")}: 4.5 {t("acres")}
                            </div>
                          </div>
                          <div className="text-xs font-extrabold text-[#1B4318]">
                            90 Qtl
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-[#111827]">
                              Wheat (Sharbati HD-2967)
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {t("areaLabel")}: 6.0 {t("acres")}
                            </div>
                          </div>
                          <div className="text-xs font-extrabold text-[#1B4318]">
                            135 Qtl
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Demo Button: Advances Walkthrough */}
                    <div className="pt-2">
                      <button
                        onClick={goNext}
                        className="w-full py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm ring-2 ring-[#2E7D32]/30 ring-offset-1 cursor-pointer transition-all active:scale-98"
                      >
                        <span>{t("bookProcurementSlotBtn")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 02 — BOOK SLOT UI */}
                {currentStepIndex === 1 && (
                  <div className="bg-[#FAFBF8] rounded-2xl p-5 border border-gray-200 space-y-4 font-sans select-none">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">
                          {t("cropSelection")}
                        </span>
                        <span className="font-extrabold text-[#111827]">
                          Paddy (Basmati 1121)
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">
                          {t("quantityLabel")}
                        </span>
                        <span className="font-extrabold text-[#111827]">
                          25 Quintal
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">
                        {t("targetMandiCentre")}
                      </span>
                      <span className="font-extrabold text-[#111827]">
                        Karnal Central Grain Mandi (HR)
                      </span>
                    </div>

                    {/* Slot Picker Pills */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">
                        {t("selectTimeSlot")}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 text-center opacity-60">
                          <div>08:00 AM</div>
                          <span className="text-[9px] font-bold text-gray-400">
                            {t("slotAvailable")}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-center">
                          <div>09:00 AM</div>
                          <span className="text-[9px] font-bold">
                            {t("slotFull")}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-center">
                          <div>10:00 AM</div>
                          <span className="text-[9px] font-bold">
                            {t("slotLimited")}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl border-2 border-[#2E7D32] bg-[#E8F5E9] text-[#1B4318] font-bold text-center ring-2 ring-[#2E7D32]/20">
                          <div>02:00 PM</div>
                          <span className="text-[9px] font-black text-[#2E7D32]">
                            {t("slotSelected")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Demo Button: Advances Walkthrough */}
                    <button
                      onClick={goNext}
                      className="w-full py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs cursor-pointer transition-all active:scale-98"
                    >
                      {t("confirmSlot")}
                    </button>
                  </div>
                )}

                {/* STEP 03 — SMART TOKEN UI */}
                {currentStepIndex === 2 && (
                  <div className="bg-[#FAFBF8] rounded-2xl p-5 border border-gray-200 space-y-3 font-sans select-none">
                    <div className="bg-white p-4 rounded-xl border border-[#C8E6C9] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-black text-[#2E7D32] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          {t("bookingConfirmed")}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          BK-2026-00147
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">
                            {t("tokenNumberLabel")}
                          </div>
                          <div className="text-3xl font-black text-[#1B4318]">
                            P-147
                          </div>
                        </div>

                        <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-700">
                          <QrCode className="w-10 h-10 text-[#1B4318]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-100 text-gray-700 font-medium">
                        <div>
                          <span className="text-gray-400">
                            {t("cropLabel")}:
                          </span>{" "}
                          Paddy (Basmati 1121)
                        </div>
                        <div>
                          <span className="text-gray-400">
                            {t("quantityLabel")}:
                          </span>{" "}
                          25 Quintal
                        </div>
                        <div>
                          <span className="text-gray-400">
                            {t("centreLabel")}:
                          </span>{" "}
                          Karnal Mandi
                        </div>
                        <div>
                          <span className="text-gray-400">
                            {t("slotLabel")}:
                          </span>{" "}
                          02:00 PM – 02:30 PM
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 04 — LIVE QUEUE UI */}
                {currentStepIndex === 3 && (
                  <div className="bg-[#FAFBF8] rounded-2xl p-5 border border-gray-200 space-y-4 font-sans select-none">
                    <div className="bg-[#1B4318] text-white p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#C8E6C9] font-bold uppercase">
                          {t("yourToken")}
                        </div>
                        <div className="text-2xl font-black">P-147</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#F9A825]">
                          {t("estWait")}: 42 min
                        </div>
                        <div className="text-[10px] text-[#C8E6C9]">
                          {t("positionInLane")}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                        <div className="text-[10px] text-gray-400 font-bold">
                          {t("aheadLabel")}
                        </div>
                        <div className="font-extrabold text-[#111827] text-sm">
                          18
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                        <div className="text-[10px] text-gray-400 font-bold">
                          {t("counterLabel")}
                        </div>
                        <div className="font-extrabold text-[#111827] text-sm">
                          03
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                        <div className="text-[10px] text-gray-400 font-bold">
                          {t("statusLabel")}
                        </div>
                        <div className="font-extrabold text-[#2E7D32] text-sm">
                          {t("statusActive")}
                        </div>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 pt-1">
                      <span className="text-[#2E7D32]">{t("stageEntry")}</span>
                      <span className="text-gray-300">→</span>
                      <span className="text-[#2E7D32]">
                        {t("stageQuality")}
                      </span>
                      <span className="text-gray-300">→</span>
                      <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {t("stageWeighing")}
                      </span>
                      <span className="text-gray-300">→</span>
                      <span className="text-gray-400">
                        {t("stageProcurement")}
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 05 — AI PREDICTION UI */}
                {currentStepIndex === 4 && (
                  <div className="bg-[#1B4318] text-white rounded-2xl p-5 border border-[#1B4318] space-y-4 font-sans shadow-md select-none">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                        <div className="text-[9px] text-white/60 font-bold uppercase">
                          {t("currentQueueLabel")}
                        </div>
                        <div className="text-base font-black text-white">
                          72
                        </div>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                        <div className="text-[9px] text-white/60 font-bold uppercase">
                          {t("predArrivalsLabel")}
                        </div>
                        <div className="text-base font-black text-white">
                          24
                        </div>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                        <div className="text-[9px] text-white/60 font-bold uppercase">
                          {t("predictedWaitLabel")}
                        </div>
                        <div className="text-base font-black text-[#F9A825]">
                          42 min
                        </div>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                        <div className="text-[9px] text-white/60 font-bold uppercase">
                          {t("congestionRiskLabel")}
                        </div>
                        <div className="text-xs font-black text-[#FF8A65] uppercase">
                          {t("riskHigh")}
                        </div>
                      </div>
                    </div>

                    {/* Chart Visual Simulation */}
                    <div className="bg-black/20 p-3 rounded-xl border border-white/10 text-[10px] space-y-1 font-mono">
                      <div className="flex justify-between text-white/70">
                        <span>{t("forecastTitle")}</span>
                        <span className="text-[#81C784]">
                          {t("slaModelLabel")}
                        </span>
                      </div>
                      <div className="h-10 flex items-end justify-between gap-1 pt-2">
                        <div className="w-full bg-white/20 h-4 rounded-xs" />
                        <div className="w-full bg-white/30 h-6 rounded-xs" />
                        <div className="w-full bg-[#F9A825] h-9 rounded-xs" />
                        <div className="w-full bg-[#FF8A65] h-10 rounded-xs" />
                        <div className="w-full bg-[#81C784] h-5 rounded-xs" />
                        <div className="w-full bg-white/20 h-3 rounded-xs" />
                      </div>
                    </div>

                    {/* SMART SLOT Outcome */}
                    <div className="bg-[#2E7D32] p-3 rounded-xl text-xs space-y-0.5">
                      <div className="text-[9px] text-[#C8E6C9] font-black uppercase tracking-wider">
                        {t("smartSlotRecommendationTitle")}
                      </div>
                      <div className="font-extrabold text-white text-sm">
                        {t("recommendedSlotText")}
                      </div>
                      <div className="text-[11px] text-[#E8F5E9] font-medium">
                        {t("expectedWaitReducedText")}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 06 — SMART ACTION UI */}
                {currentStepIndex === 5 && (
                  <div className="bg-[#FAFBF8] rounded-2xl p-5 border border-gray-200 space-y-4 font-sans select-none">
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                          <Wrench className="w-4 h-4 text-amber-600" />
                          {t("bottleneckAlertTitle")}
                        </span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                          {t("riskHigh")}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800">
                        {t("weighbridgeDelayText")}
                      </p>
                      <div className="text-[11px] text-gray-600 pt-1">
                        <span className="font-bold">{t("autoRecLabel")} </span>
                        <span>{t("dispatchOpText")}</span>
                      </div>
                    </div>
                    {/* Demo Button: Advances Walkthrough */}
                    <button
                      onClick={goNext}
                      className="w-full py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <span>{t("btnDispatchIntervention")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STEP 07 — PROCUREMENT STATUS UI */}
                {currentStepIndex === 6 && (
                  <div className="bg-[#FAFBF8] rounded-2xl p-5 border border-gray-200 space-y-4 font-sans select-none">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                      <div className="text-xs font-extrabold text-[#111827] pb-1 border-b border-gray-100 flex items-center justify-between">
                        <span>{t("lifecycleStatusTitle")}</span>
                        <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                          {t("updatedJustNow")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold pt-1">
                        <div className="flex items-center gap-1.5 text-[#2E7D32]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t("stageBooking")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#2E7D32]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t("stageArrived")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#2E7D32]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t("stageQuality")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-800">
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-bold">
                            ●
                          </span>
                          <span>{t("stageWeighing")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[10px]">
                            ○
                          </span>
                          <span>{t("stageProcurement")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[10px]">
                            ○
                          </span>
                          <span>{t("stagePayment")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1B4318] text-white p-3 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#F9A825]" />
                        <span className="font-semibold">
                          {t("auditTrailBannerText")}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#C8E6C9] font-mono">
                        {t("verifiedBannerBadge")}
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 08 — VERIFY AUDIT UI */}
                {currentStepIndex === 7 && (
                  <div className="bg-[#FAFBF8] rounded-2xl p-5 border border-gray-200 space-y-4 font-sans select-none">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-black text-[#1B4318] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#F9A825]" />
                          {t("ledgerVerificationTitle")}
                        </span>
                        <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                          {t("verifiedBannerBadge")}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">
                          {t("blockHashLabel")}
                        </div>
                        <div className="font-mono text-[10px] text-gray-700 bg-gray-50 p-2 rounded-lg break-all border border-gray-200">
                          e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="bg-[#FAFBF8] p-2.5 rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">
                            {t("dbtPaymentStatusLabel")}
                          </span>
                          <span className="font-extrabold text-[#2E7D32]">
                            {t("authorizedDisbursedText")}
                          </span>
                        </div>
                        <div className="bg-[#FAFBF8] p-2.5 rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">
                            {t("auditIntegrityLabel")}
                          </span>
                          <span className="font-extrabold text-[#1B4318]">
                            {t("immutableText")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Explanation Text */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-center">
                <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                  "{activeStep.explanation}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION CONTROLS */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 max-w-2xl mx-auto">
          {/* Previous Button */}
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStepIndex === 0
                ? "bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed opacity-50"
                : "bg-white text-[#111827] border border-gray-300 hover:bg-gray-50 shadow-2xs active:scale-95"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t("btnPrevious")}</span>
          </button>

          {/* Minimal Progress Dots */}
          <div className="flex items-center gap-2">
            {steps.map((s, idx) => (
              <button
                key={s.num}
                onClick={() => goToStep(idx)}
                aria-label={`Go to step ${s.num}`}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  idx === currentStepIndex
                    ? "w-6 h-2 bg-[#2E7D32]"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goNext}
            disabled={currentStepIndex === steps.length - 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStepIndex === steps.length - 1
                ? "bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed opacity-50"
                : "bg-[#1B4318] text-white border border-[#1B4318] hover:bg-[#2E7D32] shadow-2xs active:scale-95"
            }`}
          >
            <span>{t("btnNext")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
