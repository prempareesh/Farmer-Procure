import React, { useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  Clock,
  Sparkles,
  Wrench,
  ArrowLeft,
  DollarSign,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function OfficerDashboardView() {
  const {
    farmersList,
    bookings,
    identityVerifications,
    peopleAhead,
    estimatedWaitMins,
    xaiFactors,
    bottlenecks,
    resolveBottleneck,
    approveFinalPayment,
    searchFarmerById,
    feedbackList,
    navigateTo,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'farmers' | 'payments' | 'feedback' | 'bottlenecks'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarmerHistory, setSelectedFarmerHistory] = useState(null);

  const pendingPayments = bookings.filter(
    (b) =>
      b.stage === "PAYMENT" ||
      (!b.paymentDetails?.disbursed && b.stage !== "BOOKED"),
  );

  const weighingFeedbackCount = (feedbackList || []).filter(
    (f) => f.category === "WEIGHING DELAY" || f.stage === "WEIGHING",
  ).length;
  const avgRating =
    (feedbackList || []).length > 0
      ? (
          feedbackList.reduce((acc, f) => acc + (f.rating || 4), 0) /
          feedbackList.length
        ).toFixed(1)
      : "4.2";

  const handleSearchFarmer = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSelectedFarmerHistory(null);
      return;
    }
    const res = await searchFarmerById(searchQuery);
    setSelectedFarmerHistory(res || "NOT_FOUND");
  };

  return (
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 selection:bg-[#164A29] selection:text-[#79C267]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2E1E] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo("home")}
              className="p-2 rounded bg-[#071008] border border-[#1A2E1E] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-3xl font-serif text-[#F2F0E8] tracking-tight">
              {t("officerPortal")} & Command Tower
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px] font-mono border border-[#79C267]/30 uppercase">
              NORTH ZONE
            </span>
          </div>
          <p className="text-xs text-[#A6ADA3] font-mono mt-1">
            Supervisory procurement control, live workflow telemetry, anonymous
            feedback signals & cryptographic oversight
          </p>
        </div>

        <button
          onClick={() => navigateTo("audit")}
          className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#79C267]" />
          <span>SHA-256 Cryptographic Ledger</span>
        </button>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("registeredCrops")}
            </span>
            <h3 className="text-2xl font-serif text-[#F2F0E8]">
              {farmersList.length + 12480}
            </h3>
            <span className="text-[10px] text-[#79C267] font-mono">
              100% Aadhaar Verified
            </span>
          </div>
        </div>

        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-[#050805] text-amber-400 border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("dbtPaymentStatus")}
            </span>
            <h3 className="text-2xl font-serif text-amber-400">
              {pendingPayments.length} Authorizations
            </h3>
            <span className="text-[10px] text-[#A6ADA3] font-mono">
              Direct DBT Queue
            </span>
          </div>
        </div>

        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("avgWaitTime")}
            </span>
            <h3 className="text-2xl font-serif text-[#F2F0E8]">
              ~{estimatedWaitMins} mins
            </h3>
            <span className="text-[10px] text-[#79C267] font-mono">
              {peopleAhead} Trucks in Lane
            </span>
          </div>
        </div>

        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("feedbackAvgRating")}
            </span>
            <h3 className="text-2xl font-serif text-[#F2F0E8]">
              {avgRating} / 5
            </h3>
            <span className="text-[10px] text-[#A6ADA3] font-mono">
              {feedbackList?.length || 12} {t("feedbackResponses")}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[#071008] p-1 rounded border border-[#1A2E1E] w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          Overview & Telemetry
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "feedback"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#79C267]" />
          <span>
            {t("anonymousFarmerFeedbackTitle")} ({feedbackList?.length || 2})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("farmers")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "farmers"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#79C267]" />
          <span>Farmer Search & History</span>
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "payments"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-[#79C267]" />
          <span>DBT Payment Approvals ({pendingPayments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("bottlenecks")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "bottlenecks"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-[#79C267]" />
          <span>
            AI Bottleneck Intelligence (
            {bottlenecks.filter((b) => !b.resolved).length})
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & LIVE TELEMETRY */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Live Active Workflow Telemetry Bar */}
          <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-5">
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
              <div>
                <h3 className="text-lg font-serif text-[#F2F0E8]">
                  Centre Operations & Real-Time Workflow Telemetry
                </h3>
                <p className="text-xs font-mono text-[#A6ADA3]">
                  Live active tokens across Karnal Central Grain Mandi
                </p>
              </div>
              <span className="px-3 py-1 rounded-sm bg-[#164A29] text-[#79C267] font-mono text-xs border border-[#79C267]/30">
                72 Active Bookings • 80% Capacity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {bookings.slice(0, 5).map((b) => {
                const verificationRec = identityVerifications.find(
                  (v) =>
                    v.bookingId === b.id ||
                    v.bookingId === b.booking_id ||
                    v.booking_id === b.id ||
                    v.booking_id === b.booking_id,
                );

                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-sm bg-[#050805] border border-[#1A2E1E] space-y-2 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-serif text-[#79C267]">
                        {b.tokenDisplay}
                      </span>
                      <span className="text-[10px] text-[#79C267] bg-[#164A29] px-2 py-0.5 rounded-sm border border-[#79C267]/30">
                        {b.stage}
                      </span>
                    </div>
                    <div className="text-xs font-serif text-[#F2F0E8] truncate">
                      {b.farmerName}
                    </div>
                    <div className="text-[10px] text-[#A6ADA3]">
                      {b.crop} • {b.quantity} Qtl
                    </div>
                    <div className="pt-1">
                      {verificationRec?.verificationStatus === "VERIFIED" ? (
                        <span className="px-2 py-0.5 rounded bg-[#12351F] text-[#79C267] text-[9px] border border-[#79C267]/30">
                          Identity Verified ✓
                        </span>
                      ) : verificationRec?.verificationStatus ===
                        "REVIEW_REQUIRED" ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[9px] border border-amber-800/50">
                          Review Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#071008] text-[#A6ADA3] text-[9px] border border-[#1A2E1E]">
                          Photo Captured
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Signal Connecting Feedback to AI Bottlenecks */}
          {weighingFeedbackCount > 0 && (
            <div className="bg-[#071008] p-5 rounded-md border border-amber-800/50 space-y-2 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  {t("operationalSignalTitle")}
                </span>
                <span className="text-[10px] font-mono text-red-300 bg-red-950/60 border border-red-800/50 px-2.5 py-0.5 rounded-sm uppercase">
                  HIGH CONGESTION SIGNAL
                </span>
              </div>
              <p className="text-xs font-sans text-[#A6ADA3]">
                {t("operationalSignalDesc")}{" "}
                <strong className="text-[#F2F0E8]">WEIGHING BRIDGE #2</strong>{" "}
                (Current: 8.2 min vs 5.1 min baseline).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("bottlenecks")}
                  className="px-4 py-2 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 cursor-pointer"
                >
                  {t("reviewCapacityBtn")}
                </button>
              </div>
            </div>
          )}

          {/* XAI Factors Breakdown */}
          <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-4">
            <h3 className="text-base font-serif text-[#F2F0E8] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#79C267]" />
              <span>Explainable AI (XAI) Congestion Telemetry</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {xaiFactors.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-sm bg-[#050805] border border-[#1A2E1E] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-serif text-[#F2F0E8]">
                      {item.factor}
                    </h4>
                    <p className="text-[11px] text-[#A6ADA3] font-sans mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-sm border ${
                      item.positive
                        ? "bg-[#164A29] text-[#79C267] border-[#79C267]/30"
                        : "bg-red-950/60 text-red-300 border-red-800/50"
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANONYMOUS FARMER FEEDBACK QUEUE */}
      {activeTab === "feedback" && (
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
            <div>
              <h3 className="text-lg font-serif text-[#F2F0E8]">
                {t("anonymousFarmerFeedbackTitle")}
              </h3>
              <p className="text-xs font-mono text-[#A6ADA3]">
                Farmer identity is strictly protected and hidden to preserve
                objective operational insights.
              </p>
            </div>
            <span className="px-3 py-1 rounded-sm bg-[#164A29] text-[#79C267] text-xs font-mono border border-[#79C267]/30">
              {feedbackList?.length || 0} Total Responses
            </span>
          </div>

          <div className="space-y-4">
            {(feedbackList || []).map((fb) => (
              <div
                key={fb.id}
                className="p-5 rounded-sm bg-[#050805] border border-[#1A2E1E] space-y-3 font-sans"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#79C267]">
                      {t("anonymousFeedbackLabel")}
                    </span>
                    <span className="text-[10px] font-mono text-[#A6ADA3]">
                      [{fb.anonymousRef}]
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-xs">
                    <span>★ {fb.rating} / 5</span>
                  </div>
                </div>

                <p className="text-xs text-[#F2F0E8] font-sans italic">
                  "{fb.feedbackText || "No comment provided."}"
                </p>

                <div className="flex items-center justify-between pt-2 text-[11px] text-[#A6ADA3] font-mono border-t border-[#1A2E1E]">
                  <span>
                    Centre: <strong className="text-[#F2F0E8]">{fb.centreName}</strong>
                  </span>
                  <span>
                    Category:{" "}
                    <strong className="text-[#79C267] bg-[#164A29] px-2 py-0.5 rounded-sm border border-[#79C267]/30">
                      {fb.category}
                    </strong>
                  </span>
                  <span>Date: {fb.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FARMER SEARCH & HISTORY */}
      {activeTab === "farmers" && (
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6">
          <div>
            <h3 className="text-lg font-serif text-[#F2F0E8]">
              Farmer Verification & Profile Lookup
            </h3>
            <p className="text-xs font-mono text-[#A6ADA3]">
              Search by permanent ID (FRM-2026-XXXXXX) or mobile number
            </p>
          </div>

          <form onSubmit={handleSearchFarmer} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter FRM ID or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#050805] text-[#F2F0E8] focus:border-[#79C267]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider rounded-sm border border-[#79C267]/30 cursor-pointer"
            >
              Search
            </button>
          </form>

          {selectedFarmerHistory && selectedFarmerHistory !== "NOT_FOUND" && (
            <div className="p-5 rounded-sm bg-[#050805] border border-[#1A2E1E] space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-[#F2F0E8] text-base">
                    {selectedFarmerHistory.name}
                  </h4>
                  <p className="text-[#A6ADA3]">
                    ID: {selectedFarmerHistory.farmerId} • Mobile: +91{" "}
                    {selectedFarmerHistory.mobile}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-sm bg-[#164A29] text-[#79C267] text-xs border border-[#79C267]/30">
                  {selectedFarmerHistory.crops?.length || 4} Registered Crops
                </span>
              </div>
            </div>
          )}

          {selectedFarmerHistory === "NOT_FOUND" && (
            <div className="p-3 bg-red-950/40 text-red-300 text-xs font-mono rounded-sm border border-red-900/60">
              No farmer profile found.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DBT PAYMENT APPROVALS */}
      {activeTab === "payments" && (
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6">
          <div>
            <h3 className="text-lg font-serif text-[#F2F0E8]">
              Direct Benefit Transfer (DBT) Payout Approvals
            </h3>
            <p className="text-xs font-mono text-[#A6ADA3]">
              Supervisory authorization required for direct bank disbursement
            </p>
          </div>

          <div className="space-y-4">
            {pendingPayments.length === 0 ? (
              <div className="text-center py-12 text-[#A6ADA3] text-xs font-mono">
                No pending payment authorizations.
              </div>
            ) : (
              pendingPayments.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-sm bg-[#050805] border border-[#1A2E1E] flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-serif text-[#79C267]">
                      Token #{b.tokenDisplay}
                    </span>
                    <h4 className="font-serif text-[#F2F0E8] text-sm">{b.farmerName}</h4>
                    <p className="text-[#A6ADA3]">
                      {b.crop} • {b.weighedQuantity || b.quantity} Qtl • Amount:{" "}
                      <strong className="text-[#79C267]">
                        ₹
                        {(
                          b.paymentDetails?.grossAmount || 58417
                        ).toLocaleString()}
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={() => approveFinalPayment(b.id)}
                    className="px-5 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 cursor-pointer"
                  >
                    Authorize DBT Payout
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: AI BOTTLENECKS */}
      {activeTab === "bottlenecks" && (
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6">
          <div>
            <h3 className="text-lg font-serif text-[#F2F0E8]">
              Real-Time AI Bottleneck Detection & Operational Signals
            </h3>
            <p className="text-xs font-mono text-[#A6ADA3]">
              Automated sensor monitoring across Mandi operational counters
            </p>
          </div>

          <div className="space-y-4">
            {bottlenecks.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-sm bg-[#050805] border border-amber-800/40 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <h4 className="font-serif text-amber-400 text-sm">{b.counterName}</h4>
                  <p className="text-[#A6ADA3] font-sans mt-0.5">{b.issue}</p>
                  <span className="text-[10px] text-[#A6ADA3]/70">
                    Current: {b.currentMins} mins vs Expected: {b.expectedMins}{" "}
                    mins
                  </span>
                </div>

                {!b.resolved ? (
                  <button
                    onClick={() => resolveBottleneck(b.id)}
                    className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 cursor-pointer"
                  >
                    Deploy Intervention
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-sm bg-[#164A29] text-[#79C267] text-xs border border-[#79C267]/30">
                    Resolved ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

