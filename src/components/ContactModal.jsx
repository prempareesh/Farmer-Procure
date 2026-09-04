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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 border-b border-[#1A2E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal text-[#F2F0E8] tracking-wide">Mandi Telemetry Support</h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                Farmer Query & Dispatch Assistance
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-[#071008] font-mono">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rameshwar Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  Message / Mandi Assistance Required *
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe your slot, quality check or DBT query..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#79C267]" />
                <span>Submit Inquiry Ticket</span>
              </button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-3 bg-[#050805] border border-[#1A2E1E] p-6">
              <div className="w-12 h-12 border border-[#79C267]/40 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif text-[#F2F0E8]">
                Inquiry Ticket #TKT-8841 Created
              </h4>
              <p className="text-xs text-[#A6ADA3] font-mono max-w-sm mx-auto leading-relaxed">
                Thank you! Our procurement support executive will contact your registered mobile number shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-3 px-5 py-2 bg-[#164A29] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider hover:bg-[#12351F] cursor-pointer"
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
