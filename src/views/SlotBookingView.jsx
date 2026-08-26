import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sprout, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, QrCode, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

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
    bookings,
    t,
  } = useApp();

  const selectedMandi = mandiCentres.find((m) => m.id === selectedMandiId) || mandiCentres[0];

  // Strictly bind to registered crops only
  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.name || 'Paddy (Basmati 1121)');
  const [quantity, setQuantity] = useState('45');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('02:00 PM - 03:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Dynamic estimated processing duration calculation based on crop acreage
  const matchedCrop = crops.find((c) => c.name === selectedCrop) || crops[0];
  const estimatedProcessingMins = Math.max(15, Math.round((matchedCrop?.areaAcres || 4) * 6.5));

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !quantity) return;

    setIsSubmitting(true);
    try {
      const newBooking = await bookSlot({
        centreId: selectedMandiId,
        crop: selectedCrop,
        quantity: Number(quantity),
        date: bookingDate,
        timeSlot: selectedSlot,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2E7D32', '#4CAF50', '#F9A825'],
      });

      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('farmer-dash')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Farmer Dashboard</span>
        </button>

        <span className="text-xs font-mono font-bold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
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
                  <h2 className="text-xl font-extrabold text-gray-900">Smart Slot Reservation</h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    Cinema-ticket capacity locking with centre-specific daily token sequencing
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-5">
              
              {/* Mandi Centre */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  Select Procurement Centre (Independent Token Sequence)
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
                            ? 'bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs'
                            : 'bg-[#FAF8F2] border-gray-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{centre.name}</h4>
                          <span className="font-mono text-[10px] font-black text-[#1B4318]">
                            [Token {centre.tokenPrefix}XXX]
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {centre.district}, {centre.state} • {centre.activeCounters} Digital Weighbridges
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strictly Bound Registered Crops Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1"><Sprout className="w-4 h-4 text-[#2E7D32]" /> Select Registered Crop</span>
                    <span className="text-[10px] text-gray-400 font-bold">From Profile Only</span>
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.areaAcres} Acres • Exp: {c.expectedYieldQuintals} Qtl)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Expected Quantity (Quintals) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={matchedCrop ? matchedCrop.expectedYieldQuintals + 50 : 200}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              {/* Estimated Processing Duration Banner */}
              <div className="p-3.5 bg-[#E8F5E9]/70 rounded-2xl border border-[#A5D6A7] flex items-center justify-between text-xs font-bold">
                <span className="text-gray-800">
                  ⚡ Profile-Estimated Processing Duration ({matchedCrop?.areaAcres || 4} Acres):
                </span>
                <span className="text-[#1B4318] font-black">
                  ~{estimatedProcessingMins} Minutes
                </span>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Procurement Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2]"
                />
              </div>

              {/* Cinema-Ticket Style Slot Capacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#2E7D32]" />
                    Live Slot Capacity & AI Congestion Recommendation
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
                            ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs cursor-pointer'
                            : 'bg-[#FAF8F2] border-gray-200 hover:bg-white cursor-pointer'
                        }`}
                      >
                        {slot.isRecommended && (
                          <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-[#F9A825] text-gray-900 text-[9px] font-black uppercase shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Recommended Slot
                          </span>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">{slot.time}</span>
                          {isFull ? (
                            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black">
                              FULL
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-600">
                              Avail: <strong className="text-[#2E7D32]">{available}</strong> / {slot.capacity}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] mt-1.5 font-medium">
                          <span className="text-gray-500">Booked: {slot.booked}/{slot.capacity}</span>
                          <span className={slot.expectedWaitMins <= 15 ? 'text-[#2E7D32] font-bold' : 'text-amber-700'}>
                            Exp. Wait: ~{slot.expectedWaitMins} min
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Securing Slot Lock & Generating Token...' : 'Confirm Slot & Issue Token'}
                <ArrowRight className="w-4 h-4 text-[#F9A825]" />
              </button>
            </form>
          </div>

          {/* Right Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2E7D32]" />
                <span>Atomic Capacity Lock Protocol</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Once confirmed, your slot capacity is immediately locked in the state procurement cluster. Duplicate booking attempts with the same Aadhaar/Farmer ID are automatically rejected by the anomaly engine.
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* CONFIRMATION */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-[#A5D6A7] max-w-2xl mx-auto space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Mandi Token Assigned: {confirmedBooking.tokenDisplay}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Procurement Centre: {confirmedBooking.centreName} • Daily Queue Starts 9:00 AM
            </p>
          </div>

          <div className="p-5 bg-[#FAF8F2] rounded-2xl border border-gray-200 flex flex-col items-center space-y-2">
            <QrCode className="w-28 h-28 text-[#1B4318]" />
            <p className="text-xs font-mono font-bold text-gray-700">Token #{confirmedBooking.tokenDisplay}</p>
          </div>

          <button
            onClick={() => navigateTo('farmer-dash')}
            className="w-full py-3 bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Go to Farmer Dashboard & Live Queue →
          </button>
        </motion.div>
      )}

    </div>
  );
}
