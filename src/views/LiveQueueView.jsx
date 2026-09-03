import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  RotateCw,
  QrCode,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useApp, WORKFLOW_STAGES } from "../context/AppContext";

export default function LiveQueueView() {
  const {
    bookings,
    activeBooking,
    servingToken,
    setServingToken,
    autoQueueTicker,
    setAutoQueueTicker,
    peopleAhead,
    estimatedWaitMins,
    advanceBookingStage,
    navigateTo,
    t,
  } = useApp();

  const currentBooking = activeBooking || (bookings && bookings[0]);

  // Stage Progression Handler
  const handleNextStage = () => {
    if (!currentBooking || !advanceBookingStage) return;
    const currentIdx = WORKFLOW_STAGES.findIndex(
      (s) => s.key === currentBooking.stage,
    );
    if (currentIdx < WORKFLOW_STAGES.length - 1) {
      const nextStageKey = WORKFLOW_STAGES[currentIdx + 1].key;
      advanceBookingStage(currentBooking.id, nextStageKey);
    }
  };

  const advanceQueueToken = () => {
    setServingToken((prev) => prev + 1);
  };

  const getStageLabel = (stageKey) => {
    if (stageKey === "BOOKED") return t("stageBooked");
    if (stageKey === "ARRIVED") return t("stageArrived");
    if (stageKey === "QUALITY_CHECK") return t("stageQuality");
    if (stageKey === "WEIGHING") return t("stageWeighing");
    if (stageKey === "PROCUREMENT") return t("stageProcurement");
    if (stageKey === "PAYMENT") return t("stagePayment");
    if (stageKey === "COMPLETED") return t("stageCompleted");
    return stageKey;
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("home")}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo("qr-scanner")}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#C8E6C9] text-xs font-bold text-[#2E7D32] hover:bg-[#E8F5E9] flex items-center gap-1.5 shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t("gateScanner")}</span>
          </button>
          <button
            onClick={() => navigateTo("audit")}
            className="px-3.5 py-1.5 rounded-xl bg-[#1B4318] text-white text-xs font-bold hover:bg-[#2E7D32] flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F9A825]" />
            <span>{t("auditTrail")}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: Live Queue Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
                <h2 className="text-lg font-black text-gray-900">
                  {t("liveQueueTitle")}
                </h2>
              </div>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {t("liveQueueSub")}
              </p>
            </div>

            {/* Auto-Refresh Ticker Control */}
            <div className="flex items-center gap-2 bg-[#FAF8F2] p-1.5 rounded-xl border border-gray-200 text-xs">
              <span className="text-[11px] font-bold text-gray-600 pl-2">
                Auto-Refresh (15s):
              </span>
              <button
                onClick={() => setAutoQueueTicker(!autoQueueTicker)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  autoQueueTicker
                    ? "bg-[#2E7D32] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {autoQueueTicker ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 4 Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Metric 1: Current Serving Token */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex flex-col justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {t("nowServingGate")}
              </span>
              <div className="text-3xl font-black text-[#2E7D32] mt-2">
                P-{servingToken}
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                <span>Weighbridge Lane #1-4</span>
                <button
                  onClick={advanceQueueToken}
                  className="text-[#2E7D32] font-bold hover:underline flex items-center gap-0.5"
                  title="Simulate advancing token"
                >
                  <RotateCw className="w-3 h-3" /> Advance +1
                </button>
              </div>
            </div>

            {/* Metric 2: Your Assigned Token */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-[#A5D6A7] flex flex-col justify-between ring-2 ring-[#2E7D32]/15">
              <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
                {t("yourTokenNumber")}
              </span>
              <div className="text-3xl font-black text-[#1B4318] mt-2">
                P-{currentBooking ? currentBooking.tokenNumber : 125}
              </div>
              <div className="mt-3 pt-2 border-t border-green-100 text-[11px] text-[#2E7D32] font-bold">
                {currentBooking ? currentBooking.crop.split(" ")[0] : "Paddy"} (
                {currentBooking?.quantity || 45} Qtl)
              </div>
            </div>

            {/* Metric 3: People Ahead */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex flex-col justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {t("peopleAheadLabel")}
              </span>
              <div className="text-3xl font-black text-amber-600 mt-2">
                {peopleAhead}
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                Smooth vehicle intake pace
              </div>
            </div>

            {/* Metric 4: Estimated Wait Time */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex flex-col justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {t("estimatedWaitLabel")}
              </span>
              <div className="text-3xl font-black text-gray-900 mt-2">
                {estimatedWaitMins} - {estimatedWaitMins + 6}{" "}
                <span className="text-sm font-semibold text-gray-500">
                  mins
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-[#2E7D32] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Congestion Adjusted
              </div>
            </div>
          </div>

          {/* Quick Simulation Bar for Judges */}
          <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E8E4D9] flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700">
              ⚡ SIH Demo Controls:
            </span>
            <div className="flex gap-2">
              <button
                onClick={advanceQueueToken}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 font-bold text-gray-800 hover:bg-gray-50"
              >
                +1 Vehicle Processed
              </button>
              <button
                onClick={() => setServingToken(124)}
                className="px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white font-bold hover:bg-[#1B4318]"
              >
                Fast-Forward to Your Turn
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: 6-Stage Workflow Progress Tracker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Procurement Workflow Progress
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Token #{currentBooking?.tokenNumber || 125} •
                  Cryptographically Tracked
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black border border-[#A5D6A7]">
                {currentBooking
                  ? getStageLabel(currentBooking.stage)
                  : getStageLabel("BOOKED")}
              </span>
            </div>

            {/* Visual 6-Stage Timeline */}
            <div className="space-y-3 relative">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const currentIdx = WORKFLOW_STAGES.findIndex(
                  (s) => s.key === currentBooking?.stage,
                );
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={stage.key}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isCurrent
                        ? "bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs"
                        : isPassed
                          ? "bg-[#FAF8F2] border-green-200"
                          : "bg-white border-gray-200 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                        isCurrent
                          ? "bg-[#2E7D32] text-white shadow-xs"
                          : isPassed
                            ? "bg-green-700 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${isCurrent ? "text-[#1B4318]" : "text-gray-800"}`}
                        >
                          {getStageLabel(stage.key)}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-black text-[#2E7D32] uppercase animate-pulse">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Advance Stage Control */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleNextStage}
                className="w-full py-3 bg-[#1B4318] hover:bg-[#2E7D32] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Advance to Next Stage</span>
                <ArrowRight className="w-4 h-4 text-[#F9A825]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
