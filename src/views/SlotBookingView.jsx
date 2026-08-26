import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sprout, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, QrCode, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export default function SlotBookingView() {
  const {
    mandiCentres,
    selectedMandiId,
    setSelectedMandiId,
    crops,
    timeSlots,
    bookSlot,
    navigateTo,
    bookings,
  } = useApp();

  const selectedMandi = mandiCentres.find((m) => m.id === selectedMandiId) || mandiCentres[0];

  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.name || 'Paddy (Basmati 1121)');
  const [quantity, setQuantity] = useState('45');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('02:00 PM - 03:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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

      // Confetti celebration
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
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <button
          onClick={() => navigateTo('queue')}
          className="px-4 py-2 rounded-xl bg-white border border-[#A5D6A7] text-[#2E7D32] text-xs font-bold hover:bg-[#E8F5E9] transition-all shadow-xs"
        >
          View Live Queue Tracker →
        </button>
      </div>

      {!confirmedBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 7 COLS: Booking Form & Mandi Selection */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4318] text-white flex items-center justify-center font-bold shadow-xs">
                  <Calendar className="w-6 h-6 text-[#F9A825]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Smart Slot Reservation</h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    AI-managed arrival scheduling with guaranteed zero-wait lane allocation
                  </p>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-5">
              
              {/* Mandi Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  Select Procurement Centre (Mandi)
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
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 font-medium">
                          {centre.district}, {centre.state} • {centre.activeCounters} Digital Weighbridges
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Crop & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
                    <Sprout className="w-4 h-4 text-[#2E7D32]" />
                    Select Crop Variety
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.areaAcres} Acres registered)
                      </option>
                    ))}
                    <option value="Maize (Kharif)">Maize (Kharif)</option>
                    <option value="Cotton (Long Staple)">Cotton (Long Staple)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Expected Quantity (Quintals) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#2E7D32]" />
                  Procurement Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              {/* Live Slot Capacity & AI Recommendation Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#2E7D32]" />
                    Live Slot Capacity & Recommended Time
                  </label>
                  <span className="text-[11px] text-[#2E7D32] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Predictive Wait Calculation
                  </span>
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
                          <span className="text-gray-500">
                            Booked: {slot.booked}/{slot.capacity}
                          </span>
                          <span className={slot.expectedWaitMins <= 15 ? 'text-[#2E7D32] font-bold' : 'text-amber-700'}>
                            Exp. Wait: ~{slot.expectedWaitMins} min
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Generating Cryptographic Token...' : 'Confirm AI Slot Reservation'}
                <ArrowRight className="w-4 h-4 text-[#F9A825]" />
              </button>
            </form>
          </div>

          {/* RIGHT 5 COLS: Mandi Telemetry & Previous Bookings */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Mandi Status Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                Selected Mandi Live Intelligence
              </h3>

              <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E8E4D9] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Today Capacity:</span>
                  <span className="font-bold text-gray-900">{selectedMandi.todayCapacity} Vehicles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reserved Tokens:</span>
                  <span className="font-bold text-[#2E7D32]">{selectedMandi.todayBooked} Booked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Weighbridges:</span>
                  <span className="font-bold text-gray-900">{selectedMandi.activeCounters} Digital Sensor Lanes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Historical Avg Turnaround:</span>
                  <span className="font-bold text-gray-900">{selectedMandi.historicalAvgMins} Mins/Vehicle</span>
                </div>
              </div>

              <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#A5D6A7] text-[11px] text-green-900 font-semibold leading-relaxed">
                💡 <strong>AI Smart Recommendation:</strong> Slots between <strong>02:00 PM – 04:00 PM</strong> experience 68% lower gate wait times due to staggered unloading shifts.
              </div>
            </div>

            {/* Active Bookings History */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Your Booking History ({bookings.length})</h3>

              <div className="space-y-3 max-h-72 overflow-y-auto">
                {bookings.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E0ECE0] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-[#1B4318]">Token #{b.tokenNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                        {b.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800">{b.crop} • {b.quantity} Quintals</p>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>{b.date} ({b.timeSlot.split(' - ')[0]})</span>
                      <span className="font-mono text-gray-400">{b.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* BOOKING CONFIRMATION & QR PASS VIEW */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-[#A5D6A7] max-w-2xl mx-auto space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black border border-[#A5D6A7]">
              SLOT RESERVATION CONFIRMED
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-2">
              Mandi Gate Pass Generated
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Your token has been securely logged into the cryptographic procurement ledger
            </p>
          </div>

          {/* Token Banner */}
          <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-[#E8E4D9] grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Booking ID</span>
              <p className="text-sm font-mono font-bold text-gray-900">{confirmedBooking.id}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Token</span>
              <p className="text-xl font-black text-[#1B4318]">Token #{confirmedBooking.tokenNumber}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Crop & Quantity</span>
              <p className="text-xs font-bold text-gray-800">{confirmedBooking.crop} ({confirmedBooking.quantity} Qtl)</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Reserved Time Slot</span>
              <p className="text-xs font-bold text-gray-800">{confirmedBooking.date} • {confirmedBooking.timeSlot}</p>
            </div>
          </div>

          {/* Digital QR Code Token Pass */}
          <div className="p-5 bg-[#FAF8F2] rounded-2xl border border-gray-200 flex flex-col items-center space-y-3">
            <div className="p-3 bg-white rounded-2xl border border-gray-300 shadow-xs">
              <QrCode className="w-28 h-28 text-[#1B4318]" />
            </div>
            <p className="text-[11px] font-mono text-gray-500 break-all max-w-sm">
              Payload: {confirmedBooking.qrData}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SHA-256 Authenticated Gate Pass</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateTo('queue')}
              className="flex-1 py-3 bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Track Live Mandi Queue & Progress →
            </button>
            <button
              onClick={() => navigateTo('qr-scanner')}
              className="flex-1 py-3 bg-white border border-[#2E7D32] text-[#2E7D32] font-bold text-xs rounded-xl hover:bg-[#E8F5E9]"
            >
              Simulate Gate QR Check-in →
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
