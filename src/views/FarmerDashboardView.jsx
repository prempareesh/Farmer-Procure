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
  Edit2,
} from "lucide-react";
import { useApp, WORKFLOW_STAGES } from "../context/AppContext";
import DigitalReceiptModal from "../components/DigitalReceiptModal";
import IdentityCameraModal from "../components/IdentityCameraModal";
import EditProfileModal from "../components/EditProfileModal";

export default function FarmerDashboardView() {
  const {
    farmerProfile,
    crops,
    addCrop,
    deleteCrop,
    bookings,
    activeBooking,
    identityVerifications,
    servingToken,
    peopleAhead,
    estimatedWaitMins,
    advanceBookingStage,
    submitAnonymousFeedback,
    navigateTo,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState("queue"); // 'queue' | 'gate' | 'workflow' | 'crops' | 'payment' | 'profile'

  // Modals state
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

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

  const handleCameraPhotoConfirmed = async (_photoUrl) => {
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
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 selection:bg-[#164A29] selection:text-[#79C267]">
      {/* Top Header & Navigation */}
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
              {t("farmerPortal")}
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px] font-mono border border-[#79C267]/30">
              {farmerProfile.farmerId}
            </span>
          </div>
          <p className="text-xs text-[#A6ADA3] font-mono mt-1">
            {t("welcomeBack")}, {farmerProfile.name} • {farmerProfile.village},{" "}
            {farmerProfile.district} ({farmerProfile.state})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentBooking?.stage === "COMPLETED" && (
            <button
              onClick={() => setReceiptModalOpen(true)}
              className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#79C267]" />
              <span>{t("viewReceiptBtn")}</span>
            </button>
          )}

          <button
            onClick={() => setEditProfileOpen(true)}
            className="px-4 py-2.5 rounded-sm bg-[#071008] hover:bg-[#0A120C] border border-[#1A2E1E] text-[#E8E7DE] text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-[#79C267]" />
            <span>{t("editProfile")}</span>
          </button>

          <button
            onClick={() => navigateTo("book-slot")}
            className="px-4 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#79C267]" />
            <span>{t("bookSlot")}</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Strip */}
      <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("permanentFarmerId")}
            </span>
            <span className="text-sm font-mono text-[#F2F0E8] font-bold">
              {farmerProfile.farmerId}
            </span>
            <p className="text-[11px] text-[#A6ADA3] font-mono">{farmerProfile.aadhaar}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("registeredCrops")}
            </span>
            <span className="text-sm font-serif text-[#F2F0E8]">
              {crops.length} MSP Eligible Crops
            </span>
            <p className="text-[11px] text-[#A6ADA3]">
              Total ~{crops.reduce((acc, c) => acc + Number(c.areaAcres || 0), 0)} Acres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("authenticationStatus")}
            </span>
            <span className="text-sm font-mono text-[#79C267]">
              OTP + JWT Active
            </span>
            <p className="text-[11px] text-[#A6ADA3]">100% Session Secured</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block">
              {t("dbtLinkedAccount")}
            </span>
            <span className="text-xs font-mono text-[#F2F0E8] truncate block max-w-40">
              {farmerProfile.bankAccount}
            </span>
            <p className="text-[10px] font-mono text-[#A6ADA3]">
              {farmerProfile.ifsc}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[#071008] p-1 rounded border border-[#1A2E1E] w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "queue"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#79C267]" />
          <span>{t("liveQueueTokens")}</span>
        </button>
        <button
          onClick={() => setActiveTab("gate")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "gate"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#79C267]" />
          <span>{t("mandiGateArrival")}</span>
        </button>
        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "workflow"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#79C267]" />
          <span>{t("workflow7Stage")}</span>
        </button>
        <button
          onClick={() => setActiveTab("crops")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "crops"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <Sprout className="w-3.5 h-3.5 text-[#79C267]" />
          <span>{t("myCropsPortfolio")}</span>
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "payment"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#79C267]" />
          <span>DBT Payment Status</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
              : "text-[#A6ADA3] hover:text-[#F2F0E8]"
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#79C267]" />
          <span>{t("myProfile")}</span>
        </button>
      </div>

      {/* TAB 1: LIVE QUEUE & TOKEN SYSTEM */}
      {activeTab === "queue" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Live Journey Progress Banner */}
            <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-5">
              <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
                <div>
                  <h3 className="text-lg font-serif text-[#F2F0E8]">
                    Today's Active Token Details
                  </h3>
                  <p className="text-xs font-mono text-[#A6ADA3]">
                    Mandi: {currentBooking?.centreName}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-sm bg-[#164A29] text-[#79C267] font-mono text-xs border border-[#79C267]/30">
                  {currentBooking?.stage}
                </span>
              </div>

              {/* Identity Verification Status Banner */}
              {(() => {
                const activeVerification = identityVerifications.find(
                  (v) =>
                    v.bookingId === currentBooking?.id ||
                    v.bookingId === currentBooking?.booking_id ||
                    v.booking_id === currentBooking?.id ||
                    v.booking_id === currentBooking?.booking_id,
                );
                if (activeVerification?.verificationStatus === "VERIFIED") {
                  return (
                    <div className="p-3.5 bg-[#12351F]/80 rounded-sm border border-[#79C267]/40 text-xs text-[#79C267] font-mono flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                        <span>Identity Verification Status</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px] font-mono border border-[#79C267]/40">
                        Identity Verified ✓
                      </span>
                    </div>
                  );
                } else if (
                  activeVerification?.verificationStatus === "REVIEW_REQUIRED"
                ) {
                  return (
                    <div className="p-3.5 bg-amber-950/40 rounded-sm border border-amber-800/50 text-xs text-amber-300 font-mono flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Identity Verification Status</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-amber-900/60 text-amber-300 text-[10px] font-mono border border-amber-700/50">
                        Staff Review Required
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div className="p-3.5 bg-[#050805] rounded-sm border border-[#1A2E1E] text-xs text-[#A6ADA3] font-mono flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                        <span>Identity Verification Status</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-[#164A29]/60 text-[#79C267] text-[10px] font-mono border border-[#79C267]/30">
                        Photo Captured ✓ (Pending Arrival Verification)
                      </span>
                    </div>
                  );
                }
              })()}

              {/* Action Banner for GATE ARRIVAL */}
              {currentBooking?.stage === "BOOKED" && (
                <div className="bg-[#050805] p-5 rounded-sm border border-[#1A2E1E] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-[#F2F0E8] uppercase block">
                      Have you arrived at Karnal Mandi Gate?
                    </span>
                    <span className="text-xs text-[#A6ADA3]">
                      Click below to update your status live for Mandi Staff.
                    </span>
                  </div>
                  <button
                    onClick={handleIveArrived}
                    className="px-5 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 shrink-0 transition-colors cursor-pointer"
                  >
                    {t("iveArrivedBtn")}
                  </button>
                </div>
              )}

              {currentBooking?.stage === "ARRIVED" && (
                <div className="bg-[#050805] p-4 rounded-sm border border-[#1A2E1E] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[#79C267] block">
                      {t("arrivalVerifiedMsg")}
                    </span>
                    <span className="text-[#A6ADA3] text-[11px]">{t("staffNotified")}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#164A29] text-[#79C267] font-mono text-[10px]">
                    Quality Check Pending
                  </span>
                </div>
              )}

              {currentBooking?.stage === "COMPLETED" && (
                <div className="bg-[#12351F]/60 p-5 rounded-sm border border-[#79C267]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-[#79C267] block">
                      {t("transactionCompletedBadge")}
                    </span>
                    <span className="text-xs text-[#A6ADA3]">
                      Your official digital procurement receipt is ready to
                      download or print.
                    </span>
                  </div>
                  <button
                    onClick={() => setReceiptModalOpen(true)}
                    className="px-5 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/40 flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#79C267]" />
                    <span>{t("viewReceiptBtn")}</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
                  <span className="text-[10px] font-mono text-[#A6ADA3] uppercase">
                    Now Serving at Gate
                  </span>
                  <p className="text-3xl font-serif text-[#79C267] mt-1">
                    K00{servingToken}
                  </p>
                  <span className="text-[10px] font-mono text-[#A6ADA3]">
                    Daily Queue (Started 9:00 AM)
                  </span>
                </div>

                <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
                  <span className="text-[10px] font-mono text-[#79C267] uppercase">
                    Your Assigned Token
                  </span>
                  <p className="text-3xl font-serif text-[#F2F0E8] mt-1">
                    {currentBooking?.tokenDisplay || "P-147"}
                  </p>
                  <span className="text-[10px] font-mono text-[#79C267]">
                    {currentBooking?.crop}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
                  <span className="text-[#A6ADA3] font-mono">
                    Vehicles Ahead:
                  </span>
                  <p className="text-2xl font-serif text-amber-400 mt-1">
                    {peopleAhead} in lane
                  </p>
                </div>
                <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
                  <span className="text-[#A6ADA3] font-mono">
                    Estimated Waiting Time:
                  </span>
                  <p className="text-2xl font-serif text-[#F2F0E8] mt-1">
                    ~{estimatedWaitMins} mins
                  </p>
                </div>
              </div>
            </div>

            {/* Post-Procurement Anonymous Feedback Card */}
            {currentBooking?.stage === "COMPLETED" && (
              <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-4 font-sans">
                <div className="flex items-center gap-2 text-[#F2F0E8] border-b border-[#1A2E1E] pb-3">
                  <MessageSquare className="w-5 h-5 text-[#79C267]" />
                  <h3 className="text-base font-serif">
                    {t("howWasExperience")}
                  </h3>
                </div>

                {feedbackSubmitted ? (
                  <div className="p-4 bg-[#12351F]/60 rounded-sm border border-[#79C267]/30 text-xs text-[#79C267] font-mono text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-[#79C267] mx-auto" />
                    <p>{t("feedbackSubmittedSuccess")}</p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFeedbackSubmit}
                    className="space-y-4 text-xs"
                  >
                    {/* Star Rating */}
                    <div className="space-y-1.5">
                      <label className="text-[#A6ADA3] font-mono uppercase tracking-wider text-[11px] block">
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
                              className={`w-5 h-5 ${
                                star <= rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-[#1A2E1E]"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono text-[#F2F0E8] ml-2">
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
                      <label className="text-[#A6ADA3] font-mono uppercase tracking-wider text-[11px] block">
                        Stage / Issue Category:
                      </label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        className="w-full p-2.5 rounded-sm border border-[#1A2E1E] bg-[#050805] text-[#F2F0E8] font-mono text-xs focus:border-[#79C267]"
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
                      <label className="text-[#A6ADA3] font-mono uppercase tracking-wider text-[11px] block">
                        {t("whatCouldBeImproved")}
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Write your feedback..."
                        className="w-full p-3 rounded-sm border border-[#1A2E1E] bg-[#050805] text-[#F2F0E8] text-xs font-sans focus:border-[#79C267]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#79C267]" />
                      <span>{t("submitFeedbackBtn")}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] text-center space-y-4">
              <h3 className="text-sm font-mono text-[#A6ADA3] uppercase tracking-wider">
                Digital QR Gate Pass
              </h3>
              <div className="p-5 bg-[#050805] rounded border border-[#1A2E1E] inline-block mx-auto">
                <QrCode className="w-32 h-32 text-[#79C267] mx-auto" />
                <p className="text-[11px] font-mono text-[#F2F0E8] mt-3 font-bold">
                  {currentBooking?.tokenDisplay}
                </p>
              </div>
              <p className="text-xs text-[#A6ADA3] font-sans max-w-xs mx-auto">
                Present this QR code or Token ID at Mandi Gate scanner upon
                physical arrival
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANDI GATE ARRIVAL CHECK-IN */}
      {activeTab === "gate" && (
        <div className="bg-[#071008] rounded-md p-8 border border-[#1A2E1E] max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-serif text-[#F2F0E8]">
              Mandi Gate Arrival Check-in
            </h3>
            <p className="text-xs text-[#A6ADA3] font-mono mt-1">
              Confirm your physical arrival at Karnal Mandi Gate for Token #
              {currentBooking?.tokenDisplay}
            </p>
          </div>

          {/* Gate Token Status */}
          <div className="p-6 bg-[#050805] rounded-md border border-[#1A2E1E] space-y-3 max-w-sm mx-auto font-mono">
            <div className="text-[11px] text-[#79C267] uppercase tracking-wider">
              ARRIVAL GATE SCANNER
            </div>
            <div className="text-4xl font-serif text-[#F2F0E8]">
              {currentBooking?.tokenDisplay || "P-147"}
            </div>
            <div className="text-xs text-[#A6ADA3]">
              {currentBooking?.farmerName} • {currentBooking?.crop} (
              {currentBooking?.quantity} Qtl)
            </div>
          </div>

          {currentBooking?.stage !== "BOOKED" ? (
            <div className="p-4 bg-[#12351F]/60 rounded-sm border border-[#79C267]/30 text-xs text-[#79C267] space-y-1">
              <div className="flex items-center justify-center gap-2 font-mono text-sm text-[#79C267]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Gate Check-in Confirmed ✓</span>
              </div>
              <p className="text-[11px] text-[#A6ADA3]">
                Arrival recorded. Your Token #{currentBooking?.tokenDisplay}{" "}
                stage is <strong className="text-[#F2F0E8]">{currentBooking?.stage}</strong>. Staff has
                been notified.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <button
                onClick={handleIveArrived}
                className="flex-1 py-3 bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider rounded-sm border border-[#79C267]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                <span>{t("iveArrivedBtn")}</span>
              </button>
              <button
                onClick={() => setCameraModalOpen(true)}
                className="flex-1 py-3 bg-[#050805] hover:bg-[#0A120C] border border-[#1A2E1E] text-[#E8E7DE] font-mono text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#79C267]" />
                <span>Verify Photo Identity</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 7-STAGE WORKFLOW */}
      {activeTab === "workflow" && (
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
            <div>
              <h3 className="text-lg font-serif text-[#F2F0E8]">
                7-Stage Procurement Workflow Tracking
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs font-mono text-[#A6ADA3]">
                  Token #{currentBooking?.tokenDisplay}
                </p>
                <span className="text-[#1A2E1E]">•</span>
                <button
                  type="button"
                  onClick={() => setAuditInfoOpen(true)}
                  className="text-xs text-[#79C267] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cryptographically Tracked ⓘ</span>
                </button>
              </div>
            </div>
            <span className="px-3 py-1 rounded-sm bg-[#164A29] text-[#79C267] text-xs font-mono border border-[#79C267]/30">
              Status: {currentBooking?.stage || "BOOKED"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const currentIdx = WORKFLOW_STAGES.findIndex(
                (s) => s.key === currentBooking?.stage,
              );
              const isPassed = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={stage.key}
                  className={`p-5 rounded-sm border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? "bg-[#164A29]/30 border-[#79C267]"
                      : isPassed
                        ? "bg-[#050805] border-[#1A2E1E]"
                        : "bg-[#050805]/40 border-[#1A2E1E]/40 opacity-40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#A6ADA3] uppercase">
                      Stage 0{idx + 1}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[#79C267] animate-ping" />
                    ) : null}
                  </div>
                  <h4
                    className={`text-sm font-serif ${isCurrent ? "text-[#79C267]" : "text-[#F2F0E8]"}`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-[#A6ADA3] mt-1 leading-snug">
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
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-4">
            <div>
              <h3 className="text-lg font-serif text-[#F2F0E8]">
                Your Registered Multi-Crop Portfolio
              </h3>
              <p className="text-xs font-mono text-[#A6ADA3]">
                Only registered crops can be selected during slot reservation
              </p>
            </div>
            <button
              onClick={() => setIsAddingCrop(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#164A29] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 hover:bg-[#12351F] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#79C267]" />
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
                className="bg-[#050805] p-5 rounded-sm border border-[#1A2E1E] space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A6ADA3] uppercase mb-1">
                      Crop Variety
                    </label>
                    <select
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#071008] text-[#F2F0E8]"
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
                    <label className="block text-[10px] font-mono text-[#A6ADA3] uppercase mb-1">
                      Area (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 4.0"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#071008] text-[#F2F0E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A6ADA3] uppercase mb-1">
                      Expected Yield (Qtl)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 80"
                      value={newYield}
                      onChange={(e) => setNewYield(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#071008] text-[#F2F0E8]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingCrop(false)}
                    className="px-4 py-1.5 rounded-sm border border-[#1A2E1E] text-xs font-mono text-[#A6ADA3] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-sm bg-[#164A29] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 cursor-pointer"
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
                className="p-5 rounded-sm bg-[#050805] border border-[#1A2E1E] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-serif text-[#F2F0E8]">
                    {c.name}
                  </span>
                  <button
                    onClick={() => deleteCrop(c.id)}
                    className="text-[#A6ADA3] hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-mono text-[#A6ADA3] space-y-1">
                  <p>
                    Acreage: <strong className="text-[#F2F0E8]">{c.areaAcres} Acres</strong>
                  </p>
                  <p>
                    Yield:{" "}
                    <strong className="text-[#79C267]">
                      {c.expectedYieldQuintals} Qtl
                    </strong>
                  </p>
                  <p>
                    MSP Rate: <strong className="text-[#F2F0E8]">₹{c.mspPerQtl}/Qtl</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DBT PAYMENT STATUS */}
      {activeTab === "payment" && (
        <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6">
          <div>
            <h3 className="text-lg font-serif text-[#F2F0E8]">
              Direct Benefit Transfer (DBT) MSP Disbursement
            </h3>
            <p className="text-xs font-mono text-[#A6ADA3]">
              Government MSP payments directly credited to Aadhaar-linked bank
              account
            </p>
          </div>

          <div className="bg-[#050805] p-6 rounded-sm border border-[#1A2E1E] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase">
                Crop & Weight
              </span>
              <p className="text-base font-serif text-[#F2F0E8] mt-1">
                {currentBooking?.crop} (
                {currentBooking?.weighedQuantity || currentBooking?.quantity}{" "}
                Qtl)
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase">
                Applicable MSP Rate
              </span>
              <p className="text-base font-serif text-[#79C267] mt-1">
                ₹{currentBooking?.paymentDetails?.mspPerQtl || 2320} / Quintal
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase">
                Total Payable Amount
              </span>
              <p className="text-2xl font-serif text-[#79C267] mt-1">
                ₹
                {(
                  currentBooking?.paymentDetails?.grossAmount || 58417
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#A6ADA3] block">
                DBT Transaction Reference
              </span>
              <span className="text-[#F2F0E8] font-bold">
                {currentBooking?.paymentDetails?.dbtTxnId ||
                  "DBT-SBI-2026-98124"}
              </span>
            </div>
            <span className="px-3 py-1 rounded bg-[#164A29] text-[#79C267] text-xs border border-[#79C267]/30">
              {currentBooking?.paymentDetails?.disbursed
                ? "DISBURSED"
                : "AUTHORIZED BY OFFICER"}
            </span>
          </div>
        </div>
      )}

      {/* TAB 6: FARMER PROFILE VIEW & EDIT */}
      {activeTab === "profile" && (
        <div className="bg-[#071008] rounded-md p-6 sm:p-8 border border-[#1A2E1E] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2E1E] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-serif text-[#F2F0E8]">
                    {farmerProfile.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px] font-mono border border-[#79C267]/30">
                    VERIFIED KISAN
                  </span>
                </div>
                <p className="text-xs font-mono text-[#A6ADA3] mt-1">
                  Farmer ID:{" "}
                  <span className="text-[#79C267]">
                    {farmerProfile.farmerId}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-5 py-2.5 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 flex items-center gap-2 transition-all cursor-pointer w-fit"
            >
              <Edit2 className="w-4 h-4 text-[#79C267]" />
              <span>{t("editProfile")}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase tracking-wider block">
                {t("readOnlyFarmerId")}
              </span>
              <span className="text-sm font-mono text-[#79C267] block mt-1">
                {farmerProfile.farmerId}
              </span>
              <span className="text-[10px] text-[#A6ADA3] block mt-1">
                Permanent Identifier (Read Only)
              </span>
            </div>

            <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase tracking-wider block">
                {t("fullName")}
              </span>
              <span className="text-sm font-serif text-[#F2F0E8] block mt-1">
                {farmerProfile.name}
              </span>
              <span className="text-[10px] text-[#A6ADA3] block mt-1">
                Canonical Profile Name
              </span>
            </div>

            <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase tracking-wider block">
                {t("mobile10")}
              </span>
              <span className="text-sm font-mono text-[#F2F0E8] block mt-1">
                +91 {farmerProfile.mobile}
              </span>
              <span className="text-[10px] text-[#A6ADA3] block mt-1">
                Primary Auth & OTP Mobile
              </span>
            </div>

            <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E]">
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase tracking-wider block">
                {t("emailLabel")}
              </span>
              <span className="text-sm font-mono text-[#F2F0E8] block mt-1 truncate">
                {farmerProfile.email || "rameshwar.singh@email.com"}
              </span>
              <span className="text-[10px] text-[#A6ADA3] block mt-1">
                Official Contact Email
              </span>
            </div>

            <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E] md:col-span-2">
              <span className="text-[10px] font-mono text-[#A6ADA3] uppercase tracking-wider block">
                {t("addressLabel")}
              </span>
              <span className="text-sm font-serif text-[#F2F0E8] block mt-1">
                {farmerProfile.address ||
                  `${farmerProfile.village}, ${farmerProfile.district}, ${farmerProfile.state}`}
              </span>
              <span className="text-[10px] text-[#A6ADA3] block mt-1">
                Registered Farmland Address
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A2E1E] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#A6ADA3] font-mono">
              <Sprout className="w-4 h-4 text-[#79C267]" />
              <span>{crops.length} MSP Eligible Crops Registered</span>
            </div>
            <button
              onClick={() => setEditProfileOpen(true)}
              className="text-xs font-mono text-[#79C267] hover:underline cursor-pointer"
            >
              Update Profile Information →
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

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

      {/* Informational Audit Trail Modal for Farmers */}
      {auditInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="bg-[#071008] rounded-md p-6 sm:p-8 max-w-md w-full border border-[#1A2E1E] space-y-5 font-sans text-left">
            <div className="flex items-center gap-3 border-b border-[#1A2E1E] pb-4">
              <div className="w-10 h-10 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif text-[#F2F0E8]">
                  Tamper-Evident Audit Trail
                </h3>
                <p className="text-xs text-[#79C267] font-mono">
                  Informational Integrity Overview
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A6ADA3] font-sans leading-relaxed">
              Your procurement milestones (Booking, Mandi Arrival, Quality
              Check, Digital Weighing, MSP Procurement, and DBT Payment) are
              recorded in a tamper-evident audit trail using SHA-256
              cryptographic hashes.
            </p>

            <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E] text-[11px] font-mono text-[#A6ADA3] space-y-1">
              <div className="text-[#F2F0E8]">Hash Seal Status:</div>
              <div className="text-[#79C267] font-bold">VALID & VERIFIED ✓</div>
              <div className="text-[#A6ADA3]/60 break-all text-[9px]">
                0x3c9e1d7b0e885e4f2c118f2a4b127f8a9b2c3d4e5f6a
              </div>
            </div>

            <p className="text-[11px] text-[#A6ADA3] italic">
              Detailed audit log records are accessible exclusively to
              authorized Mandi Command Officers and System Auditors.
            </p>

            <button
              onClick={() => setAuditInfoOpen(false)}
              className="w-full py-3 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider border border-[#79C267]/30 cursor-pointer transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

