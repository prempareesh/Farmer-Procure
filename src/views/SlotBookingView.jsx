import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sprout,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  QrCode,
  ArrowLeft,
  Lock,
  Info,
  Camera,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import IdentityCaptureModal from "../components/IdentityCaptureModal";

export default function SlotBookingView() {
  const {
    mandiCentres,
    selectedMandiId,
    setSelectedMandiId,
    crops,
    farmerProfile,
    timeSlots,
    bookSlot,
    navigateTo,
    t,
  } = useApp();

  // Farmer's registered crops
  const farmerCrops =
    farmerProfile?.crops && farmerProfile.crops.length > 0
      ? farmerProfile.crops
      : crops;

  // Form state
  const [selectedCrop, setSelectedCrop] = useState(
    farmerCrops[0]?.name || "Paddy (Basmati 1121)",
  );
  const [quantity, setQuantity] = useState("25");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedSlot, setSelectedSlot] = useState("02:00 PM - 03:00 PM");
  const [identityPhotoData, setIdentityPhotoData] = useState(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Match selected crop profile
  const matchedCrop =
    farmerCrops.find((c) => c.name === selectedCrop) || farmerCrops[0];
  const selectedCentre =
    mandiCentres.find((m) => m.id === selectedMandiId) || mandiCentres[0];
  const activeSlotObj =
    timeSlots.find((s) => s.time === selectedSlot) || timeSlots[0];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    const qtyNum = Number(quantity);
    if (!selectedSlot || !quantity || isNaN(qtyNum) || qtyNum <= 0) {
      setValidationError(
        "Please enter a valid positive quantity for this procurement visit.",
      );
      return;
    }

    if (!identityPhotoData) {
      setValidationError(
        "Identity photo capture is required. Please take a live identity photo before confirming your slot booking.",
      );
      setIsCaptureModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await bookSlot({
        centreId: selectedMandiId,
        crop: selectedCrop,
        quantity: qtyNum,
        date: bookingDate,
        timeSlot: selectedSlot,
        identityPhotoData,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#2E7D32", "#4CAF50", "#F9A825"],
      });

      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
    } catch {
      setIsSubmitting(false);
      setValidationError("Booking system error. Please try again.");
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 selection:bg-[#2E7D32] selection:text-white">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo("farmer-dash")}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("farmerPortal")}</span>
        </button>

        <span className="text-xs font-mono font-bold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
          Farmer: {farmerProfile.name} ({farmerProfile.farmerId})
        </span>
      </div>

      {!confirmedBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4318] text-white flex items-center justify-center font-bold shadow-xs">
                  <Calendar className="w-6 h-6 text-[#F9A825]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {t("bookSlot")}
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    {t("brandTagline")}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleBookingSubmit}
              className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-5"
            >
              {/* STEP 1: SELECT PROCUREMENT CENTRE */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  {t("selectMandi")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {mandiCentres.map((centre) => {
                    const isSelected = selectedMandiId === centre.id;
                    return (
                      <div
                        key={centre.id}
                        onClick={() => setSelectedMandiId(centre.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs"
                            : "bg-[#FAF8F2] border-gray-200 hover:bg-white"
                        }`}
                      >
                        <h4 className="text-xs font-bold text-gray-900">
                          {centre.name || centre.centre_name}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {centre.district}, {centre.state} •{" "}
                          {centre.activeCounters || 4}{" "}
                          {t("digitalWeighbridgesText")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: SELECT CROP & STEP 3: SHOW REGISTERED CROP INFORMATION */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
                      <Sprout className="w-4 h-4 text-[#2E7D32]" />{" "}
                      {t("selectCrop")}
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
                    >
                      {farmerCrops.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* STEP 4: ENTER QUANTITY FOR THIS VISIT */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      {t("quantityForThisVisitLabel")} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      placeholder="e.g. 25"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                {/* Registered Crop Profile Context Box */}
                {matchedCrop && (
                  <div className="p-3.5 bg-[#FAF8F2] rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#2E7D32] shrink-0" />
                      <div>
                        <span className="font-bold text-gray-800">
                          {t("registeredCropInfoLabel")}:{" "}
                        </span>
                        <span>
                          {t("areaLabel")}:{" "}
                          <strong>
                            {matchedCrop.areaAcres} {t("acres")}
                          </strong>{" "}
                          • {t("expectedProductionLabel")}:{" "}
                          <strong>
                            {matchedCrop.expectedYieldQuintals} Qtl
                          </strong>
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">
                      Profile Context
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 5: SELECT DATE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  {t("selectDate")}
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2]"
                />
              </div>

              {/* STEP 6: AVAILABLE TIME SLOTS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#2E7D32]" />
                    {t("selectTimeSlot")}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isFull = slot.booked >= slot.capacity;
                    const isSelected = selectedSlot === slot.time;
                    const available = slot.capacity - slot.booked;

                    return (
                      <div
                        key={slot.time}
                        onClick={() => {
                          if (!isFull) setSelectedSlot(slot.time);
                        }}
                        className={`p-3 rounded-2xl border transition-all relative ${
                          isFull
                            ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                            : isSelected
                              ? "bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs cursor-pointer"
                              : "bg-[#FAF8F2] border-gray-200 hover:bg-white cursor-pointer"
                        }`}
                      >
                        {slot.isRecommended && (
                          <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-[#F9A825] text-gray-900 text-[9px] font-black uppercase shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />{" "}
                            {t("smartSlotRecommendation")}
                          </span>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">
                            {slot.time}
                          </span>
                          {isFull ? (
                            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black">
                              {t("fullCapacity")}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-600">
                              {t("availableCapacity")}:{" "}
                              <strong className="text-[#2E7D32]">
                                {available}
                              </strong>{" "}
                              / {slot.capacity}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] mt-1.5 font-medium">
                          <span className="text-gray-500">
                            Booked: {slot.booked}/{slot.capacity}
                          </span>
                          <span
                            className={
                              slot.expectedWaitMins <= 15
                                ? "text-[#2E7D32] font-bold"
                                : "text-amber-700"
                            }
                          >
                            Exp. Wait: ~{slot.expectedWaitMins} min
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 7: IDENTITY VERIFICATION PHOTO CAPTURE */}
              <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#A5D6A7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
                    <div>
                      <h4 className="text-xs font-black text-gray-900 uppercase">
                        Identity Verification
                      </h4>
                      <p className="text-[11px] text-gray-600 font-semibold">
                        Take a clear photo to verify your identity when you
                        arrive.
                      </p>
                    </div>
                  </div>
                  {identityPhotoData && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black border border-[#A5D6A7]">
                      Identity Photo Captured ✓
                    </span>
                  )}
                </div>

                {!identityPhotoData ? (
                  <button
                    type="button"
                    onClick={() => setIsCaptureModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-white border border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#F9A825]" />
                    <span>Take Identity Photo (Camera Required)</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-emerald-200">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-emerald-400 shrink-0">
                      <img
                        src={identityPhotoData.photoUrl}
                        alt="Identity Capture"
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    </div>
                    <div className="flex-1 text-xs font-semibold text-gray-700">
                      <p className="text-[#1B4318] font-bold">
                        Photo Encoded & Reference Saved
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        128-d Vector Encrypted •{" "}
                        {new Date(
                          identityPhotoData.capturedAt,
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCaptureModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                  </div>
                )}
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                  {validationError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? "Processing..." : t("confirmBookingBtn")}
                <ArrowRight className="w-4 h-4 text-[#F9A825]" />
              </button>
            </form>
          </div>

          <IdentityCaptureModal
            isOpen={isCaptureModalOpen}
            onClose={() => setIsCaptureModalOpen(false)}
            onPhotoCaptured={(data) => {
              setIdentityPhotoData(data);
              setValidationError("");
            }}
            currentPhotoData={identityPhotoData}
          />

          {/* STEP 7 & 8: BOOKING SUMMARY & PREDICTION SIDEBAR */}
          <div className="lg:col-span-5 space-y-6">
            {/* BOOKING SUMMARY CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
              <h3 className="text-sm font-black text-[#1B4318] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>{t("bookingSummaryTitle")}</span>
              </h3>

              <div className="space-y-2.5 text-xs font-medium text-gray-700">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">
                    {t("targetMandiCentre")}:
                  </span>
                  <span className="font-bold text-gray-900 text-right max-w-44">
                    {selectedCentre.name || selectedCentre.centre_name}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">{t("cropLabel")}:</span>
                  <span className="font-bold text-gray-900">
                    {selectedCrop}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">
                    {t("visitQuantitySummary")}:
                  </span>
                  <span className="font-black text-[#2E7D32] text-sm">
                    {quantity || "0"} Qtl
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">
                    {t("procurementDateLabel")}:
                  </span>
                  <span className="font-bold text-gray-900">{bookingDate}</span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">{t("slotLabel")}:</span>
                  <span className="font-bold text-gray-900">
                    {selectedSlot}
                  </span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-gray-400">{t("estWait")}:</span>
                  <span className="font-bold text-[#1B4318]">
                    ~{activeSlotObj.expectedWaitMins || 19} min
                  </span>
                </div>
              </div>
            </div>

            {/* Atomic Protocol Note */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-3">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2E7D32]" />
                <span>Atomic Capacity Lock Protocol</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Upon confirmation, your appointment token capacity is locked in
                real-time across Mandi Staff & Officer command towers.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* CONFIRMATION SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-[#A5D6A7] max-w-2xl mx-auto space-y-6 text-center selection:bg-[#2E7D32] selection:text-white"
        >
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Mandi Token Assigned: {confirmedBooking.tokenDisplay}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Procurement Centre: {confirmedBooking.centreName} • Daily Queue
              Starts 9:00 AM
            </p>
          </div>

          <div className="p-5 bg-[#FAF8F2] rounded-2xl border border-gray-200 flex flex-col items-center space-y-2">
            <QrCode className="w-28 h-28 text-[#1B4318]" />
            <p className="text-xs font-mono font-bold text-gray-700">
              Token #{confirmedBooking.tokenDisplay}
            </p>
            <p className="text-xs text-[#2E7D32] font-extrabold">
              {confirmedBooking.crop} ({confirmedBooking.quantity} Qtl)
            </p>
          </div>

          <button
            onClick={() => navigateTo("farmer-dash")}
            className="w-full py-3.5 bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Go to Farmer Dashboard & Live Queue →
          </button>
        </motion.div>
      )}
    </div>
  );
}
