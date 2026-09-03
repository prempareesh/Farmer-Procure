import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Wheat,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Download,
  QrCode,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SlotBookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    farmerName: "Ramesh Kumar",
    phone: "+91 98765 43210",
    mandi: "Karnal Central Grain Mandi (HR)",
    crop: "Paddy (Grade A)",
    quantity: "45 Quintals",
    date: "2026-08-26",
    timeSlot: "09:00 AM - 10:00 AM",
  });

  const [bookingPass, setBookingPass] = useState(null);

  const mandis = [
    "Karnal Central Grain Mandi (HR)",
    "Ludhiana Main Grain Market (PB)",
    "Nalgonda Paddy Procurement Hub (TS)",
    "Kota Agricultural Mandi (RJ)",
    "Guntur Rice & Grain Procurement Centre (AP)",
  ];

  const crops = [
    "Paddy (Grade A)",
    "Wheat (Sharbati)",
    "Mustard / Sarson",
    "Cotton (Long Staple)",
    "Maize / Makka",
  ];

  const slots = [
    {
      time: "08:00 AM - 09:00 AM",
      congestion: "Low (12m wait)",
      status: "green",
    },
    {
      time: "09:00 AM - 10:00 AM",
      congestion: "Optimal (18m wait)",
      status: "green",
    },
    {
      time: "11:00 AM - 12:00 PM",
      congestion: "High Congestion (75m wait)",
      status: "red",
    },
    {
      time: "02:00 PM - 03:00 PM",
      congestion: "Moderate (25m wait)",
      status: "yellow",
    },
    {
      time: "04:00 PM - 05:00 PM",
      congestion: "Low (10m wait)",
      status: "green",
    },
  ];

  const handleConfirm = (e) => {
    e.preventDefault();
    const token = "PI-2026-" + Math.floor(100000 + Math.random() * 900000);
    const shaHash = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");

    setBookingPass({
      token,
      shaHash: `0x7f8a${shaHash}`,
      ...formData,
    });

    setStep(2);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#2E7D32] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Book AI Procurement Slot</h3>
              <p className="text-xs text-white/80">
                Procure Intelligence • Smart Scheduling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 1 ? (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    value={formData.farmerName}
                    onChange={(e) =>
                      setFormData({ ...formData, farmerName: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Target Mandi Procurement Hub
                </label>
                <select
                  value={formData.mandi}
                  onChange={(e) =>
                    setFormData({ ...formData, mandi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D32] bg-white"
                >
                  {mandis.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Wheat className="w-3.5 h-3.5 text-[#2E7D32]" />
                    Crop Variety
                  </label>
                  <select
                    value={formData.crop}
                    onChange={(e) =>
                      setFormData({ ...formData, crop: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D32] bg-white"
                  >
                    {crops.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#2E7D32]" />
                    Estimated Load (Quintals)
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              {/* Time Slot AI Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                    Select AI Recommended Slot
                  </span>
                  <span className="text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                    Predictive SLA Engine
                  </span>
                </label>

                <div className="space-y-2">
                  {slots.map((s, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.timeSlot === s.time
                          ? "border-[#2E7D32] bg-[#E8F5E9]/60 ring-2 ring-[#2E7D32]"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="slot"
                          checked={formData.timeSlot === s.time}
                          onChange={() =>
                            setFormData({ ...formData, timeSlot: s.time })
                          }
                          className="accent-[#2E7D32]"
                        />
                        <span className="text-sm font-bold text-gray-900">
                          {s.time}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          s.status === "green"
                            ? "bg-green-100 text-green-800"
                            : s.status === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {s.congestion}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-base shadow-lg shadow-[#2E7D32]/30 transition-all"
                >
                  Generate Digital Mandi Token
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Digital Receipt Pass */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
                  Slot Confirmed & Hash Issued
                </span>
                <h4 className="text-2xl font-black text-gray-900 mt-2">
                  Digital Mandi Token
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  Token ID: {bookingPass.token}
                </p>
              </div>

              {/* Token Card details */}
              <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#E8E4D9] text-left space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Farmer:</span>
                    <p className="font-bold text-gray-900">
                      {bookingPass.farmerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <p className="font-bold text-gray-900">
                      {bookingPass.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 font-medium">
                      Mandi Centre:
                    </span>
                    <p className="font-bold text-gray-900">
                      {bookingPass.mandi}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">
                      Crop & Load:
                    </span>
                    <p className="font-bold text-gray-900">
                      {bookingPass.crop} ({bookingPass.quantity})
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">
                      Scheduled Time:
                    </span>
                    <p className="font-bold text-[#2E7D32]">
                      {bookingPass.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">
                      SHA-256 Audit Stamp
                    </span>
                    <code className="text-[10px] text-[#2E7D32] bg-white px-2 py-1 rounded border border-gray-200 block font-mono">
                      {bookingPass.shaHash.substring(0, 24)}...
                    </code>
                  </div>
                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-gray-300 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Token PDF downloaded to your device!")}
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Digital Pass</span>
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    onClose();
                  }}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
