import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Sprout,
  Phone,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function AboutContactModal({
  isOpen,
  onClose,
  initialTab = "about",
}) {
  const [tab, setTab] = useState(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 border-b border-[#1A2E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal text-[#F2F0E8] tracking-wide">About AgriProcure</h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                Smart India Hackathon 2026 Project
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-[#071008] font-mono">
          {/* Tab Switcher */}
          <div className="flex bg-[#050805] p-1 border border-[#1A2E1E]">
            <button
              onClick={() => setTab("about")}
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                tab === "about"
                  ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/40"
                  : "text-[#A6ADA3] hover:text-[#F2F0E8]"
              }`}
            >
              Platform Story & Helpline
            </button>
            <button
              onClick={() => setTab("contact")}
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                tab === "contact"
                  ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/40"
                  : "text-[#A6ADA3] hover:text-[#F2F0E8]"
              }`}
            >
              Contact / Inquiry
            </button>
          </div>

          {tab === "about" ? (
            <div className="space-y-4">
              <div className="bg-[#050805] p-4 border border-[#1A2E1E] space-y-2">
                <h4 className="text-base font-serif text-[#F2F0E8]">
                  Empowering India's Farming Community
                </h4>
                <p className="text-xs font-mono text-[#A6ADA3] leading-relaxed">
                  AgriProcure (Procure Intelligence) eliminates long Mandi queue delays and brings 100% cryptographic transparency to MSP procurement through AI scheduling and SHA-256 audit trails.
                </p>
              </div>

              <div className="bg-[#0A180D] border border-[#79C267]/40 text-[#F2F0E8] p-4 flex items-center gap-3">
                <div className="w-9 h-9 border border-[#79C267]/40 bg-[#164A29] text-[#79C267] flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block tracking-wider">
                    24/7 Farmer Helpline (Toll-Free)
                  </span>
                  <span className="text-base font-serif text-[#79C267]">
                    1800-PROCURE-AI
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#E8E7DE]">
                <div className="bg-[#050805] p-3 border border-[#1A2E1E] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                  <span>SHA-256 Verified</span>
                </div>
                <div className="bg-[#050805] p-3 border border-[#1A2E1E] flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#79C267]" />
                  <span>Farmer First</span>
                </div>
              </div>
            </div>
          ) : !submitted ? (
            <form
              onSubmit={handleSubmit}
              className="bg-[#050805] p-4 border border-[#1A2E1E] space-y-3"
            >
              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[#071008] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  Mobile / Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[#071008] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  rows="2"
                  placeholder="Your inquiry or Mandi question..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[#071008] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Submit Inquiry
              </button>
            </form>
          ) : (
            <div className="bg-[#050805] p-6 border border-[#1A2E1E] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#79C267] mx-auto" />
              <h4 className="text-base font-serif text-[#F2F0E8]">
                Inquiry Received!
              </h4>
              <p className="text-xs font-mono text-[#A6ADA3]">
                Our procurement officer will respond shortly.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
