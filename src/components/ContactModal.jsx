import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ContactModal() {
  const { contactModalOpen, setContactModalOpen, addNotification } = useApp();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!contactModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addNotification({
      title: "Inquiry Submitted",
      message:
        "Your Mandi assistance inquiry ticket #TKT-8841 has been registered. Officer will call back within 15 mins.",
      type: "success",
    });
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setMessage("");
    setContactModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Mandi Helpdesk & Support</h3>
              <p className="text-xs text-[#A5D6A7]">
                Farmer Query & Assistance Desk
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-[#FAF8F2]">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rameshwar Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Message / Mandi Assistance Required *
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe your slot, quality check or DBT query..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry Ticket</span>
              </button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-gray-900">
                Inquiry Ticket #TKT-8841 Created
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Thank you! Our procurement support executive will contact your
                registered mobile number shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-3 px-5 py-2 bg-[#1B4318] text-white font-bold text-xs rounded-xl hover:bg-[#2E7D32]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
