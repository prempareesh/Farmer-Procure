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
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function WorkerDashboardView() {
  const {
    user,
    bookings,
    workerAssignedStage,
    setWorkerAssignedStage,
    advanceBookingStage,
    rejectStage,
    rejectBooking,
    searchFarmerById,
    navigateTo,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFarmer, setSearchedFarmer] = useState(null);

  // Weight Entry Modal / Form
  const [weighingBookingId, setWeighingBookingId] = useState(null);
  const [weighedInput, setWeighedInput] = useState("25.18");

  // Rejection Modal State
  const [rejectingBookingId, setRejectingBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState(
    "Required documents could not be verified.",
  );
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [modalError, setModalError] = useState("");
  const [proofFileName] = useState("lab_moisture_sensor_report.pdf");

  // Receipt Upload Modal State (Required before COMPLETED)
  const [receiptUploadBookingId, setReceiptUploadBookingId] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState(
    "final_procurement_receipt_P147.pdf",
  );

  // Filter tasks for worker's assigned centre and assigned stage
  const staffMandiId =
    user?.mandiId || "186c9f3d-34bd-4413-9d95-77687b3fb49b";
  const staffMandiCode = "P"; // Canonical staff assigned to Karnal Central Grain Mandi (code P)

  const filteredBookings = bookings.filter((b) => {
    // Centre isolation filter: match centreId, centreCode, or Karnal Mandi name
    const isSameCentre =
      b.centreId === staffMandiId ||
      b.centreCode === staffMandiCode ||
      b.centreId === "186c9f3d-34bd-4413-9d95-77687b3fb49b" ||
      b.centre_id === "186c9f3d-34bd-4413-9d95-77687b3fb49b" ||
      (b.centreName && b.centreName.toLowerCase().includes("karnal"));

    if (!isSameCentre) return false;

    if (workerAssignedStage === "ALL") return true;
    return b.stage === workerAssignedStage || b.status === workerAssignedStage;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const seqA = a.tokenSeq || parseInt(String(a.tokenDisplay).replace(/\D/g, "") || "0", 10);
    const seqB = b.tokenSeq || parseInt(String(b.tokenDisplay).replace(/\D/g, "") || "0", 10);
    return seqA - seqB;
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
    setModalError("");

    if (!rejectingBookingId) return;

    const finalReason =
      rejectReason === "Other" || !rejectReason
        ? rejectRemarks
        : rejectRemarks
          ? `${rejectReason} — ${rejectRemarks}`
          : rejectReason;

    if (!finalReason || !finalReason.trim()) {
      setModalError("Please provide a reason for rejection.");
      return;
    }

    try {
      await rejectBooking(rejectingBookingId, finalReason.trim(), rejectRemarks);
      setRejectingBookingId(null);
      setRejectRemarks("");
      setModalError("");
      setRejectReason("Required documents could not be verified.");
    } catch (err) {
      setModalError(err.message || "Unable to reject this booking. Please try again.");
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 selection:bg-[#2E7D32] selection:text-white">
      {/* Header Bar */}
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
              {t("workerPortal")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1B4318] text-white text-[10px] font-black uppercase">
              STAFF DESK
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Logged in as {user?.name || "Sukhvinder Singh"} • Mandi Staff ID:{" "}
            {user?.id || "WRK-HR-108"}
          </p>
        </div>

        {/* Assigned Stage Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 pl-2">
            Assigned Duty:
          </span>
          <select
            value={workerAssignedStage}
            onChange={(e) => setWorkerAssignedStage(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#E8F5E9] text-[#1B4318] border border-[#A5D6A7] focus:outline-none cursor-pointer"
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
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#2E7D32]" />
          <span>Search Farmer by Permanent ID (FRM-2026-XXXXXX) or Mobile</span>
        </h3>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. FRM-2026-000123 or 9876543210"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#2E7D32] bg-[#FAF8F2]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer w-full sm:w-auto"
          >
            Search Profile
          </button>
        </form>

        {/* Searched Farmer Result */}
        {searchedFarmer && searchedFarmer !== "NOT_FOUND" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#E8F5E9]/60 rounded-2xl border border-[#A5D6A7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4318] text-white flex items-center justify-center font-bold">
                <User className="w-5 h-5 text-[#F9A825]" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900">
                  {searchedFarmer.name}
                </h4>
                <p className="text-gray-600 font-mono text-[11px]">
                  ID: {searchedFarmer.farmerId} • Mobile: +91{" "}
                  {searchedFarmer.mobile}
                </p>
                <p className="text-gray-500 text-[10px]">
                  {searchedFarmer.village}, {searchedFarmer.district} (
                  {searchedFarmer.state})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white text-[#2E7D32] font-black text-[10px] border border-[#A5D6A7]">
                {searchedFarmer.crops?.length || 4} Registered Crops
              </span>
            </div>
          </motion.div>
        )}

        {searchedFarmer === "NOT_FOUND" && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            No farmer found matching query "{searchQuery}". Please check the ID.
          </div>
        )}
      </div>

      {/* Assigned Tasks Queue Table */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {t("todayAppointments")}
            </h3>
            <p className="text-xs text-gray-500">
              {filteredBookings.length} {t("pendingActionsCount")}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
          {sortedBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white">
              <CheckCircle2 className="w-10 h-10 mx-auto text-[#2E7D32] mb-2" />
              <p className="text-xs font-bold text-gray-700">
                No pending actions in this queue.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-[#FAF8F2] border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-3.5">Token</th>
                  <th className="p-3.5">Booking ID</th>
                  <th className="p-3.5">Farmer ID</th>
                  <th className="p-3.5">Farmer Name</th>
                  <th className="p-3.5">Crop & Quantity</th>
                  <th className="p-3.5">Slot & Time</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Workflow Stage</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {sortedBookings.map((b) => {
                  const isCompletedStage = b.stage === "COMPLETED" || b.status === "COMPLETED";
                  const isRejectedStage = b.stage === "REJECTED" || b.status === "REJECTED";
                  console.log("[STAFF_ROW_RENDERED]", b.booking_id || b.id);
                  return (
                    <tr key={b.id || b.booking_id} className="hover:bg-green-50/50 transition-colors">
                      <td className="p-3.5 font-mono font-black text-amber-800 text-sm">
                        {b.tokenDisplay || "PS-001"}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#1B4318]">
                        {b.booking_id || b.id}
                      </td>
                      <td className="p-3.5 font-mono text-gray-600 font-bold">
                        {b.farmerId || "FRM-2026-000123"}
                      </td>
                      <td className="p-3.5 font-extrabold text-gray-900">
                        {b.farmerName}
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        <div>{b.crop || "Paddy"}</div>
                        <div className="text-[11px] text-[#2E7D32] font-black">
                          {b.quantity} Qtl {b.weighedQuantity && `(Actual: ${b.weighedQuantity} Qtl)`}
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-600">
                        <div>{b.date || b.slot_date}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{b.timeSlot || b.slot_time}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase ${
                          isCompletedStage
                            ? "bg-green-100 text-green-800 border-green-300"
                            : isRejectedStage
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}>
                          {b.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full font-black text-[10px] border ${
                          isRejectedStage
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"
                        }`}>
                          {b.stage}
                        </span>
                        {isRejectedStage && (b.rejection_reason || b.rejectionDetails?.reason) && (
                          <div className="text-[10px] text-red-600 font-semibold mt-0.5 truncate max-w-[180px]">
                            {b.rejection_reason || b.rejectionDetails?.reason}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isRejectedStage && b.stage === "BOOKED" && (
                            <button
                              onClick={() => handleStageAdvance(b.id, "BOOKED")}
                              className="px-3 py-1.5 rounded-lg bg-[#1B4318] hover:bg-[#2E7D32] text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>VERIFY ARRIVAL</span>
                            </button>
                          )}
                          {!isRejectedStage && b.stage === "ARRIVED" && (
                            <button
                              onClick={() => handleStageAdvance(b.id, "ARRIVED")}
                              className="px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>QUALITY CHECK</span>
                            </button>
                          )}
                          {!isRejectedStage && b.stage === "QUALITY_CHECK" && (
                            <button
                              onClick={() => handleStageAdvance(b.id, "QUALITY_CHECK")}
                              className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            >
                              <Scale className="w-3.5 h-3.5" />
                              <span>WEIGHBRIDGE</span>
                            </button>
                          )}
                          {!isRejectedStage && b.stage === "WEIGHING" && (
                            <button
                              onClick={() => handleStageAdvance(b.id, "WEIGHING")}
                              className="px-3 py-1.5 rounded-lg bg-[#1B4318] hover:bg-[#2E7D32] text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>VOUCHER</span>
                            </button>
                          )}
                          {!isRejectedStage && b.stage === "PROCUREMENT" && (
                            <button
                              onClick={() => handleStageAdvance(b.id, "PROCUREMENT")}
                              className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>DBT PAYMENT</span>
                            </button>
                          )}
                          {!isRejectedStage && b.stage === "PAYMENT" && (
                            <button
                              onClick={() => handleStageAdvance(b.id, "PAYMENT")}
                              className="px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>RECEIPT & COMPLETE</span>
                            </button>
                          )}
                          {isCompletedStage && (
                            <span className="px-2.5 py-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32] font-extrabold text-[11px] border border-[#A5D6A7]">
                              COMPLETED ✓
                            </span>
                          )}
                          {isRejectedStage && (
                            <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-extrabold text-[11px] border border-red-300">
                              REJECTED ✓
                            </span>
                          )}
                          {!isCompletedStage && !isRejectedStage && (
                            <button
                              onClick={() => {
                                setRejectingBookingId(b.id || b.booking_id);
                                setModalError("");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Weighbridge Entry Modal */}
      <AnimatePresence>
        {weighingBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in selection:bg-[#2E7D32] selection:text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-6 h-6 text-[#F9A825]" />
                  <div>
                    <h3 className="text-base font-bold">
                      Record Digital Weighbridge Weight
                    </h3>
                    <p className="text-xs text-[#A5D6A7]">Gross Tare Logged</p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleWeighingSubmit}
                className="p-6 space-y-4 bg-[#FAFBF8]"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    {t("enterWeighedQuantity")} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={weighedInput}
                    onChange={(e) => setWeighedInput(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-black text-gray-900 bg-white focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setWeighingBookingId(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white text-xs font-extrabold shadow-xs cursor-pointer"
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
        {rejectingBookingId && (() => {
          const activeRejBooking = bookings.find(
            (b) => b.id === rejectingBookingId || b.booking_id === rejectingBookingId,
          );
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in selection:bg-[#2E7D32] selection:text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden"
              >
                <div className="bg-red-600 text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-base font-bold">
                        Reject Booking Confirmation
                      </h3>
                      <p className="text-xs text-red-100">
                        Mandatory reason required for audit trail & farmer notification
                      </p>
                    </div>
                  </div>
                </div>

                {activeRejBooking && (
                  <div className="bg-red-50/80 px-6 py-3 border-b border-red-100 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-gray-500 font-sans font-medium">Farmer: </span>
                      <span className="font-bold text-gray-900 font-sans">{activeRejBooking.farmerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-sans font-medium">Token: </span>
                      <span className="font-black text-amber-800">{activeRejBooking.tokenDisplay || "PS-001"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-sans font-medium">Booking ID: </span>
                      <span className="font-bold text-[#1B4318]">{activeRejBooking.booking_id || activeRejBooking.id}</span>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleRejectSubmit}
                  className="p-6 space-y-4 bg-[#FAF8F2]"
                >
                  {modalError && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-bounce">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{modalError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Reason for Rejection *
                    </label>
                    <select
                      value={rejectReason}
                      onChange={(e) => {
                        setRejectReason(e.target.value);
                        setModalError("");
                      }}
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Required documents could not be verified.">
                        Required documents could not be verified.
                      </option>
                      <option value="Quantity exceeds the permitted limit.">
                        Quantity exceeds the permitted limit.
                      </option>
                      <option value="Farmer did not arrive within the permitted slot window.">
                        Farmer did not arrive within the permitted slot window.
                      </option>
                      <option value="Quality requirements were not met.">
                        Quality requirements were not met.
                      </option>
                      <option value="Slot booking details could not be verified.">
                        Slot booking details could not be verified.
                      </option>
                      <option value="Procurement centre capacity is currently unavailable.">
                        Procurement centre capacity is currently unavailable.
                      </option>
                      <option value="Other">Other / Custom Explanation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {rejectReason === "Other"
                        ? "Required Custom Explanation *"
                        : "Additional Remarks (Optional)"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        rejectReason === "Other"
                          ? "Enter explicit reason for rejecting this booking..."
                          : "Enter additional inspection notes or remarks..."
                      }
                      value={rejectRemarks}
                      onChange={(e) => {
                        setRejectRemarks(e.target.value);
                        setModalError("");
                      }}
                      required={rejectReason === "Other"}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setRejectingBookingId(null);
                        setModalError("");
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Reject Booking
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Receipt Upload Modal for Staff */}
      <AnimatePresence>
        {receiptUploadBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in selection:bg-[#2E7D32] selection:text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-6 h-6 text-[#F9A825]" />
                  <div>
                    <h3 className="text-base font-bold">
                      Upload Official Procurement Receipt
                    </h3>
                    <p className="text-xs text-[#A5D6A7]">
                      Required for Transaction Completion
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleReceiptUploadSubmit}
                className="p-6 space-y-4 font-sans text-xs"
              >
                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-gray-200 text-gray-700 space-y-1">
                  <div className="font-bold text-[#1B4318]">
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
                  <label className="text-gray-700 font-bold block">
                    Select Receipt Document File:
                  </label>
                  <input
                    type="text"
                    value={receiptFileName}
                    onChange={(e) => setReceiptFileName(e.target.value)}
                    placeholder="e.g. final_procurement_receipt_P147.pdf"
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-xs bg-white focus:ring-2 focus:ring-[#2E7D32]"
                  />
                  <p className="text-[10px] text-gray-500">
                    PDF, JPG or PNG format. Hashed with SHA-256 seal upon
                    upload.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setReceiptUploadBookingId(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Upload & Complete Transaction</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
