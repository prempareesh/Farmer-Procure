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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 text-center border-b border-[#1A2E1E]">
          <div className="w-10 h-10 border border-[#79C267]/30 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center mx-auto mb-3">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-normal tracking-wide text-[#F2F0E8]">
            Select Language / भाषा चुनें / భాషను ఎంచుకోండి
          </h2>
          <p className="text-[11px] font-mono text-[#A6ADA3] mt-1">
            Choose your language for precision procurement telemetry
          </p>
        </div>

        {/* Language Options */}
        <div className="p-6 space-y-3 bg-[#071008] font-mono">
          {languages.map((lang) => {
            const isSelected = currentLang === lang.code;

            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-4 border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-[#0A180D] border-[#79C267]/60 text-[#F2F0E8]"
                    : "bg-[#050805] border-[#1A2E1E] text-[#A6ADA3] hover:border-[#79C267]/30 hover:text-[#F2F0E8]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-serif text-[#F2F0E8]">
                      {lang.native}
                    </span>
                    <span className="text-xs font-mono text-[#79C267]">
                      ({lang.name})
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#A6ADA3] mt-1">
                    {lang.desc}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#164A29] border-[#79C267]/40 text-[#79C267]"
                      : "bg-[#050805] border-[#1A2E1E] text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0A180D] border-t border-[#1A2E1E] text-center font-mono">
          <p className="text-[11px] text-[#A6ADA3]">
            Language preferences persist across sessions and mobile views.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
