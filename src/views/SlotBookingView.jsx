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
        colors: ["#164A29", "#79C267", "#F2F0E8"],
      });

      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
    } catch {
      setIsSubmitting(false);
      setValidationError("Booking system error. Please try again.");
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 selection:bg-[#164A29] selection:text-[#79C267]">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-6">
        <button
          onClick={() => navigateTo("farmer-dash")}
          className="flex items-center gap-2 text-xs font-mono text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("farmerPortal")}</span>
        </button>

        <span className="text-xs font-mono text-[#79C267] bg-[#071008] px-3 py-1.5 rounded border border-[#1A2E1E]">
          Farmer: {farmerProfile.name} ({farmerProfile.farmerId})
        </span>
      </div>

      {!confirmedBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center font-mono shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#F2F0E8]">
                    {t("bookSlot")}
                  </h2>
                  <p className="text-xs text-[#A6ADA3] font-mono mt-0.5">
                    {t("brandTagline")}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleBookingSubmit}
              className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-6"
            >
              {/* STEP 1: SELECT PROCUREMENT CENTRE */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#79C267]" />
                  {t("selectMandi")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mandiCentres.map((centre) => {
                    const isSelected = selectedMandiId === centre.id;
                    return (
                      <div
                        key={centre.id}
                        onClick={() => setSelectedMandiId(centre.id)}
                        className={`p-4 rounded-sm border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#164A29]/30 border-[#79C267]"
                            : "bg-[#050805] border-[#1A2E1E] hover:border-[#79C267]/40"
                        }`}
                      >
                        <h4 className="text-xs font-serif text-[#F2F0E8]">
                          {centre.name || centre.centre_name}
                        </h4>
                        <p className="text-[11px] text-[#A6ADA3] font-mono mt-1">
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
                    <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-[#79C267]" />{" "}
                      {t("selectCrop")}
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#050805] text-[#F2F0E8] focus:border-[#79C267] cursor-pointer"
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
                    <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5">
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
                      className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#050805] text-[#F2F0E8] focus:border-[#79C267]"
                    />
                  </div>
                </div>

                {/* Registered Crop Profile Context Box */}
                {matchedCrop && (
                  <div className="p-3.5 bg-[#050805] rounded-sm border border-[#1A2E1E] text-xs font-mono text-[#A6ADA3] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#79C267] shrink-0" />
                      <div>
                        <span className="text-[#F2F0E8]">
                          {t("registeredCropInfoLabel")}:{" "}
                        </span>
                        <span>
                          {t("areaLabel")}:{" "}
                          <strong className="text-[#79C267]">
                            {matchedCrop.areaAcres} {t("acres")}
                          </strong>{" "}
                          • {t("expectedProductionLabel")}:{" "}
                          <strong className="text-[#79C267]">
                            {matchedCrop.expectedYieldQuintals} Qtl
                          </strong>
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#A6ADA3] uppercase tracking-wider hidden sm:inline">
                      Profile Context
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 5: SELECT DATE */}
              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5">
                  {t("selectDate")}
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs font-mono bg-[#050805] text-[#F2F0E8] focus:border-[#79C267]"
                />
              </div>

              {/* STEP 6: AVAILABLE TIME SLOTS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#79C267]" />
                    {t("selectTimeSlot")}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        className={`p-3.5 rounded-sm border transition-all relative font-mono ${
                          isFull
                            ? "bg-[#050805]/40 border-[#1A2E1E]/40 opacity-40 cursor-not-allowed"
                            : isSelected
                              ? "bg-[#164A29]/30 border-[#79C267]"
                              : "bg-[#050805] border-[#1A2E1E] hover:border-[#79C267]/40 cursor-pointer"
                        }`}
                      >
                        {slot.isRecommended && (
                          <span className="absolute -top-2 right-3 px-2 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[9px] font-mono uppercase border border-[#79C267]/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-[#79C267]" />{" "}
                            {t("smartSlotRecommendation")}
                          </span>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-serif text-[#F2F0E8]">
                            {slot.time}
                          </span>
                          {isFull ? (
                            <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 text-[10px] border border-red-800/50">
                              {t("fullCapacity")}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#A6ADA3]">
                              {t("availableCapacity")}:{" "}
                              <strong className="text-[#79C267]">
                                {available}
                              </strong>{" "}
                              / {slot.capacity}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] mt-2 text-[#A6ADA3]">
                          <span>
                            Booked: {slot.booked}/{slot.capacity}
                          </span>
                          <span
                            className={
                              slot.expectedWaitMins <= 15
                                ? "text-[#79C267]"
                                : "text-amber-400"
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
              <div className="p-4 bg-[#050805] rounded-sm border border-[#1A2E1E] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#79C267]" />
                    <div>
                      <h4 className="text-xs font-mono text-[#F2F0E8] uppercase tracking-wider">
                        Identity Verification
                      </h4>
                      <p className="text-[11px] text-[#A6ADA3] font-sans">
                        Take a clear photo to verify your identity when you
                        arrive.
                      </p>
                    </div>
                  </div>
                  {identityPhotoData && (
                    <span className="px-2.5 py-0.5 rounded bg-[#164A29] text-[#79C267] text-[10px] font-mono border border-[#79C267]/30">
                      Identity Photo Captured ✓
                    </span>
                  )}
                </div>

                {!identityPhotoData ? (
                  <button
                    type="button"
                    onClick={() => setIsCaptureModalOpen(true)}
                    className="w-full py-3 rounded-sm bg-[#071008] border border-[#1A2E1E] hover:border-[#79C267]/50 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#79C267]" />
                    <span>Take Identity Photo (Camera Required)</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-[#071008] rounded-sm border border-[#1A2E1E]">
                    <div className="w-14 h-14 rounded overflow-hidden border border-[#79C267]/40 shrink-0">
                      <img
                        src={identityPhotoData.photoUrl}
                        alt="Identity Capture"
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    </div>
                    <div className="flex-1 text-xs font-mono text-[#A6ADA3]">
                      <p className="text-[#79C267]">
                        Photo Encoded & Reference Saved
                      </p>
                      <p className="text-[10px] text-[#A6ADA3]/60">
                        128-d Vector Encrypted •{" "}
                        {new Date(
                          identityPhotoData.capturedAt,
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCaptureModalOpen(true)}
                      className="px-3 py-1.5 rounded-sm border border-[#1A2E1E] text-[#A6ADA3] hover:text-[#F2F0E8] text-[11px] font-mono cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#79C267]" />
                      <span>Retake</span>
                    </button>
                  </div>
                )}
              </div>

              {validationError && (
                <div className="p-3 bg-red-950/40 text-red-300 text-xs font-mono rounded-sm border border-red-900/60">
                  {validationError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-widest border border-[#79C267]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? "Processing..." : t("confirmBookingBtn")}
                <ArrowRight className="w-4 h-4 text-[#79C267]" />
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
            <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-4">
              <h3 className="text-xs font-mono text-[#79C267] uppercase tracking-wider flex items-center gap-2 border-b border-[#1A2E1E] pb-3">
                <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                <span>{t("bookingSummaryTitle")}</span>
              </h3>

              <div className="space-y-3 text-xs font-mono text-[#A6ADA3]">
                <div className="flex justify-between border-b border-[#1A2E1E] pb-2">
                  <span>
                    {t("targetMandiCentre")}:
                  </span>
                  <span className="font-serif text-[#F2F0E8] text-right max-w-44">
                    {selectedCentre.name || selectedCentre.centre_name}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#1A2E1E] pb-2">
                  <span>{t("cropLabel")}:</span>
                  <span className="font-serif text-[#F2F0E8]">
                    {selectedCrop}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#1A2E1E] pb-2">
                  <span>
                    {t("visitQuantitySummary")}:
                  </span>
                  <span className="font-serif text-[#79C267] text-sm">
                    {quantity || "0"} Qtl
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#1A2E1E] pb-2">
                  <span>
                    {t("procurementDateLabel")}:
                  </span>
                  <span className="text-[#F2F0E8]">{bookingDate}</span>
                </div>

                <div className="flex justify-between border-b border-[#1A2E1E] pb-2">
                  <span>{t("slotLabel")}:</span>
                  <span className="text-[#F2F0E8]">
                    {selectedSlot}
                  </span>
                </div>

                <div className="flex justify-between pt-1">
                  <span>{t("estWait")}:</span>
                  <span className="text-[#79C267]">
                    ~{activeSlotObj.expectedWaitMins || 19} min
                  </span>
                </div>
              </div>
            </div>

            {/* Atomic Protocol Note */}
            <div className="bg-[#071008] rounded-md p-6 border border-[#1A2E1E] space-y-3">
              <h3 className="text-xs font-mono text-[#F2F0E8] uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#79C267]" />
                <span>Atomic Capacity Lock Protocol</span>
              </h3>
              <p className="text-xs text-[#A6ADA3] leading-relaxed font-sans">
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
          className="bg-[#071008] rounded-md p-8 border border-[#79C267]/40 max-w-2xl mx-auto space-y-6 text-center selection:bg-[#164A29] selection:text-[#79C267]"
        >
          <div className="w-16 h-16 rounded bg-[#050805] text-[#79C267] border border-[#1A2E1E] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#F2F0E8]">
              Mandi Token Assigned: {confirmedBooking.tokenDisplay}
            </h2>
            <p className="text-xs font-mono text-[#A6ADA3] mt-1">
              Procurement Centre: {confirmedBooking.centreName} • Daily Queue
              Starts 9:00 AM
            </p>
          </div>

          <div className="p-6 bg-[#050805] rounded-md border border-[#1A2E1E] flex flex-col items-center space-y-3 font-mono">
            <QrCode className="w-28 h-28 text-[#79C267]" />
            <p className="text-xs text-[#F2F0E8] font-bold">
              Token #{confirmedBooking.tokenDisplay}
            </p>
            <p className="text-xs text-[#79C267]">
              {confirmedBooking.crop} ({confirmedBooking.quantity} Qtl)
            </p>
          </div>

          <button
            onClick={() => navigateTo("farmer-dash")}
            className="w-full py-3.5 bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-wider rounded-sm border border-[#79C267]/30 transition-colors cursor-pointer"
          >
            Go to Farmer Dashboard & Live Queue →
          </button>
        </motion.div>
      )}
    </div>
  );
}

