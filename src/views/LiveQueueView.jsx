import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  FileText,
  Clock,
} from "lucide-react";
import { useApp, WORKFLOW_STAGES } from "../context/AppContext";

export default function LiveQueueView() {
  const {
    user,
    farmerProfile,
    bookings,
    activeBooking,
    calculateQueueMetrics,
    isOffline,
    advanceBookingStage,
    navigateTo,
    t,
  } = useApp();

  const currentFarmer =
    user && (user.role === "farmer" || user.farmerId) ? user : farmerProfile;
  const currentFarmerId = currentFarmer?.farmerId;
  const currentFarmerDbId = currentFarmer?.id;
  const currentFarmerMobile = currentFarmer?.mobile;

  const farmerBookings = (bookings || []).filter((b) => {
    if (!currentFarmer) return true;
    const matchDbId =
      currentFarmerDbId &&
      (b.profileId === currentFarmerDbId ||
        b.profile_id === currentFarmerDbId ||
        (b.profiles && b.profiles.id === currentFarmerDbId));
    const matchFarmerId =
      currentFarmerId &&
      (b.farmerId === currentFarmerId ||
        (b.profiles && b.profiles.farmer_id === currentFarmerId));
    const matchMobile =
      currentFarmerMobile &&
      (b.farmerMobile === currentFarmerMobile ||
        (b.profiles && b.profiles.mobile === currentFarmerMobile));

    return Boolean(matchDbId || matchFarmerId || matchMobile);
  });


  const activeBookingForFarmer = farmerBookings.find(
    (b) => b.stage !== "COMPLETED" && b.status !== "COMPLETED",
  );
  const completedBookingForFarmer = farmerBookings.find(
    (b) => b.stage === "COMPLETED" || b.status === "COMPLETED",
  );

  const currentBooking = activeBookingForFarmer || activeBooking;
  const hasActiveBooking = Boolean(activeBookingForFarmer);
  const isCompleted = Boolean(!hasActiveBooking && completedBookingForFarmer);

  const queueMetrics = calculateQueueMetrics
    ? calculateQueueMetrics(activeBookingForFarmer)
    : { position: 1, farmersAhead: 0, waitMins: 10 };

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
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("home")}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo("qr-scanner")}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#C8E6C9] text-xs font-bold text-[#2E7D32] hover:bg-[#E8F5E9] flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t("gateScanner")}</span>
          </button>
          {user?.role !== "farmer" ? (
            <button
              onClick={() => navigateTo("audit")}
              className="px-3.5 py-1.5 rounded-xl bg-[#1B4318] text-white text-xs font-bold hover:bg-[#2E7D32] flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F9A825]" />
              <span>{t("auditTrail")}</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-[11px] font-extrabold text-[#2E7D32] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Cryptographically Tracked</span>
            </span>
          )}
        </div>
      </div>

      {/* Offline Status Indicator */}
      {isOffline && (
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {t("offlineModeActive") ||
                "OFFLINE MODE — Showing last synchronized status"}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-900 font-mono text-[10px]">
            {t("pendingSync") || "PENDING SYNC"}
          </span>
        </div>
      )}

      {/* STATE A: NO ACTIVE BOOKING */}
      {!hasActiveBooking && !isCompleted && (
        <div className="bg-white rounded-3xl p-8 shadow-md border border-[#E0ECE0] text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900">Today's Procurement</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-200">
              No active booking
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
            You haven't booked a procurement slot yet. Book a slot to receive your token, queue position, estimated waiting time, and digital gate pass.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo("book-slot")}
              className="px-6 py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-black shadow-md flex items-center gap-2 mx-auto cursor-pointer transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4 text-[#F9A825]" />
              <span>Book Procurement Slot</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE C: COMPLETED BOOKING */}
      {isCompleted && (
        <div className="bg-white rounded-3xl p-8 shadow-md border border-[#E0ECE0] text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-green-100 text-[#2E7D32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900">Procurement Cycle Completed</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black border border-[#A5D6A7]">
              Booking: {completedBookingForFarmer.booking_id || completedBookingForFarmer.id} • Token: {completedBookingForFarmer.tokenDisplay}
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
            Your procurement cycle at {completedBookingForFarmer.centreName} is completed with SHA-256 cryptographic seal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo("farmer-dash")}
              className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white text-xs font-black shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#F9A825]" />
              <span>View Digital Receipt</span>
            </button>
            <button
              onClick={() => navigateTo("book-slot")}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-black shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#2E7D32]" />
              <span>Book Another Slot</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE B: ACTIVE BOOKING QUEUE & WORKFLOW */}
      {hasActiveBooking && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7 COLS: Live Queue Telemetry */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
                  <h2 className="text-lg font-black text-gray-900">
                    Live Procurement Queue
                  </h2>
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  Centre: {activeBookingForFarmer.centreName}
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-xs font-extrabold text-[#2E7D32]">
                Slot: {activeBookingForFarmer.slot_date} ({activeBookingForFarmer.slot_time})
              </div>
            </div>

            {/* 4 Telemetry Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Metric 1: Your Assigned Token */}
              <div className="bg-white rounded-3xl p-5 shadow-md border border-[#A5D6A7] flex flex-col justify-between ring-2 ring-[#2E7D32]/15">
                <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
                  YOUR TOKEN
                </span>
                <div className="text-3xl font-black text-[#1B4318] mt-2">
                  {activeBookingForFarmer.tokenDisplay}
                </div>
                <div className="mt-3 pt-2 border-t border-green-100 text-[11px] text-[#2E7D32] font-bold">
                  {activeBookingForFarmer.crop} ({activeBookingForFarmer.quantity} Qtl)
                </div>
              </div>

              {/* Metric 2: Your Queue Position */}
              <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  YOUR POSITION
                </span>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  #{queueMetrics.position}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-semibold">
                  Place in active mandi queue
                </div>
              </div>

              {/* Metric 3: Farmers Ahead */}
              <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  FARMERS AHEAD
                </span>
                <div className="text-3xl font-black text-amber-600 mt-2">
                  {queueMetrics.farmersAhead}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-semibold">
                  {queueMetrics.farmersAhead}{" "}
                  {t("farmersAheadText") || "farmers ahead of you"}
                </div>
              </div>

              {/* Metric 4: Estimated Wait Time */}
              <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex flex-col justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  EXPECTED WAIT
                </span>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  ~{queueMetrics.waitMins}{" "}
                  <span className="text-sm font-semibold text-gray-500">
                    min
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-[#2E7D32] font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Estimated Turn Time
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: 7-Stage Workflow Progress Tracker */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Procurement Workflow Progress
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Token #{activeBookingForFarmer.tokenDisplay} • Cryptographically Tracked
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black border border-[#A5D6A7]">
                  {getStageLabel(activeBookingForFarmer.stage)}
                </span>
              </div>

              {/* Visual 7-Stage Timeline */}
              <div className="space-y-3 relative">
                {WORKFLOW_STAGES.map((stage, idx) => {
                  const currentIdx = WORKFLOW_STAGES.findIndex(
                    (s) => s.key === activeBookingForFarmer.stage,
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

              {/* Advance Stage Control: Only rendered for Staff / Officer / Worker roles */}
              {user?.role !== "farmer" ? (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={handleNextStage}
                    className="w-full py-3 bg-[#1B4318] hover:bg-[#2E7D32] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Advance to Next Stage</span>
                    <ArrowRight className="w-4 h-4 text-[#F9A825]" />
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-100 text-center">
                  <div className="py-2.5 px-4 bg-[#FAF8F2] rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                    <span>
                      Live Progress • Stage processing managed by Mandi Staff
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
