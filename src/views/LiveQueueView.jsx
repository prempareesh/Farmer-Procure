import React from "react";
import {
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
    user,
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
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 font-mono">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center gap-1.5 text-xs font-mono text-[#A6ADA3] hover:text-[#79C267] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("home")}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo("qr-scanner")}
            className="px-3.5 py-1.5 border border-[#1A2E1E] bg-[#071008] text-xs font-mono uppercase text-[#79C267] hover:border-[#79C267]/40 flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t("gateScanner")}</span>
          </button>
          {user?.role !== "farmer" ? (
            <button
              onClick={() => navigateTo("audit")}
              className="px-3.5 py-1.5 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#79C267]" />
              <span>{t("auditTrail")}</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 border border-[#79C267]/40 bg-[#0A180D] text-[11px] font-mono text-[#79C267] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#79C267]" />
              <span>Cryptographically Tracked</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: Live Queue Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Card */}
          <div className="bg-[#071008] p-6 border border-[#1A2E1E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#79C267] animate-pulse" />
                <h2 className="text-xl font-serif text-[#F2F0E8]">
                  {t("liveQueueTitle")}
                </h2>
              </div>
              <p className="text-xs text-[#A6ADA3] font-mono mt-0.5">
                {t("liveQueueSub")}
              </p>
            </div>

            {/* Auto-Refresh Ticker Control */}
            <div className="flex items-center gap-2 bg-[#050805] p-1.5 border border-[#1A2E1E] text-xs font-mono">
              <span className="text-[11px] text-[#A6ADA3] pl-2">
                Auto-Refresh (15s):
              </span>
              <button
                onClick={() => setAutoQueueTicker(!autoQueueTicker)}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  autoQueueTicker
                    ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/40"
                    : "bg-[#071008] text-[#A6ADA3] border border-[#1A2E1E]"
                }`}
              >
                {autoQueueTicker ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 4 Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 font-mono">
            {/* Metric 1: Current Serving Token */}
            <div className="bg-[#071008] p-5 border border-[#1A2E1E] flex flex-col justify-between">
              <span className="text-[10px] text-[#A6ADA3] uppercase tracking-wider">
                {t("nowServingGate")}
              </span>
              <div className="text-3xl font-serif text-[#79C267] mt-2">
                P-{servingToken}
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1A2E1E] text-[11px] text-[#A6ADA3]">
                <span>Weighbridge Lane #1-4</span>
                <button
                  onClick={advanceQueueToken}
                  className="text-[#79C267] hover:underline flex items-center gap-0.5 cursor-pointer uppercase text-[10px]"
                  title="Simulate advancing token"
                >
                  <RotateCw className="w-3 h-3 text-[#79C267]" /> Advance +1
                </button>
              </div>
            </div>

            {/* Metric 2: Your Assigned Token */}
            <div className="bg-[#071008] p-5 border border-[#79C267]/40 flex flex-col justify-between">
              <span className="text-[10px] text-[#79C267] uppercase tracking-wider">
                {t("yourTokenNumber")}
              </span>
              <div className="text-3xl font-serif text-[#F2F0E8] mt-2">
                P-{currentBooking ? currentBooking.tokenNumber : 125}
              </div>
              <div className="mt-3 pt-2 border-t border-[#1A2E1E] text-[11px] text-[#79C267]">
                {currentBooking ? currentBooking.crop.split(" ")[0] : "Paddy"} (
                {currentBooking?.quantity || 45} Qtl)
              </div>
            </div>

            {/* Metric 3: People Ahead */}
            <div className="bg-[#071008] p-5 border border-[#1A2E1E] flex flex-col justify-between">
              <span className="text-[10px] text-[#A6ADA3] uppercase tracking-wider">
                {t("peopleAheadLabel")}
              </span>
              <div className="text-3xl font-serif text-[#F2F0E8] mt-2">
                {peopleAhead}
              </div>
              <div className="mt-3 pt-2 border-t border-[#1A2E1E] text-[11px] text-[#A6ADA3]">
                Smooth vehicle intake pace
              </div>
            </div>

            {/* Metric 4: Estimated Wait Time */}
            <div className="bg-[#071008] p-5 border border-[#1A2E1E] flex flex-col justify-between">
              <span className="text-[10px] text-[#A6ADA3] uppercase tracking-wider">
                {t("estimatedWaitLabel")}
              </span>
              <div className="text-3xl font-serif text-[#F2F0E8] mt-2">
                {estimatedWaitMins} - {estimatedWaitMins + 6}{" "}
                <span className="text-xs font-mono text-[#A6ADA3]">
                  mins
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-[#1A2E1E] text-[11px] text-[#79C267] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Congestion Adjusted
              </div>
            </div>
          </div>

          {/* Quick Simulation Bar for Judges */}
          <div className="p-4 bg-[#050805] border border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
            <span className="text-[#A6ADA3] text-[11px] uppercase">
              ⚡ SIH Demo Controls:
            </span>
            <div className="flex gap-2">
              <button
                onClick={advanceQueueToken}
                className="px-3 py-1.5 border border-[#1A2E1E] bg-[#071008] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] text-[11px] uppercase tracking-wider cursor-pointer"
              >
                +1 Vehicle Processed
              </button>
              <button
                onClick={() => setServingToken(124)}
                className="px-3 py-1.5 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-[11px] uppercase tracking-wider cursor-pointer"
              >
                Fast-Forward
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: 6-Stage Workflow Progress Tracker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#071008] p-6 border border-[#1A2E1E] space-y-5">
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-3">
              <div>
                <h3 className="text-lg font-serif text-[#F2F0E8]">
                  Procurement Progress
                </h3>
                <p className="text-[11px] font-mono text-[#A6ADA3]">
                  Token #{currentBooking?.tokenNumber || 125} • Cryptographic
                </p>
              </div>

              <span className="px-3 py-1 border border-[#79C267]/40 bg-[#0A180D] text-[#79C267] text-xs font-mono uppercase">
                {currentBooking
                  ? getStageLabel(currentBooking.stage)
                  : getStageLabel("BOOKED")}
              </span>
            </div>

            {/* Visual 6-Stage Timeline */}
            <div className="space-y-3 relative font-mono">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const currentIdx = WORKFLOW_STAGES.findIndex(
                  (s) => s.key === currentBooking?.stage,
                );
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={stage.key}
                    className={`p-3.5 border transition-all flex items-start gap-3.5 ${
                      isCurrent
                        ? "bg-[#0A180D] border-[#79C267]/60 text-[#F2F0E8]"
                        : isPassed
                          ? "bg-[#050805] border-[#1A2E1E] text-[#A6ADA3]"
                          : "bg-[#050805]/40 border-[#1A2E1E]/50 text-[#A6ADA3]/40"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 border flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                        isCurrent
                          ? "bg-[#164A29] border-[#79C267]/40 text-[#79C267]"
                          : isPassed
                            ? "bg-[#0A180D] border-[#79C267]/40 text-[#79C267]"
                            : "bg-[#050805] border-[#1A2E1E] text-[#A6ADA3]"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-mono uppercase ${isCurrent ? "text-[#F2F0E8]" : "text-[#A6ADA3]"}`}
                        >
                          {getStageLabel(stage.key)}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-[#79C267] uppercase animate-pulse">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#A6ADA3] font-mono mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Advance Stage Control */}
            {user?.role !== "farmer" ? (
              <div className="pt-2 border-t border-[#1A2E1E]">
                <button
                  onClick={handleNextStage}
                  className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Advance Stage →</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-[#1A2E1E] text-center">
                <div className="py-2.5 px-4 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#A6ADA3] flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#79C267]" />
                  <span>
                    Live Progress • Stage processing managed by Mandi Staff
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
