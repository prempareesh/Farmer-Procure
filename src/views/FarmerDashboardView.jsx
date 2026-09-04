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
    servingToken,
    calculateQueueMetrics,
    isOffline,
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

  // Farmer specific booking state resolution
  const farmerProfileId = farmerProfile?.farmerId;
  const farmerMobile = farmerProfile?.mobile;

  const farmerBookings = (bookings || []).filter((b) => {
    return (
      b.farmerId === farmerProfileId ||
      b.farmerMobile === farmerMobile ||
      (b.profiles &&
        (b.profiles.farmer_id === farmerProfileId ||
          b.profiles.mobile === farmerMobile))
    );
  });

  const activeBookingForFarmer = farmerBookings.find(
    (b) => b.stage !== "COMPLETED" && b.status !== "COMPLETED",
  );
  const completedBookingForFarmer = farmerBookings.find(
    (b) => b.stage === "COMPLETED" || b.status === "COMPLETED",
  );

  const hasActiveBooking = Boolean(activeBookingForFarmer);
  const isCompleted = Boolean(!hasActiveBooking && completedBookingForFarmer);
  const currentBooking = activeBookingForFarmer || completedBookingForFarmer || null;

  const queueMetrics = calculateQueueMetrics
    ? calculateQueueMetrics(activeBookingForFarmer)
    : { position: 1, farmersAhead: 0, waitMins: 10 };

  const farmersAheadCount = queueMetrics.farmersAhead;
  const positionNum = queueMetrics.position;
  const waitMins = queueMetrics.waitMins;

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
            onClick={() => setEditProfileOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-extrabold shadow-2xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-[#2E7D32]" />
            <span>{t("editProfile")}</span>
          </button>

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
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#2E7D32] text-white shadow-xs"
              : "text-gray-700 hover:text-[#2E7D32]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{t("myProfile")}</span>
        </button>
      </div>

      {/* TAB 1: LIVE QUEUE & TOKEN SYSTEM */}
      {activeTab === "queue" && (
        <div className="space-y-6">
          {/* STATE A: NO ACTIVE BOOKING */}
          {!hasActiveBooking && !isCompleted && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-md border border-[#E0ECE0] text-center space-y-4 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-gray-900">
                    Today's Procurement
                  </h2>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-200">
                    No active booking
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                  You haven't booked a procurement slot yet. Book a slot to
                  receive your token, queue position, estimated waiting time, and
                  digital gate pass.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo("book-slot")}
                    className="px-6 py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-black shadow-md flex items-center gap-2 mx-auto cursor-pointer transition-all active:scale-95"
                  >
                    <Calendar className="w-4 h-4 text-[#F9A825]" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-md border border-[#E0ECE0] text-center space-y-4 my-auto">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Digital Gate Pass
                </h3>
                <div className="px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-[11px] font-bold border border-amber-200 inline-block">
                  Available after booking
                </div>
                <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto">
                  Book a procurement slot to generate your digital gate pass.
                </p>
                <button
                  onClick={() => navigateTo("book-slot")}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Book Slot
                </button>
              </div>
            </div>
          )}

          {/* STATE C: COMPLETED BOOKING */}
          {isCompleted && completedBookingForFarmer && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-md border border-[#E0ECE0] text-center space-y-4 max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-gray-900">
                    Procurement Cycle Completed
                  </h2>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black border border-[#A5D6A7]">
                    Booking: {completedBookingForFarmer.booking_id || completedBookingForFarmer.id} • Token: {completedBookingForFarmer.tokenDisplay}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                  Your procurement cycle at {completedBookingForFarmer.centreName || "Karnal Central Grain Mandi"} is completed with SHA-256 cryptographic seal.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setReceiptModalOpen(true)}
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

              {/* Feedback Form for Completed Transaction */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4 max-w-2xl mx-auto font-sans">
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
            </div>
          )}

          {/* STATE B: ACTIVE BOOKING QUEUE */}
          {hasActiveBooking && activeBookingForFarmer && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-gray-900">
                        {activeBookingForFarmer.centreName || "Karnal Central Grain Mandi"}
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">
                        Slot: {activeBookingForFarmer.slot_date || "Today"} ({activeBookingForFarmer.slot_time || "02:00 PM – 02:30 PM"})
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-xs border border-[#A5D6A7]">
                      {activeBookingForFarmer.stage}
                    </span>
                  </div>

                  {/* Stage Action Banner */}
                  {activeBookingForFarmer.stage === "BOOKED" && (
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-amber-900 block">
                          Have you arrived at Mandi Gate?
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

                  {activeBookingForFarmer.stage === "ARRIVED" && (
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

                  {/* 4 Telemetry Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white rounded-2xl p-4 border border-[#A5D6A7] ring-2 ring-[#2E7D32]/15">
                      <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider block">
                        YOUR TOKEN
                      </span>
                      <p className="text-3xl font-black text-[#1B4318] mt-1">
                        {activeBookingForFarmer.tokenDisplay}
                      </p>
                      <span className="text-[10px] text-[#2E7D32] font-bold block mt-1">
                        {activeBookingForFarmer.crop} ({activeBookingForFarmer.quantity} Qtl)
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        YOUR POSITION
                      </span>
                      <p className="text-3xl font-black text-gray-900 mt-1">
                        #{positionNum}
                      </p>
                      <span className="text-[10px] text-gray-500 font-medium block mt-1">
                        Place in live mandi queue
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        FARMERS AHEAD
                      </span>
                      <p className="text-3xl font-black text-amber-600 mt-1">
                        {farmersAheadCount}
                      </p>
                      <span className="text-[10px] text-gray-500 font-medium block mt-1">
                        {farmersAheadCount} farmers ahead of you
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        EXPECTED WAIT
                      </span>
                      <p className="text-3xl font-black text-gray-900 mt-1">
                        ~{waitMins} <span className="text-xs font-normal text-gray-500">min</span>
                      </p>
                      <span className="text-[10px] text-[#2E7D32] font-semibold block mt-1">
                        Estimated turn time
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] text-center space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    Digital QR Gate Pass
                  </h3>
                  <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-gray-200 inline-block mx-auto">
                    <QrCode className="w-32 h-32 text-[#1B4318] mx-auto" />
                    <p className="text-[10px] font-mono text-gray-500 mt-2 font-bold">
                      {activeBookingForFarmer.tokenDisplay}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    Present this QR code or Token ID at Mandi Gate scanner upon physical arrival
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANDI GATE ARRIVAL CHECK-IN */}
      {activeTab === "gate" && (
        <div className="bg-white rounded-3xl p-8 shadow-md border border-[#E0ECE0] max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          {!hasActiveBooking ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Mandi Gate Arrival Check-in
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  No active booking found. Please book a procurement slot before check-in at Mandi Gate.
                </p>
              </div>
              <button
                onClick={() => navigateTo("book-slot")}
                className="px-6 py-3 bg-[#1B4318] hover:bg-[#2E7D32] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Book Procurement Slot
              </button>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Mandi Gate Arrival Check-in
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Confirm your physical arrival at {activeBookingForFarmer.centreName || "Karnal Mandi Gate"} for Token #
                  {activeBookingForFarmer.tokenDisplay}
                </p>
              </div>

              {/* Gate Token Status */}
              <div className="p-6 bg-[#FAF8F2] rounded-3xl border border-[#A5D6A7] space-y-3 max-w-sm mx-auto font-sans">
                <div className="text-xs font-bold text-[#1B4318] uppercase">
                  ARRIVAL GATE SCANNER
                </div>
                <div className="text-3xl font-black text-[#1B4318]">
                  {activeBookingForFarmer.tokenDisplay}
                </div>
                <div className="text-xs text-gray-600 font-semibold">
                  {activeBookingForFarmer.farmerName || farmerProfile.name} • {activeBookingForFarmer.crop} (
                  {activeBookingForFarmer.quantity} Qtl)
                </div>
              </div>

              {activeBookingForFarmer.stage !== "BOOKED" ? (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-xs text-green-900 space-y-1">
                  <div className="flex items-center justify-center gap-2 font-bold text-sm text-[#2E7D32]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Gate Check-in Confirmed ✓</span>
                  </div>
                  <p className="text-[11px] text-gray-700">
                    Arrival recorded. Your Token #{activeBookingForFarmer.tokenDisplay}{" "}
                    stage is <strong>{activeBookingForFarmer.stage}</strong>. Staff has been notified.
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
            </>
          )}
        </div>
      )}

      {/* TAB 3: 7-STAGE WORKFLOW */}
      {activeTab === "workflow" && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          {!hasActiveBooking && !isCompleted ? (
            <div className="text-center py-8 space-y-4">
              <Sparkles className="w-10 h-10 text-[#2E7D32] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-gray-900">
                7-Stage Procurement Workflow Tracking
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                No active booking found. Book a procurement slot to track your 7-stage workflow live.
              </p>
              <button
                onClick={() => navigateTo("book-slot")}
                className="px-5 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Book Procurement Slot
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    7-Stage Procurement Workflow Tracking
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">
                      Token #{currentBooking?.tokenDisplay}
                    </p>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setAuditInfoOpen(true)}
                      className="text-xs text-[#2E7D32] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Cryptographically Tracked ⓘ</span>
                    </button>
                  </div>
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
            </>
          )}
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

          {!currentBooking ? (
            <div className="text-center py-8 space-y-4">
              <FileText className="w-10 h-10 text-[#2E7D32] mx-auto opacity-40" />
              <h4 className="text-sm font-bold text-gray-900">
                No Active or Past Procurement Transactions
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Disbursement details will appear here once your procurement cycle commences.
              </p>
              <button
                onClick={() => navigateTo("book-slot")}
                className="px-5 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Book Procurement Slot
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Crop & Weight
                  </span>
                  <p className="text-base font-bold text-gray-900">
                    {currentBooking?.crop} (
                    {currentBooking?.weighedQuantity || currentBooking?.quantity || 0}{" "}
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
                      currentBooking?.paymentDetails?.grossAmount ||
                      (Number(currentBooking?.weighedQuantity || currentBooking?.quantity || 0) * (currentBooking?.paymentDetails?.mspPerQtl || 2320))
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
                      `DBT-SBI-2026-${currentBooking?.tokenDisplay || "000"}`}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                  {currentBooking?.paymentDetails?.disbursed
                    ? "DISBURSED"
                    : "AUTHORIZED BY OFFICER"}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 6: FARMER PROFILE VIEW & EDIT */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#E0ECE0] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#1B4318] flex items-center justify-center text-white font-black shadow-md shrink-0">
                <User className="w-8 h-8 text-[#F9A825]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {farmerProfile.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black border border-[#A5D6A7]">
                    VERIFIED KISAN
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-bold mt-0.5">
                  Farmer ID:{" "}
                  <span className="text-[#1B4318] font-mono">
                    {farmerProfile.farmerId}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer w-fit"
            >
              <Edit2 className="w-4 h-4 text-[#F9A825]" />
              <span>{t("editProfile")}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E8E4D9]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {t("readOnlyFarmerId")}
              </span>
              <span className="text-sm font-mono font-black text-[#1B4318] block mt-1">
                {farmerProfile.farmerId}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">
                Permanent Identifier (Read Only)
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E8E4D9]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {t("fullName")}
              </span>
              <span className="text-sm font-bold text-gray-900 block mt-1">
                {farmerProfile.name}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">
                Canonical Profile Name
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E8E4D9]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {t("mobile10")}
              </span>
              <span className="text-sm font-bold text-gray-900 block mt-1">
                +91 {farmerProfile.mobile}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">
                Primary Auth & OTP Mobile
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E8E4D9]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {t("emailLabel")}
              </span>
              <span className="text-sm font-bold text-gray-900 block mt-1 truncate">
                {farmerProfile.email || "rameshwar.singh@email.com"}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">
                Official Contact Email
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E8E4D9] md:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {t("addressLabel")}
              </span>
              <span className="text-sm font-bold text-gray-900 block mt-1">
                {farmerProfile.address ||
                  `${farmerProfile.village}, ${farmerProfile.district}, ${farmerProfile.state}`}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">
                Registered Farmland Address
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
              <Sprout className="w-4 h-4 text-[#2E7D32]" />
              <span>{crops.length} MSP Eligible Crops Registered</span>
            </div>
            <button
              onClick={() => setEditProfileOpen(true)}
              className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 shadow-2xl space-y-4 font-sans text-left">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">
                  Tamper-Evident Audit Trail
                </h3>
                <p className="text-xs text-[#2E7D32] font-semibold">
                  Informational Integrity Overview
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Your procurement milestones (Booking, Mandi Arrival, Quality
              Check, Digital Weighing, MSP Procurement, and DBT Payment) are
              recorded in a tamper-evident audit trail using SHA-256
              cryptographic hashes.
            </p>

            <div className="p-3 bg-[#FAF8F2] rounded-xl border border-gray-200 text-[11px] font-mono text-gray-700 space-y-1">
              <div className="font-bold text-gray-900">Hash Seal Status:</div>
              <div className="text-[#2E7D32] font-bold">VALID & VERIFIED ✓</div>
              <div className="text-gray-400 break-all text-[9px]">
                0x3c9e1d7b0e885e4f2c118f2a4b127f8a9b2c3d4e5f6a
              </div>
            </div>

            <p className="text-[11px] text-gray-500 italic">
              Detailed audit log records are accessible exclusively to
              authorized Mandi Command Officers and System Auditors.
            </p>

            <button
              onClick={() => setAuditInfoOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
