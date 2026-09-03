import React from "react";
import { motion } from "framer-motion";
import { Globe, Check, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function LanguageModal({ isOpen, onClose }) {
  const { currentLang, setCurrentLang, t } = useApp();

  if (!isOpen) return null;

  const languages = [
    {
      code: "en",
      name: "English",
      native: "English",
      desc: "Default system language with international nomenclature",
    },
    {
      code: "hi",
      name: "Hindi",
      native: "हिंदी (Hindi)",
      desc: "राष्ट्रीय भाषा - सम्पूर्ण किसान एवं मंडी शब्दावली",
    },
    {
      code: "te",
      name: "Telugu",
      native: "తెలుగు (Telugu)",
      desc: "ప్రాంతీయ భాష - పూర్తి వ్యవసాయ మరియు మార్కెట్ సమాచారం",
    },
  ];

  const handleSelect = (code) => {
    setCurrentLang(code);
    localStorage.setItem("agri_lang", code);
    localStorage.setItem("agri_lang_chosen", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1B4318] text-white p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#F9A825] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Select Preferred Language / भाषा चुनें / భాషను ఎంచుకోండి
          </h2>
          <p className="text-xs text-[#A5D6A7] mt-1 font-semibold">
            Choose your language for a customized agricultural procurement
            experience
          </p>
        </div>

        {/* Language Options */}
        <div className="p-6 space-y-3 bg-[#FAF8F2]">
          {languages.map((lang) => {
            const isSelected = currentLang === lang.code;

            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs"
                    : "bg-white border-gray-200 hover:border-[#A5D6A7] hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-gray-900">
                      {lang.native}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">
                      ({lang.name})
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                    {lang.desc}
                  </p>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#2E7D32] text-white shadow-xs"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 text-center">
          <p className="text-[11px] font-semibold text-gray-500">
            You can change your language preference anytime from the header menu
            or profile settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
