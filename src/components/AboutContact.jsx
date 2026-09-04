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
    <section id="about" className="py-20 bg-[#050805] text-[#E8E7DE] relative font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ABOUT US BANNER */}
        <div className="bg-[#071008] p-8 sm:p-12 border border-[#1A2E1E] mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#79C267] bg-[#0A180D] px-3 py-1 border border-[#79C267]/30">
                {t("aboutTitle")}
              </span>
              <h2 className="text-3xl font-serif text-[#F2F0E8] font-normal tracking-wide">
                {t("whatIsAgriProcure")}
              </h2>
              <p className="text-sm font-mono text-[#A6ADA3] leading-relaxed">
                {t("whatIsDesc")}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-[#E8E7DE]">
                <div className="flex items-center gap-2 bg-[#050805] px-3.5 py-2 border border-[#1A2E1E]">
                  <Sprout className="w-4 h-4 text-[#79C267]" />
                  <span>{t("farmerPortal")}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#050805] px-3.5 py-2 border border-[#1A2E1E]">
                  <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                  <span>SHA-256 Audit Ledger</span>
                </div>
                <div className="flex items-center gap-2 bg-[#050805] px-3.5 py-2 border border-[#1A2E1E]">
                  <HeartHandshake className="w-4 h-4 text-[#79C267]" />
                  <span>{t("brandTagline")}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#0A180D] border border-[#79C267]/40 text-[#F2F0E8] p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-[#79C267]/40 bg-[#164A29] text-[#79C267] flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#A6ADA3] uppercase block tracking-wider">
                    {t("helpSupport")}
                  </span>
                  <span className="text-base font-serif text-[#79C267]">
                    1800-PROCURE-AI
                  </span>
                </div>
              </div>
              <p className="text-xs font-mono text-[#A6ADA3] leading-relaxed">
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
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#79C267]">
                FAQS
              </span>
              <h3 className="text-2xl font-serif text-[#F2F0E8] font-normal mt-1">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#1A2E1E] bg-[#071008] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left flex items-center justify-between font-mono text-[#F2F0E8] text-xs hover:text-[#79C267] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#A6ADA3] transition-transform ${isOpen ? "rotate-180 text-[#79C267]" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-xs font-mono text-[#A6ADA3] leading-relaxed border-t border-[#1A2E1E] pt-3 bg-[#050805]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Contact Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#071008] p-8 border border-[#1A2E1E] space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#79C267]">
                {t("contact")}
              </span>
              <h3 className="text-xl font-serif text-[#F2F0E8] font-normal mt-1">
                {t("contactTitle")}
              </h3>
              <p className="text-xs font-mono text-[#A6ADA3] mt-1">
                {t("contactSub")}
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
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
                    className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
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
                    className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
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
                    className="w-full px-3.5 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  {t("sendMessage")}
                </button>
              </form>
            ) : (
              <div className="p-6 bg-[#050805] border border-[#1A2E1E] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#79C267] mx-auto" />
                <h4 className="text-base font-serif text-[#F2F0E8]">
                  {t("messageSentSuccess")}
                </h4>
                <p className="text-xs font-mono text-[#A6ADA3]">
                  Thank you,{" "}
                  <span className="text-[#F2F0E8]">
                    {formData.name}
                  </span>
                  .
                </p>
                <div className="text-[11px] font-mono bg-[#0A180D] border border-[#79C267]/40 text-[#79C267] p-2 font-bold">
                  Reference Ticket: {inquiryToken}
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", contact: "", message: "" });
                  }}
                  className="text-xs font-mono text-[#79C267] uppercase underline pt-2 cursor-pointer"
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
