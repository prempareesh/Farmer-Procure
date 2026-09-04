import React from "react";
import { Sprout, Globe } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HomeFooter() {
  const { navigateTo, currentLang, setLanguageModalOpen } = useApp();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#050705] text-[#F1EFE6] border-t border-[#12351F]/40 py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A9B0A5]">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#12351F] border border-[#1D5A2D] flex items-center justify-center text-[#79C267]">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif text-lg font-normal text-[#F1EFE6]">
            AgriProcure
          </span>
          <span className="font-mono text-[11px] text-[#A9B0A5]">
            © 2026 AgriProcure. All rights reserved.
          </span>
        </div>

        {/* Minimal Navigation */}
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => scrollToSection("problem")}
            className="hover:text-[#F1EFE6] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("solution")}
            className="hover:text-[#F1EFE6] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hover:text-[#F1EFE6] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("get-started")}
            className="hover:text-[#F1EFE6] transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* Language selector trigger */}
        <button
          onClick={() => setLanguageModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B120C] border border-[#12351F] text-[#F1EFE6] hover:border-[#79C267]/40 transition-colors font-mono text-xs cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#79C267]" />
          <span className="uppercase">{currentLang}</span>
        </button>
      </div>
    </footer>
  );
}
