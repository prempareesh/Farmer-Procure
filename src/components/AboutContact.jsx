import React, { useState } from "react";
import {
  Sprout,
  Phone,
  ChevronDown,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AboutContact() {
  const { t } = useApp();
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryToken, setInquiryToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });

  const faqs = [
    {
      q: "How does AgriProcure predict Mandi queue waiting times?",
      a: "Our AI model analyzes real-time gate telemetry, historical harvest arrival curves, and moisture-testing lab speeds to forecast queue congestion up to 72 hours in advance.",
    },
    {
      q: "Is slot booking free for farmers?",
      a: "Yes, 100% free! Farmers can book slots via Web, Mobile, or at any local Mandi Help Centre without any fee.",
    },
    {
      q: "What if a farmer arrives late for their booked slot window?",
      a: "Our algorithm dynamically buffers arrival windows. Late arrivals are automatically assigned the next available priority buffer slot.",
    },
    {
      q: "How does SHA-256 tamper-evident verification work?",
      a: "Every booked slot and weighing slip generates an immutable cryptographic hash, ensuring 100% transparent payment disbursement.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = "INQ-2026-" + Math.floor(1000 + Math.random() * 9000);
    setInquiryToken(token);
    setSubmitted(true);
  };

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ABOUT US BANNER */}
        <div className="bg-[#FAF8F2] rounded-3xl p-8 sm:p-12 border border-[#E8E4D9] mb-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#A5D6A7]">
                {t("aboutTitle")}
              </span>
              <h2 className="text-3xl font-extrabold text-[#1B1B1B]">
                {t("whatIsAgriProcure")}
              </h2>
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                {t("whatIsDesc")}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs">
                  <Sprout className="w-4 h-4 text-[#2E7D32]" />
                  <span>{t("farmerPortal")}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>SHA-256 Audit Ledger</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs">
                  <HeartHandshake className="w-4 h-4 text-[#2E7D32]" />
                  <span>{t("brandTagline")}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#1B4318] text-white p-6 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F9A825] flex items-center justify-center text-gray-900 font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#A5D6A7] block">
                    {t("helpSupport")}
                  </span>
                  <span className="text-base font-extrabold">
                    1800-PROCURE-AI
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                {t("addressText")}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ & CONTACT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact">
          {/* LEFT: FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32]">
                FAQS
              </span>
              <h3 className="text-2xl font-extrabold text-[#1B1B1B] mt-1">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-gray-900 text-sm hover:text-[#2E7D32] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180 text-[#2E7D32]" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Contact Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF8F2] p-8 rounded-3xl border border-[#E8E4D9] space-y-5 shadow-sm">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32]">
                {t("contact")}
              </span>
              <h3 className="text-xl font-extrabold text-[#1B1B1B] mt-1">
                {t("contactTitle")}
              </h3>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {t("contactSub")}
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    {t("nameLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rameshwar Singh"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    {t("mobileLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Tell us your Mandi or crop requirement..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  {t("sendMessage")}
                </button>
              </form>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-green-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto" />
                <h4 className="text-base font-bold text-gray-900">
                  {t("messageSentSuccess")}
                </h4>
                <p className="text-xs text-gray-600">
                  Thank you,{" "}
                  <span className="font-bold text-gray-900">
                    {formData.name}
                  </span>
                  .
                </p>
                <div className="text-[11px] font-mono bg-[#E8F5E9] text-[#1B4318] p-2 rounded-lg font-bold">
                  Reference Ticket: {inquiryToken}
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", contact: "", message: "" });
                  }}
                  className="text-xs text-[#2E7D32] font-bold underline pt-2"
                >
                  {t("sendMessage")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
