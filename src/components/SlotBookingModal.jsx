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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden font-mono"
      >
        {/* Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 border-b border-[#1A2E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal text-[#F2F0E8] tracking-wide">Book AI Procurement Slot</h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                Procure Intelligence • Predictive Slot Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto bg-[#071008]">
          {step === 1 ? (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    value={formData.farmerName}
                    onChange={(e) =>
                      setFormData({ ...formData, farmerName: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#79C267]" />
                  Target Mandi Procurement Hub
                </label>
                <select
                  value={formData.mandi}
                  onChange={(e) =>
                    setFormData({ ...formData, mandi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                >
                  {mandis.map((m, i) => (
                    <option key={i} value={m} className="bg-[#050805] text-[#F2F0E8]">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Wheat className="w-3.5 h-3.5 text-[#79C267]" />
                    Crop Variety
                  </label>
                  <select
                    value={formData.crop}
                    onChange={(e) =>
                      setFormData({ ...formData, crop: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  >
                    {crops.map((c, i) => (
                      <option key={i} value={c} className="bg-[#050805] text-[#F2F0E8]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#79C267]" />
                    Estimated Load (Quintals)
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>
              </div>

              {/* Time Slot AI Selection */}
              <div>
                <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#79C267]" />
                    Select AI Recommended Slot
                  </span>
                  <span className="text-[10px] font-mono text-[#79C267] bg-[#0A180D] px-2 py-0.5 border border-[#79C267]/30">
                    Predictive SLA Engine
                  </span>
                </label>

                <div className="space-y-2">
                  {slots.map((s, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                        formData.timeSlot === s.time
                          ? "border-[#79C267] bg-[#0A180D] text-[#F2F0E8]"
                          : "border-[#1A2E1E] bg-[#050805] text-[#A6ADA3] hover:border-[#79C267]/30"
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
                          className="accent-[#79C267]"
                        />
                        <span className="text-xs font-mono font-bold text-[#F2F0E8]">
                          {s.time}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border ${
                          s.status === "green"
                            ? "bg-[#0A180D] border-[#79C267]/40 text-[#79C267]"
                            : s.status === "yellow"
                              ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                              : "bg-red-950/40 border-red-500/40 text-red-400"
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
                  className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  Generate Digital Mandi Token
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Digital Receipt Pass */
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 border border-[#79C267]/40 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#79C267] bg-[#0A180D] px-3 py-1 border border-[#79C267]/40">
                  Slot Confirmed & Hash Issued
                </span>
                <h4 className="text-2xl font-serif text-[#F2F0E8] mt-2">
                  Digital Mandi Token
                </h4>
                <p className="text-xs text-[#A6ADA3] mt-1 font-mono">
                  Token ID: {bookingPass.token}
                </p>
              </div>

              {/* Token Card details */}
              <div className="bg-[#050805] p-5 border border-[#1A2E1E] text-left space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[#A6ADA3] text-[10px] uppercase block">Farmer:</span>
                    <p className="font-serif text-sm text-[#F2F0E8]">
                      {bookingPass.farmerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#A6ADA3] text-[10px] uppercase block">Phone:</span>
                    <p className="text-[#E8E7DE]">
                      {bookingPass.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#A6ADA3] text-[10px] uppercase block">
                      Mandi Centre:
                    </span>
                    <p className="text-[#E8E7DE]">
                      {bookingPass.mandi}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#A6ADA3] text-[10px] uppercase block">
                      Crop & Load:
                    </span>
                    <p className="text-[#79C267]">
                      {bookingPass.crop} ({bookingPass.quantity})
                    </p>
                  </div>
                  <div>
                    <span className="text-[#A6ADA3] text-[10px] uppercase block">
                      Scheduled Time:
                    </span>
                    <p className="text-[#79C267]">
                      {bookingPass.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1A2E1E] flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#A6ADA3] uppercase block">
                      SHA-256 Audit Stamp
                    </span>
                    <code className="text-[10px] text-[#79C267] bg-[#071008] px-2 py-1 border border-[#1A2E1E] block font-mono">
                      {bookingPass.shaHash.substring(0, 24)}...
                    </code>
                  </div>
                  <div className="w-12 h-12 bg-[#0A180D] border border-[#1A2E1E] flex items-center justify-center shrink-0">
                    <QrCode className="w-8 h-8 text-[#79C267]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Token PDF downloaded to your device!")}
                  className="flex-1 py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#79C267]" />
                  <span>Download Pass</span>
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    onClose();
                  }}
                  className="px-5 py-3 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
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
