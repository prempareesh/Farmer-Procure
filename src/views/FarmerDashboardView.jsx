import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Sprout,
  Calendar,
  Clock,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  ArrowLeft,
  FileText,
  Camera,
  Star,
  MessageSquare,
  Send,
} from "lucide-react";
import { useApp, WORKFLOW_STAGES } from "../context/AppContext";
import DigitalReceiptModal from "../components/DigitalReceiptModal";
import IdentityCameraModal from "../components/IdentityCameraModal";

export default function FarmerDashboardView() {
  const {
    farmerProfile,
    crops,
    addCrop,
    deleteCrop,
    bookings,
    activeBooking,
    servingToken,
    peopleAhead,
    estimatedWaitMins,
    advanceBookingStage,
    submitAnonymousFeedback,
    navigateTo,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState("queue"); // 'queue' | 'gate' | 'workflow' | 'crops' | 'payment'

  // Modals state
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  // Crop modal state
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [newCropName, setNewCropName] = useState("Paddy (Basmati 1121)");
  const [newArea, setNewArea] = useState("");
  const [newYield, setNewYield] = useState("");

  // Anonymous Feedback state
  const [rating, setRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState("WEIGHING DELAY");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const currentBooking = activeBooking || bookings[0];

  const handleIveArrived = async () => {
    if (!currentBooking) return;
    await advanceBookingStage(
      currentBooking.id,
      "ARRIVED",
      "Farmer marked arrival at Mandi Gate",
    );
  };

  const handleCameraPhotoConfirmed = async (photoUrl) => {
    if (!currentBooking) return;
    await advanceBookingStage(
      currentBooking.id,
      "ARRIVED",
      "Farmer identity photo verified",
    );
  };

  const handleAddCropSubmit = (e) => {
    e.preventDefault();
    if (!newCropName || !newArea || !newYield) return;
    addCrop({
      name: newCropName,
      areaAcres: newArea,
      expectedYieldQuintals: newYield,
    });
    setNewArea("");
    setNewYield("");
    setIsAddingCrop(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!currentBooking) return;
    submitAnonymousFeedback({
      bookingId: currentBooking.booking_id || currentBooking.id,
      centreName: currentBooking.centreName,
      rating,
      category: feedbackCategory,
      feedbackText,
      stage: currentBooking.stage,
    });
    setFeedbackSubmitted(true);
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 selection:bg-[#2E7D32] selection:text-white">
      {/* Top Header & Navigation */}
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
              {t("farmerPortal")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black border border-[#A5D6A7]">
              {farmerProfile.farmerId}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            {t("welcomeBack")}, {farmerProfile.name} • {farmerProfile.village},{" "}
            {farmerProfile.district} ({farmerProfile.state})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentBooking?.stage === "COMPLETED" && (
            <button
              onClick={() => setReceiptModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#F9A825]" />
              <span>{t("viewReceiptBtn")}</span>
            </button>
          )}

          <button
            onClick={() => navigateTo("book-slot")}
            className="px-4 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#F9A825]" />
            <span>{t("bookSlot")}</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Strip */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">
              {t("permanentFarmerId")}
            </span>
            <span className="text-sm font-mono font-black text-[#1B4318]">
              {farmerProfile.farmerId}
            </span>
            <p className="text-[11px] text-gray-500">{farmerProfile.aadhaar}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">
              {t("registeredCrops")}
            </span>
            <span className="text-sm font-black text-gray-900">
              {crops.length} MSP Eligible Crops
            </span>
            <p className="text-[11px] text-gray-500">
              Total ~{crops.reduce((acc, c) => acc + c.areaAcres, 0)} Acres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">
              {t("authenticationStatus")}
            </span>
            <span className="text-sm font-black text-[#2E7D32]">
              OTP + JWT Active
            </span>
            <p className="text-[11px] text-gray-500">100% Session Secured</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">
              {t("dbtLinkedAccount")}
            </span>
            <span className="text-xs font-bold text-gray-900 truncate block max-w-40">
              {farmerProfile.bankAccount}
            </span>
            <p className="text-[10px] font-mono text-gray-400">
              {farmerProfile.ifsc}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "queue"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t("liveQueueTokens")}</span>
        </button>
        <button
          onClick={() => setActiveTab("gate")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "gate"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t("mandiGateArrival")}</span>
        </button>
        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "workflow"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("workflow7Stage")}</span>
        </button>
        <button
          onClick={() => setActiveTab("crops")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "crops"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>{t("myCropsPortfolio")}</span>
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "payment"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DBT Payment Status</span>
        </button>
      </div>

      {/* TAB 1: LIVE QUEUE & TOKEN SYSTEM */}
      {activeTab === "queue" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Live Journey Progress Banner */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Today's Active Token Details
                  </h3>
                  <p className="text-xs text-gray-500">
                    Mandi: {currentBooking?.centreName}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-xs">
                  {currentBooking?.stage}
                </span>
              </div>

              {/* Action Banner for GATE ARRIVAL */}
              {currentBooking?.stage === "BOOKED" && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">
                      Have you arrived at Karnal Mandi Gate?
                    </span>
                    <span className="text-[11px] text-amber-700">
                      Click below to update your status live for Mandi Staff.
                    </span>
                  </div>
                  <button
                    onClick={handleIveArrived}
                    className="px-5 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-extrabold shadow-sm shrink-0 transition-colors cursor-pointer"
                  >
                    {t("iveArrivedBtn")}
                  </button>
                </div>
              )}

              {currentBooking?.stage === "ARRIVED" && (
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-blue-900 block">
                      {t("arrivalVerifiedMsg")}
                    </span>
                    <span className="text-blue-700">{t("staffNotified")}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                    Quality Check Pending
                  </span>
                </div>
              )}

              {currentBooking?.stage === "COMPLETED" && (
                <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#A5D6A7] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-[#1B4318] block">
                      {t("transactionCompletedBadge")}
                    </span>
                    <span className="text-[11px] text-[#2E7D32]">
                      Your official digital procurement receipt is ready to
                      download or print.
                    </span>
                  </div>
                  <button
                    onClick={() => setReceiptModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#F9A825]" />
                    <span>{t("viewReceiptBtn")}</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Now Serving at Gate
                  </span>
                  <p className="text-3xl font-black text-[#2E7D32] mt-1">
                    K00{servingToken}
                  </p>
                  <span className="text-[10px] text-gray-500">
                    Daily Queue (Started 9:00 AM)
                  </span>
                </div>

                <div className="p-4 bg-[#E8F5E9]/60 rounded-2xl border border-[#A5D6A7]">
                  <span className="text-[10px] font-bold text-[#2E7D32] uppercase">
                    Your Assigned Token
                  </span>
                  <p className="text-3xl font-black text-[#1B4318] mt-1">
                    {currentBooking?.tokenDisplay || "P-147"}
                  </p>
                  <span className="text-[10px] text-[#2E7D32] font-bold">
                    {currentBooking?.crop}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-500 font-medium">
                    Vehicles Ahead:
                  </span>
                  <p className="text-xl font-black text-amber-600 mt-0.5">
                    {peopleAhead} in lane
                  </p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-500 font-medium">
                    Estimated Waiting Time:
                  </span>
                  <p className="text-xl font-black text-gray-900 mt-0.5">
                    ~{estimatedWaitMins} mins
                  </p>
                </div>
              </div>
            </div>

            {/* Post-Procurement Anonymous Feedback Card */}
            {currentBooking?.stage === "COMPLETED" && (
              <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4 font-sans">
                <div className="flex items-center gap-2 text-[#1B4318] border-b border-gray-100 pb-3">
                  <MessageSquare className="w-5 h-5 text-[#2E7D32]" />
                  <h3 className="text-base font-extrabold">
                    {t("howWasExperience")}
                  </h3>
                </div>

                {feedbackSubmitted ? (
                  <div className="p-4 bg-[#E8F5E9] rounded-2xl border border-[#A5D6A7] text-xs text-[#1B4318] font-bold text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-[#2E7D32] mx-auto" />
                    <p>{t("feedbackSubmittedSuccess")}</p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFeedbackSubmit}
                    className="space-y-4 text-xs"
                  >
                    {/* Star Rating */}
                    <div className="space-y-1.5">
                      <label className="text-gray-600 font-bold block">
                        Rating:
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating
                                  ? "text-[#F9A825] fill-[#F9A825]"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-gray-700 ml-2">
                          {rating === 1 && t("ratingVeryPoor")}
                          {rating === 2 && t("ratingPoor")}
                          {rating === 3 && t("ratingAverage")}
                          {rating === 4 && t("ratingGood")}
                          {rating === 5 && t("ratingExcellent")}
                        </span>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">
                        Stage / Issue Category:
                      </label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 bg-white font-bold text-xs"
                      >
                        <option value="WEIGHING DELAY">WEIGHING DELAY</option>
                        <option value="MOISTURE TESTING">
                          MOISTURE TESTING
                        </option>
                        <option value="UNLOADING">UNLOADING</option>
                        <option value="STAFF BEHAVIOR">STAFF BEHAVIOR</option>
                        <option value="GENERAL">GENERAL EXPERIENCE</option>
                      </select>
                    </div>

                    {/* Feedback Text */}
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">
                        {t("whatCouldBeImproved")}
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Write your feedback..."
                        className="w-full p-3 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#2E7D32]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t("submitFeedbackBtn")}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] text-center space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Digital QR Gate Pass
              </h3>
              <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-gray-200 inline-block mx-auto">
                <QrCode className="w-32 h-32 text-[#1B4318] mx-auto" />
                <p className="text-[10px] font-mono text-gray-500 mt-2 font-bold">
                  {currentBooking?.tokenDisplay}
                </p>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                Present this QR code or Token ID at Mandi Gate scanner upon
                physical arrival
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANDI GATE ARRIVAL CHECK-IN */}
      {activeTab === "gate" && (
        <div className="bg-white rounded-3xl p-8 shadow-md border border-[#E0ECE0] max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-gray-900">
              Mandi Gate Arrival Check-in
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Confirm your physical arrival at Karnal Mandi Gate for Token #
              {currentBooking?.tokenDisplay}
            </p>
          </div>

          {/* Gate Token Status */}
          <div className="p-6 bg-[#FAF8F2] rounded-3xl border border-[#A5D6A7] space-y-3 max-w-sm mx-auto font-sans">
            <div className="text-xs font-bold text-[#1B4318] uppercase">
              ARRIVAL GATE SCANNER
            </div>
            <div className="text-3xl font-black text-[#1B4318]">
              {currentBooking?.tokenDisplay || "P-147"}
            </div>
            <div className="text-xs text-gray-600 font-semibold">
              {currentBooking?.farmerName} • {currentBooking?.crop} (
              {currentBooking?.quantity} Qtl)
            </div>
          </div>

          {currentBooking?.stage !== "BOOKED" ? (
            <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-xs text-green-900 space-y-1">
              <div className="flex items-center justify-center gap-2 font-bold text-sm text-[#2E7D32]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Gate Check-in Confirmed ✓</span>
              </div>
              <p className="text-[11px] text-gray-700">
                Arrival recorded. Your Token #{currentBooking?.tokenDisplay}{" "}
                stage is <strong>{currentBooking?.stage}</strong>. Staff has
                been notified.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                onClick={handleIveArrived}
                className="flex-1 py-3.5 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t("iveArrivedBtn")}</span>
              </button>
              <button
                onClick={() => setCameraModalOpen(true)}
                className="flex-1 py-3.5 bg-white border border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Verify Photo Identity</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 7-STAGE WORKFLOW */}
      {activeTab === "workflow" && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                7-Stage Procurement Workflow Tracking
              </h3>
              <p className="text-xs text-gray-500">
                Token #{currentBooking?.tokenDisplay} • Cryptographically
                Audited
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black">
              Status: {currentBooking?.stage || "BOOKED"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const currentIdx = WORKFLOW_STAGES.findIndex(
                (s) => s.key === currentBooking?.stage,
              );
              const isPassed = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={stage.key}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? "bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs"
                      : isPassed
                        ? "bg-[#FAF8F2] border-green-200"
                        : "bg-white border-gray-200 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Stage 0{idx + 1}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping" />
                    ) : null}
                  </div>
                  <h4
                    className={`text-xs font-bold ${isCurrent ? "text-[#1B4318]" : "text-gray-900"}`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CROPS PORTFOLIO */}
      {activeTab === "crops" && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Your Registered Multi-Crop Portfolio
              </h3>
              <p className="text-xs text-gray-500">
                Only registered crops can be selected during slot reservation
              </p>
            </div>
            <button
              onClick={() => setIsAddingCrop(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B4318] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Crop</span>
            </button>
          </div>

          <AnimatePresence>
            {isAddingCrop && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddCropSubmit}
                className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#C8E6C9] space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Crop Variety
                    </label>
                    <select
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white"
                    >
                      <option value="Paddy (Basmati 1121)">
                        Paddy (Basmati 1121)
                      </option>
                      <option value="Wheat (Sharbati HD-2967)">
                        Wheat (Sharbati HD-2967)
                      </option>
                      <option value="Mustard (Pusa 30)">
                        Mustard (Pusa 30)
                      </option>
                      <option value="Soya (JS-335)">Soya (JS-335)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Area (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 4.0"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Expected Yield (Qtl)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 80"
                      value={newYield}
                      onChange={(e) => setNewYield(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCrop(false)}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold cursor-pointer"
                  >
                    Save to Portfolio
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crops.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E0ECE0] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    {c.name}
                  </span>
                  <button
                    onClick={() => deleteCrop(c.id)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-gray-600">
                  <p>
                    Acreage: <strong>{c.areaAcres} Acres</strong>
                  </p>
                  <p>
                    Yield:{" "}
                    <strong className="text-[#2E7D32]">
                      {c.expectedYieldQuintals} Qtl
                    </strong>
                  </p>
                  <p>
                    MSP Rate: <strong>₹{c.mspPerQtl}/Qtl</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DBT PAYMENT STATUS */}
      {activeTab === "payment" && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Direct Benefit Transfer (DBT) MSP Disbursement
            </h3>
            <p className="text-xs text-gray-500">
              Government MSP payments directly credited to Aadhaar-linked bank
              account
            </p>
          </div>

          <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Crop & Weight
              </span>
              <p className="text-base font-bold text-gray-900">
                {currentBooking?.crop} (
                {currentBooking?.weighedQuantity || currentBooking?.quantity}{" "}
                Qtl)
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Applicable MSP Rate
              </span>
              <p className="text-base font-bold text-[#2E7D32]">
                ₹{currentBooking?.paymentDetails?.mspPerQtl || 2320} / Quintal
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Total Payable Amount
              </span>
              <p className="text-2xl font-black text-[#1B4318]">
                ₹
                {(
                  currentBooking?.paymentDetails?.grossAmount || 58417
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 block">
                DBT Transaction Reference
              </span>
              <span className="font-mono font-bold text-gray-900">
                {currentBooking?.paymentDetails?.dbtTxnId ||
                  "DBT-SBI-2026-98124"}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
              {currentBooking?.paymentDetails?.disbursed
                ? "DISBURSED"
                : "AUTHORIZED BY OFFICER"}
            </span>
          </div>
        </div>
      )}

      {/* Digital Procurement Receipt Modal */}
      <DigitalReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        booking={currentBooking}
      />

      {/* Identity Camera Verification Modal */}
      <IdentityCameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onConfirm={handleCameraPhotoConfirmed}
      />
    </div>
  );
}
