import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sprout, Phone, Mail, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AboutContactModal({ isOpen, onClose, initialTab = 'about' }) {
  const [tab, setTab] = useState(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">About AgriProcure</h3>
              <p className="text-xs text-[#A5D6A7]">Smart India Hackathon 2026 Project</p>
            </div>
          </div>
          <button
            onClick={() => { setSubmitted(false); onClose(); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-[#FAF8F2]">
          
          {/* Tab Switcher */}
          <div className="flex bg-white p-1 rounded-2xl border border-gray-200">
            <button
              onClick={() => setTab('about')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'about' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
              }`}
            >
              Platform Story & Helpline
            </button>
            <button
              onClick={() => setTab('contact')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'contact' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
              }`}
            >
              Contact / Inquiry
            </button>
          </div>

          {tab === 'about' ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-sm font-extrabold text-gray-900">Empowering India's Farming Community</h4>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  AgriProcure (Procure Intelligence) eliminates long Mandi queue delays and brings 100% cryptographic transparency to MSP procurement through AI scheduling and SHA-256 audit trails.
                </p>
              </div>

              <div className="bg-[#1B4318] text-white p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F9A825] text-gray-900 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#A5D6A7] block">24/7 Farmer Helpline (Toll-Free)</span>
                  <span className="text-base font-extrabold">1800-PROCURE-AI</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-700">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>SHA-256 Verified</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#2E7D32]" />
                  <span>Farmer First</span>
                </div>
              </div>
            </div>
          ) : (
            !submitted ? (
              <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile / Email</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
                  <textarea
                    rows="2"
                    placeholder="Your inquiry or Mandi question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Submit Inquiry
                </button>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-green-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">Inquiry Received!</h4>
                <p className="text-xs text-gray-600">Our procurement officer will respond shortly.</p>
              </div>
            )
          )}

        </div>
      </motion.div>
    </div>
  );
}
