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
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";

export default function SlotBookingView() {
  const {
    mandiCentres,
    selectedMandiId,
    setSelectedMandiId,
    crops,
    farmerProfile,
    timeSlots,
    bookings,
    isOffline,
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
  const [selectedSlot, setSelectedSlot] = useState("08:00 AM - 09:00 AM");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Match selected crop profile & centre
  const matchedCrop =
    farmerCrops.find((c) => c.name === selectedCrop) || farmerCrops[0];
  const selectedCentre =
    mandiCentres.find((m) => m.id === selectedMandiId) || mandiCentres[0];

  // USP 2: Real Database-Driven Slot Occupancy & Smart Recommendation Engine
  const activeBookingsForDateAndCentre = (bookings || []).filter(
    (b) =>
      (b.centreId === selectedMandiId ||
        b.centreCode === selectedCentre.centre_code) &&
      (b.date === bookingDate || b.slot_date === bookingDate) &&
      b.stage !== "COMPLETED" &&
      b.status !== "COMPLETED",
  );

  // Compute real booked count per slot
  const dynamicSlots = timeSlots.map((slot) => {
    const bookedCount = activeBookingsForDateAndCentre.filter(
      (b) => b.timeSlot === slot.time || b.slot_time === slot.time,
    ).length;
    const capacity = slot.capacity || 20;
    const isFull = bookedCount >= capacity;
    const available = Math.max(0, capacity - bookedCount);
    const occupancyRatio = bookedCount / capacity;
    const congestion = isFull
      ? "FULL"
      : occupancyRatio >= 0.75
        ? "HIGH"
        : occupancyRatio >= 0.4
          ? "MEDIUM"
          : "LOW";

    return {
      ...slot,
      booked: bookedCount,
      capacity,
      available,
      isFull,
      occupancyRatio,
      congestion,
      expectedWaitMins: Math.max(5, Math.round(bookedCount * 3)),
    };
  });

  // Recommend slot with minimum occupancy among non-full slots
  const nonFullSlots = dynamicSlots.filter((s) => !s.isFull);
  const minBooked =
    nonFullSlots.length > 0
      ? Math.min(...nonFullSlots.map((s) => s.booked))
      : -1;

  let recommendedSlotTime = null;
  if (minBooked >= 0) {
    const bestSlot = nonFullSlots.find((s) => s.booked === minBooked);
    if (bestSlot) recommendedSlotTime = bestSlot.time;
  }

  const enrichedSlots = dynamicSlots.map((slot) => {
    const isRecommended = slot.time === recommendedSlotTime;
    return {
      ...slot,
      isRecommended,
      recommendationRationale: isRecommended
        ? `${t("lowestQueuePressure") || "Lowest current queue pressure"} — ${slot.booked} of ${slot.capacity} slots booked.`
        : null,
    };
  });

  const activeSlotObj =
    enrichedSlots.find((s) => s.time === selectedSlot) || enrichedSlots[0];

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

    setIsSubmitting(true);
    try {
      const newBooking = await bookSlot({
        centreId: selectedMandiId,
        crop: selectedCrop,
        quantity: qtyNum,
        date: bookingDate,
        timeSlot: selectedSlot,
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
                  {enrichedSlots.map((slot) => {
                    const isFull = slot.isFull;
                    const isSelected = selectedSlot === slot.time;
                    const available = slot.available;

                    return (
                      <div
                        key={slot.time}
                        onClick={() => {
                          if (!isFull) {
                            setSelectedSlot(slot.time);
                            setValidationError("");
                          } else {
                            setValidationError(
                              t("slotFullError") ||
                                "Slot full. Please choose another slot.",
                            );
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all relative ${
                          isFull
                            ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                            : isSelected
                              ? "bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs cursor-pointer"
                              : "bg-[#FAF8F2] border-gray-200 hover:bg-white cursor-pointer"
                        }`}
                      >
                        {slot.isRecommended && (
                          <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-[#F9A825] text-gray-900 text-[9px] font-black uppercase shadow-xs flex items-center gap-1 border border-amber-400">
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
                              <strong className="text-[#2E7D32]">
                                {available}
                              </strong>{" "}
                              / {slot.capacity} {t("availableCapacity")}
                            </span>
                          )}
                        </div>

                        {slot.recommendationRationale && (
                          <p className="text-[10px] text-[#1B4318] font-extrabold mt-1.5 bg-[#E8F5E9]/80 p-1.5 rounded-lg border border-[#A5D6A7]">
                            💡 {slot.recommendationRationale}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] mt-2 font-medium pt-1 border-t border-gray-100">
                          <span className="text-gray-500 font-semibold">
                            Booked: {slot.booked}/{slot.capacity}
                          </span>
                          <span
                            className={`font-extrabold px-1.5 py-0.5 rounded ${
                              slot.congestion === "LOW"
                                ? "bg-green-100 text-[#2E7D32]"
                                : slot.congestion === "MEDIUM"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slot.congestion} CONGESTION
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
