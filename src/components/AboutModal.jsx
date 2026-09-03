import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Sprout,
  ShieldCheck,
  Phone,
  MapPin,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AboutModal() {
  const { aboutModalOpen, setAboutModalOpen, navigateTo } = useApp();

  if (!aboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                About AgriProcure Intelligence
              </h3>
              <p className="text-xs text-[#A5D6A7]">
                Smart India Hackathon (SIH 2026) Project
              </p>
            </div>
          </div>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 bg-[#FAF8F2] max-h-[75vh] overflow-y-auto">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2">
            <h4 className="text-sm font-black text-gray-900">
              National Vision for Farmer Empowerment
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              AgriProcure is an AI-powered predictive procurement platform
              engineered to solve physical Mandi congestion, eliminate multi-day
              queue delays, and guarantee transparent MSP transactions through
              cryptographic SHA-256 audit trails and intelligent dynamic
              scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Cryptographic Audit</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Immutable SHA-256 chain verifying weighbridge weights, moisture
                tests, and DBT payments.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                <Award className="w-4 h-4" />
                <span>Zero-Wait Lane Scheduling</span>
              </div>
              <p className="text-[11px] text-gray-600">
                AI load distribution algorithm predicting peak congestion and
                recommending low-traffic windows.
              </p>
            </div>
          </div>

          {/* 24/7 Helpline */}
          <div className="bg-[#1B4318] text-white p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9A825] text-gray-900 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#A5D6A7] block uppercase">
                  24/7 Farmer Helpline (Toll-Free)
                </span>
                <span className="text-base font-black">1800-PROCURE-AI</span>
              </div>
            </div>
            <button
              onClick={() => {
                setAboutModalOpen(false);
                navigateTo("book-slot");
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-white hover:text-[#1B4318] text-white font-bold text-xs transition-colors"
            >
              Book Slot →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
