import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  User,
  Scale,
  DollarSign,
  CheckSquare,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ArrivalVerificationModal from "../components/ArrivalVerificationModal";

export default function WorkerDashboardView() {
  const {
    user,
    bookings,
    identityVerifications,
    workerAssignedStage,
    setWorkerAssignedStage,
    advanceBookingStage,
    rejectStage,
    searchFarmerById,
    navigateTo,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFarmer, setSearchedFarmer] = useState(null);
  const [verifyingArrivalBooking, setVerifyingArrivalBooking] = useState(null);

  // Weight Entry Modal / Form
  const [weighingBookingId, setWeighingBookingId] = useState(null);
  const [weighedInput, setWeighedInput] = useState("25.18");

  // Rejection Modal State
  const [rejectingBookingId, setRejectingBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState(
    "Moisture content exceeds 17% threshold",
  );
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [proofFileName] = useState("lab_moisture_sensor_report.pdf");

  // Receipt Upload Modal State (Required before COMPLETED)
  const [receiptUploadBookingId, setReceiptUploadBookingId] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState(
    "final_procurement_receipt_P147.pdf",
  );

  // Filter tasks for worker's assigned stage or all
  const filteredBookings = bookings.filter((b) => {
    if (workerAssignedStage === "ALL") return true;
    return b.stage === workerAssignedStage;
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchedFarmer(null);
      return;
    }
    const result = await searchFarmerById(searchQuery);
    setSearchedFarmer(result || "NOT_FOUND");
  };

  const handleStageAdvance = async (bookingId, currentStage) => {
    if (currentStage === "BOOKED") {
      await advanceBookingStage(
        bookingId,
        "ARRIVED",
        "Mandi Gate Token Arrival Confirmed by Staff",
      );
    } else if (currentStage === "ARRIVED") {
      await advanceBookingStage(
        bookingId,
        "QUALITY_CHECK",
        "Quality moisture lab test completed",
      );
    } else if (currentStage === "QUALITY_CHECK") {
      setWeighingBookingId(bookingId);
      const b = bookings.find((bk) => bk.id === bookingId);
      setWeighedInput(String(b?.quantity ? Number(b.quantity) + 0.18 : 25.18));
    } else if (currentStage === "WEIGHING") {
      await advanceBookingStage(
        bookingId,
        "PROCUREMENT",
        "Official MSP purchase voucher logged by Staff",
      );
    } else if (currentStage === "PROCUREMENT") {
      await advanceBookingStage(
        bookingId,
        "PAYMENT",
        "DBT payment entry logged by Staff",
      );
    } else if (currentStage === "PAYMENT") {
      // Mandate receipt upload before transaction completion
      setReceiptUploadBookingId(bookingId);
    }
  };

  const handleReceiptUploadSubmit = async (e) => {
    e.preventDefault();
    if (!receiptUploadBookingId) return;
    await advanceBookingStage(
      receiptUploadBookingId,
      "COMPLETED",
      `Final procurement receipt (${receiptFileName}) attached and transaction completed with SHA-256 seal`,
      {
        receiptUploaded: true,
        receiptFileName:
          receiptFileName || "final_procurement_receipt_P147.pdf",
      },
    );
    setReceiptUploadBookingId(null);
  };

  const handleWeighingSubmit = async (e) => {
    e.preventDefault();
    if (!weighingBookingId || !weighedInput) return;
    const wt = Number(weighedInput);
    await advanceBookingStage(
      weighingBookingId,
      "WEIGHING",
      `Digital Weighbridge recorded ${wt} Qtl`,
      {
        weighedQuantity: wt,
      },
    );
    setWeighingBookingId(null);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingBookingId || !rejectReason) return;
    await rejectStage(rejectingBookingId, workerAssignedStage, {
      reason: rejectReason,
      remarks:
        rejectRemarks ||
        "Stage rejected based on physical inspection standards.",
      proofImage: proofFileName,
    });
    setRejectingBookingId(null);
    setRejectRemarks("");
  };

  return (
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 selection:bg-[#164A29] selection:text-[#79C267]">
      {/* Header Bar */}
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
              {t("workerPortal")}
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px] font-mono border border-[#79C267]/30 uppercase">
              STAFF DESK
            </span>
          </div>
          <p className="text-xs text-[#A6ADA3] font-mono mt-1">
            Logged in as {user?.name || "Sukhvinder Singh"} • Mandi Staff ID:{" "}
            {user?.id || "WRK-HR-108"}
          </p>
        </div>

        {/* Assigned Stage Selector */}
        <div className="flex items-center gap-3 bg-[#071008] p-2 rounded border border-[#1A2E1E]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A6ADA3] pl-1">
            Assigned Duty:
          </span>
          <select
            value={workerAssignedStage}
            onChange={(e) => setWorkerAssignedStage(e.target.value)}
            className="px-3 py-1.5 rounded-sm text-xs font-mono bg-[#050805] text-[#79C267] border border-[#79C267]/30 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Stages Work Queue</option>
            <option value="BOOKED">Booked (Pending Arrival)</option>
            <option value="ARRIVED">Arrived (Gate Verification)</option>
            <option value="QUALITY_CHECK">
              Quality Check (Lab Inspection)
            </option>
            <option value="WEIGHING">Weighbridge (Tare/Gross Loading)</option>
            <option value="PROCUREMENT">Procurement Purchase Voucher</option>
            <option value="PAYMENT">DBT Payment Entry</option>
          </select>
        </div>
      </div>

      {/* Farmer Search Bar */}
      <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#A6ADA3] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#79C267]" />
          <span>Search Farmer by Permanent ID (FRM-2026-XXXXXX) or Mobile</span>
        </h3>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. FRM-2026-000123 or 9876543210"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider rounded-sm border border-[#79C267]/30 transition-all cursor-pointer"
          >
            Search Profile
          </button>
        </form>

        {/* Searched Farmer Result */}
        {searchedFarmer && searchedFarmer !== "NOT_FOUND" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded bg-[#164A29] text-[#79C267] border border-[#79C267]/30 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-[#F2F0E8] text-sm">
                  {searchedFarmer.name}
                </h4>
                <p className="text-[#A6ADA3] text-[11px]">
                  ID: {searchedFarmer.farmerId} • Mobile: +91{" "}
                  {searchedFarmer.mobile}
                </p>
                <p className="text-[#A6ADA3]/70 text-[10px]">
                  {searchedFarmer.village}, {searchedFarmer.district} (
                  {searchedFarmer.state})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#164A29]/60 text-[#79C267] text-[10px] border border-[#79C267]/30">
                {searchedFarmer.crops?.length || 4} Registered Crops
              </span>
            </div>
          </motion.div>
        )}

        {searchedFarmer === "NOT_FOUND" && (
          <div className="p-3 bg-red-950/40 text-red-300 text-xs font-mono rounded-sm border border-red-900/60">
            No farmer found matching query "{searchQuery}". Please check the ID.
          </div>
        )}
      </div>

      {/* Assigned Tasks Queue Table */}
      <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-5">
        <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
          <div>
            <h3 className="text-lg font-serif text-[#F2F0E8]">
              {t("todayAppointments")}
            </h3>
            <p className="text-xs font-mono text-[#A6ADA3]">
              {filteredBookings.length} {t("pendingActionsCount")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-[#A6ADA3] space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-[#79C267]" />
              <p className="text-xs font-mono">
                No pending actions in this queue.
              </p>
            </div>
          ) : (
            filteredBookings.map((b) => {
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
                  className="p-5 rounded-sm bg-[#050805] border border-[#1A2E1E] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap font-mono">
                      <span className="text-base font-serif text-[#79C267]">
                        Token #{b.tokenDisplay}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px] border border-[#79C267]/30">
                        {b.stage}
                      </span>

                      {/* 1:1 Identity Verification Status Chip */}
                      {verificationRec?.verificationStatus === "VERIFIED" ? (
                        <span className="px-2.5 py-0.5 rounded bg-[#12351F] text-[#79C267] text-[10px] border border-[#79C267]/40">
                          Identity Verified ✓
                        </span>
                      ) : verificationRec?.verificationStatus ===
                        "REVIEW_REQUIRED" ? (
                        <span className="px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[10px] border border-amber-800/50">
                          Staff Review Required
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded bg-[#071008] text-[#A6ADA3] text-[10px] border border-[#1A2E1E]">
                          Pending Arrival Verification
                        </span>
                      )}

                      <span className="text-xs text-[#A6ADA3] font-mono">
                        [{b.farmerId}]
                      </span>
                    </div>

                    <h4 className="text-base font-serif text-[#F2F0E8]">
                      {b.farmerName}
                    </h4>
                    <p className="text-xs text-[#A6ADA3] font-sans">
                      Crop: <strong className="text-[#F2F0E8]">{b.crop}</strong> • Booked:{" "}
                      <strong className="text-[#79C267]">
                        {b.quantity} Qtl
                      </strong>{" "}
                      {b.weighedQuantity &&
                        `• Weighed: ${b.weighedQuantity} Qtl`}{" "}
                      • Center: {b.centreName}
                    </p>
                  </div>

                  {/* Worker Sequential Action Controls */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                    <span className="text-[10px] text-[#A6ADA3] font-mono uppercase block sm:inline">
                      {t("nextActionLabel")}:
                    </span>

                    {(b.stage === "BOOKED" || b.stage === "ARRIVED") && (
                      <button
                        onClick={() => setVerifyingArrivalBooking(b)}
                        className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                        <span>VERIFY FARMER IDENTITY</span>
                      </button>
                    )}

                    {b.stage === "BOOKED" && (
                      <button
                        onClick={() => handleStageAdvance(b.id, "BOOKED")}
                        className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                        <span>GATE ARRIVAL</span>
                      </button>
                    )}

                    {b.stage === "ARRIVED" && (
                      <button
                        onClick={() => handleStageAdvance(b.id, "ARRIVED")}
                        className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckSquare className="w-4 h-4 text-[#79C267]" />
                        <span>{t("startQualityCheckBtn")}</span>
                      </button>
                    )}

                    {b.stage === "QUALITY_CHECK" && (
                      <button
                        onClick={() =>
                          handleStageAdvance(b.id, "QUALITY_CHECK")
                        }
                        className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Scale className="w-4 h-4 text-[#79C267]" />
                        <span>{t("recordWeightBtn")}</span>
                      </button>
                    )}

                    {b.stage === "WEIGHING" && (
                      <button
                        onClick={() => handleStageAdvance(b.id, "WEIGHING")}
                        className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                        <span>{t("completeProcurementBtn")}</span>
                      </button>
                    )}

                    {b.stage === "PROCUREMENT" && (
                      <button
                        onClick={() => handleStageAdvance(b.id, "PROCUREMENT")}
                        className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <DollarSign className="w-4 h-4 text-[#79C267]" />
                        <span>{t("recordPaymentBtn")}</span>
                      </button>
                    )}

                    {b.stage === "PAYMENT" && (
                      <button
                        onClick={() => handleStageAdvance(b.id, "PAYMENT")}
                        className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                        <span>UPLOAD RECEIPT & COMPLETE</span>
                      </button>
                    )}

                    {b.stage === "COMPLETED" && (
                      <span className="px-3 py-1.5 rounded bg-[#164A29] text-[#79C267] font-mono text-xs border border-[#79C267]/30">
                        {t("transactionCompletedBadge")}
                      </span>
                    )}

                    {b.stage !== "COMPLETED" && (
                      <button
                        onClick={() => setRejectingBookingId(b.id)}
                        className="px-3 py-2.5 rounded-sm bg-red-950/50 hover:bg-red-900/60 text-red-300 font-mono text-xs uppercase border border-red-900/60 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Weighbridge Entry Modal */}
      <AnimatePresence>
        {weighingBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs selection:bg-[#164A29] selection:text-[#79C267]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#071008] rounded-md border border-[#1A2E1E] overflow-hidden"
            >
              <div className="bg-[#164A29] text-[#F2F0E8] p-6 flex items-center justify-between border-b border-[#79C267]/30">
                <div className="flex items-center gap-3">
                  <Scale className="w-6 h-6 text-[#79C267]" />
                  <div>
                    <h3 className="text-base font-serif">
                      Record Digital Weighbridge Weight
                    </h3>
                    <p className="text-xs font-mono text-[#79C267]">Gross Tare Logged</p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleWeighingSubmit}
                className="p-6 space-y-4 bg-[#050805]"
              >
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase mb-1.5">
                    {t("enterWeighedQuantity")} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={weighedInput}
                    onChange={(e) => setWeighedInput(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-sm border border-[#1A2E1E] text-base font-mono text-[#F2F0E8] bg-[#071008] focus:border-[#79C267]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#1A2E1E]">
                  <button
                    type="button"
                    onClick={() => setWeighingBookingId(null)}
                    className="px-4 py-2.5 rounded-sm border border-[#1A2E1E] text-xs font-mono text-[#A6ADA3] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 cursor-pointer"
                  >
                    Confirm Weighbridge Weight & Advance
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mandatory Rejection Reason & Proof Modal */}
      <AnimatePresence>
        {rejectingBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs selection:bg-[#164A29] selection:text-[#79C267]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#071008] rounded-md border border-red-900/60 overflow-hidden"
            >
              <div className="bg-red-950/80 text-red-100 p-6 flex items-center justify-between border-b border-red-900/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <div>
                    <h3 className="text-base font-serif text-red-200">
                      Mandatory Rejection Documentation
                    </h3>
                    <p className="text-xs font-mono text-red-300">
                      Audit compliance requires reason & supporting proof
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleRejectSubmit}
                className="p-6 space-y-4 bg-[#050805]"
              >
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase mb-1">
                    Standard Rejection Reason *
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#071008] text-[#F2F0E8] focus:border-red-500"
                  >
                    <option value="Moisture content exceeds 17% threshold">
                      Moisture content exceeds 17% threshold
                    </option>
                    <option value="Foreign matter / husk exceeds 2% permissible limit">
                      Foreign matter / husk exceeds 2% permissible limit
                    </option>
                    <option value="Gross vs tare weight discrepancy exceeds 50kg">
                      Gross vs tare weight discrepancy exceeds 50kg
                    </option>
                    <option value="Grain discolored or insect damaged">
                      Grain discolored or insect damaged
                    </option>
                    <option value="Aadhaar KYC mismatch with registered slot profile">
                      Aadhaar KYC mismatch with registered slot profile
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase mb-1">
                    Detailed Inspection Remarks *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter physical inspection notes and sensor readings..."
                    value={rejectRemarks}
                    onChange={(e) => setRejectRemarks(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-sm border border-[#1A2E1E] text-xs font-sans bg-[#071008] text-[#F2F0E8] focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase mb-1">
                    Supporting Proof Document / Photo *
                  </label>
                  <div className="p-3 bg-[#071008] rounded-sm border border-dashed border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
                    <span className="truncate text-[#A6ADA3]">
                      {proofFileName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px]">
                      ATTACHED
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#1A2E1E]">
                  <button
                    type="button"
                    onClick={() => setRejectingBookingId(null)}
                    className="px-4 py-2 rounded-sm border border-[#1A2E1E] text-xs font-mono text-[#A6ADA3] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-sm bg-red-900 hover:bg-red-800 text-red-100 text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Confirm Rejection & Log SHA-256
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Upload Modal for Staff */}
      <AnimatePresence>
        {receiptUploadBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs selection:bg-[#164A29] selection:text-[#79C267]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#071008] rounded-md border border-[#1A2E1E] overflow-hidden"
            >
              <div className="bg-[#164A29] text-[#F2F0E8] p-6 flex items-center justify-between border-b border-[#79C267]/30">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-6 h-6 text-[#79C267]" />
                  <div>
                    <h3 className="text-base font-serif">
                      Upload Official Procurement Receipt
                    </h3>
                    <p className="text-xs font-mono text-[#79C267]">
                      Required for Transaction Completion
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleReceiptUploadSubmit}
                className="p-6 space-y-4 font-sans text-xs bg-[#050805]"
              >
                <div className="p-3 bg-[#071008] rounded-sm border border-[#1A2E1E] text-[#A6ADA3] space-y-1 font-mono">
                  <div className="text-[#F2F0E8]">
                    Booking Verification:
                  </div>
                  <div>
                    Booking ID:{" "}
                    {bookings.find((bk) => bk.id === receiptUploadBookingId)
                      ?.booking_id || "BK-2026-000147"}
                  </div>
                  <div>
                    Token: #
                    {bookings.find((bk) => bk.id === receiptUploadBookingId)
                      ?.tokenDisplay || "P-147"}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#A6ADA3] font-mono uppercase tracking-wider text-[11px] block">
                    Select Receipt Document File:
                  </label>
                  <input
                    type="text"
                    value={receiptFileName}
                    onChange={(e) => setReceiptFileName(e.target.value)}
                    placeholder="e.g. final_procurement_receipt_P147.pdf"
                    required
                    className="w-full p-2.5 rounded-sm border border-[#1A2E1E] font-mono text-xs bg-[#071008] text-[#F2F0E8] focus:border-[#79C267]"
                  />
                  <p className="text-[10px] text-[#A6ADA3]/60 font-mono">
                    PDF, JPG or PNG format. Hashed with SHA-256 seal upon
                    upload.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#1A2E1E]">
                  <button
                    type="button"
                    onClick={() => setReceiptUploadBookingId(null)}
                    className="px-4 py-2 rounded-sm border border-[#1A2E1E] font-mono text-xs text-[#A6ADA3] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                    <span>Upload & Complete Transaction</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mandi Arrival 1:1 Face Verification Modal */}
      <ArrivalVerificationModal
        isOpen={!!verifyingArrivalBooking}
        onClose={() => setVerifyingArrivalBooking(null)}
        booking={verifyingArrivalBooking}
      />
    </div>
  );
}

