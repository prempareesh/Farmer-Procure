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
    peopleAhead,
    estimatedWaitMins,
    xaiFactors,
    bottlenecks,
    resolveBottleneck,
    fraudAlerts,
    resolveFraudAlert,
    approveFinalPayment,
    searchFarmerById,
    feedbackList,
    navigateTo,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'farmers' | 'payments' | 'feedback' | 'bottlenecks' | 'fraud'
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
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 selection:bg-[#2E7D32] selection:text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo("home")}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {t("officerPortal")} & Command Tower
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1B4318] text-white text-[10px] font-black uppercase">
              NORTH ZONE
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Supervisory procurement control, live workflow telemetry, anonymous
            feedback signals & cryptographic oversight
          </p>
        </div>

        <button
          onClick={() => navigateTo("audit")}
          className="px-4 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#F9A825]" />
          <span>SHA-256 Cryptographic Ledger</span>
        </button>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {t("registeredCrops")}
            </span>
            <h3 className="text-2xl font-black text-gray-900">
              {farmersList.length + 12480}
            </h3>
            <span className="text-[10px] text-[#2E7D32] font-semibold">
              100% Aadhaar Verified
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {t("dbtPaymentStatus")}
            </span>
            <h3 className="text-2xl font-black text-amber-600">
              {pendingPayments.length} Authorizations
            </h3>
            <span className="text-[10px] text-gray-500 font-semibold">
              Direct DBT Queue
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {t("avgWaitTime")}
            </span>
            <h3 className="text-2xl font-black text-gray-900">
              ~{estimatedWaitMins} mins
            </h3>
            <span className="text-[10px] text-[#2E7D32] font-semibold">
              {peopleAhead} Trucks in Lane
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#1B4318] flex items-center justify-center font-bold shrink-0">
            <MessageSquare className="w-6 h-6 text-[#2E7D32]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {t("feedbackAvgRating")}
            </span>
            <h3 className="text-2xl font-black text-[#1B4318]">
              {avgRating} / 5
            </h3>
            <span className="text-[10px] text-gray-500 font-semibold">
              {feedbackList?.length || 12} {t("feedbackResponses")}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 w-full max-w-full overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === "overview"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          Overview & Telemetry
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === "feedback"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>
            {t("anonymousFarmerFeedbackTitle")} ({feedbackList?.length || 2})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("farmers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === "farmers"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Farmer Search & History</span>
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === "payments"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>DBT Payment Approvals ({pendingPayments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("bottlenecks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === "bottlenecks"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
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
          <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Centre Operations & Real-Time Workflow Telemetry
                </h3>
                <p className="text-xs text-gray-500">
                  Live active tokens across Karnal Central Grain Mandi
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-xs">
                72 Active Bookings • 80% Capacity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {bookings.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-[#FAFBF8] border border-gray-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#1B4318]">
                      {b.tokenDisplay}
                    </span>
                    <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      {b.stage}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {b.farmerName}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {b.crop} • {b.quantity} Qtl
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Signal Connecting Feedback to AI Bottlenecks */}
          {weighingFeedbackCount > 0 && (
            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 space-y-2 font-sans shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  {t("operationalSignalTitle")}
                </span>
                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full uppercase">
                  HIGH CONGESTION SIGNAL
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-800">
                {t("operationalSignalDesc")}{" "}
                <strong className="text-amber-900">WEIGHING BRIDGE #2</strong>{" "}
                (Current: 8.2 min vs 5.1 min baseline).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("bottlenecks")}
                  className="px-4 py-2 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {t("reviewCapacityBtn")}
                </button>
              </div>
            </div>
          )}

          {/* XAI Factors Breakdown */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2E7D32]" />
              <span>Explainable AI (XAI) Congestion Telemetry</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {xaiFactors.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E0ECE0] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      {item.factor}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      item.positive
                        ? "bg-green-100 text-[#2E7D32]"
                        : "bg-red-100 text-red-700"
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
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {t("anonymousFarmerFeedbackTitle")}
              </h3>
              <p className="text-xs text-gray-500">
                Farmer identity is strictly protected and hidden to preserve
                objective operational insights.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black">
              {feedbackList?.length || 0} Total Responses
            </span>
          </div>

          <div className="space-y-3">
            {(feedbackList || []).map((fb) => (
              <div
                key={fb.id}
                className="p-5 rounded-2xl bg-[#FAFBF8] border border-gray-200 space-y-2 font-sans"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1B4318]">
                      {t("anonymousFeedbackLabel")}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">
                      [{fb.anonymousRef}]
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#F9A825] font-black text-xs">
                    <span>★ {fb.rating} / 5</span>
                  </div>
                </div>

                <p className="text-xs text-gray-800 font-semibold italic">
                  "{fb.feedbackText || "No comment provided."}"
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 border-t border-gray-100">
                  <span>
                    Centre: <strong>{fb.centreName}</strong>
                  </span>
                  <span>
                    Category:{" "}
                    <strong className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
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
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Farmer Verification & Profile Lookup
            </h3>
            <p className="text-xs text-gray-500">
              Search by permanent ID (FRM-2026-XXXXXX) or mobile number
            </p>
          </div>

          <form onSubmit={handleSearchFarmer} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter FRM ID or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Search
            </button>
          </form>

          {selectedFarmerHistory && selectedFarmerHistory !== "NOT_FOUND" && (
            <div className="p-5 rounded-2xl bg-[#E8F5E9]/60 border border-[#A5D6A7] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">
                    {selectedFarmerHistory.name}
                  </h4>
                  <p className="text-gray-600 font-mono">
                    ID: {selectedFarmerHistory.farmerId} • Mobile: +91{" "}
                    {selectedFarmerHistory.mobile}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#2E7D32] font-black text-xs border border-[#A5D6A7]">
                  {selectedFarmerHistory.crops?.length || 4} Registered Crops
                </span>
              </div>
            </div>
          )}

          {selectedFarmerHistory === "NOT_FOUND" && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
              No farmer profile found.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DBT PAYMENT APPROVALS */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Direct Benefit Transfer (DBT) Payout Approvals
            </h3>
            <p className="text-xs text-gray-500">
              Supervisory authorization required for direct bank disbursement
            </p>
          </div>

          <div className="space-y-3">
            {pendingPayments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs font-bold">
                No pending payment authorizations.
              </div>
            ) : (
              pendingPayments.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E0ECE0] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-black text-[#1B4318]">
                      Token #{b.tokenDisplay}
                    </span>
                    <h4 className="font-bold text-gray-900">{b.farmerName}</h4>
                    <p className="text-gray-600">
                      {b.crop} • {b.weighedQuantity || b.quantity} Qtl • Amount:{" "}
                      <strong className="text-[#2E7D32]">
                        ₹
                        {(
                          b.paymentDetails?.grossAmount || 58417
                        ).toLocaleString()}
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={() => approveFinalPayment(b.id)}
                    className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs shadow-xs cursor-pointer"
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
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Real-Time AI Bottleneck Detection & Operational Signals
            </h3>
            <p className="text-xs text-gray-500">
              Automated sensor monitoring across Mandi operational counters
            </p>
          </div>

          <div className="space-y-3">
            {bottlenecks.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-black text-amber-900">{b.counterName}</h4>
                  <p className="text-gray-700">{b.issue}</p>
                  <span className="text-[10px] text-gray-500 font-bold">
                    Current: {b.currentMins} mins vs Expected: {b.expectedMins}{" "}
                    mins
                  </span>
                </div>

                {!b.resolved ? (
                  <button
                    onClick={() => resolveBottleneck(b.id)}
                    className="px-4 py-2 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs cursor-pointer"
                  >
                    Deploy Intervention
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
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
