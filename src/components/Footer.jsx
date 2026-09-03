import React from "react";
import { Sprout, Phone, Mail, MapPin, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const { navigateTo, t } = useApp();

  return (
    <footer className="bg-[#1B4318] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info (2 cols wide on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825] border border-white/15">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block">
                  {t("brandName")}
                </span>
                <span className="text-[11px] text-[#A5D6A7] font-medium">
                  {t("brandTagline")}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm font-medium">
              {t("heroDescription")}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold border border-white/15">
                {t("badgeSIH")}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F9A825]/20 text-[#F9A825] text-[11px] font-bold border border-[#F9A825]/30">
                SHA-256 Enabled
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2 text-xs text-white/75 font-medium">
              <li>
                <button
                  onClick={() => navigateTo("home")}
                  className="hover:text-[#F9A825] transition-colors"
                >
                  {t("home")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("features")}
                  className="hover:text-[#F9A825] transition-colors"
                >
                  {t("features")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("how-it-works")}
                  className="hover:text-[#F9A825] transition-colors"
                >
                  {t("howItWorks")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("about")}
                  className="hover:text-[#F9A825] transition-colors"
                >
                  {t("about")}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t("catFarmer")}
            </h4>
            <ul className="space-y-2 text-xs text-white/75 font-medium">
              <li>
                <span>{t("bookSlot")}</span>
              </li>
              <li>
                <span>{t("liveQueueTitle")}</span>
              </li>
              <li>
                <span>{t("myCropsPortfolio")}</span>
              </li>
              <li>
                <span>{t("dbtPaymentStatus")}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t("helpSupport")}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75 font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F9A825] shrink-0 mt-0.5" />
                <span>{t("addressText")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F9A825] shrink-0" />
                <span>1800-PROCURE-AI (Toll-Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F9A825] shrink-0" />
                <span>support@agriprocure.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 font-medium gap-4">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>for Indian Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
