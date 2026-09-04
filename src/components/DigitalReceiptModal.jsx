import React from "react";
import {
  X,
  CheckCircle2,
  QrCode,
  Download,
  Printer,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function DigitalReceiptModal({ isOpen, onClose, booking }) {
  const { t } = useApp();

  if (!isOpen || !booking) return null;

  const farmerName = booking.farmerName || "Rameshwar Singh";
  const farmerId = booking.farmerId || "FRM-2026-000123";
  const crop = booking.crop || "Paddy (Basmati 1121)";
  const bookedQuantity = booking.quantity || 25;
  const weighedQuantity =
    booking.weighedQuantity ||
    (booking.quantity ? booking.quantity + 0.18 : 25.18);
  const centreName = booking.centreName || "Karnal Central Grain Mandi";
  const tokenDisplay = booking.tokenDisplay || "P-147";
  const bookingId = booking.booking_id || booking.id || "BK-2026-000147";
  const grossAmount =
    booking.paymentDetails?.grossAmount || Math.round(weighedQuantity * 2320);
  const dbtTxnId = booking.paymentDetails?.dbtTxnId || "TXN-2026-000147";
  const completedAt =
    booking.paymentDetails?.disbursedAt ||
    new Date().toLocaleDateString() + " 02:47 PM";
  const createdTime = booking.createdAt || "02:00 PM";

  const history = booking.stageHistory || [
    { stage: "BOOKED", label: t("stageBooking"), time: createdTime },
    { stage: "ARRIVED", label: t("stageArrived"), time: "02:07 PM" },
    { stage: "QUALITY_CHECK", label: t("stageQuality"), time: "02:12 PM" },
    { stage: "WEIGHING", label: t("stageWeighing"), time: "02:24 PM" },
    { stage: "PROCUREMENT", label: t("stageProcurement"), time: "02:35 PM" },
    { stage: "PAYMENT", label: t("stagePayment"), time: "02:47 PM" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in selection:bg-[#79C267] selection:text-[#050805] print:p-0 print:bg-white">
      <div className="relative w-full max-w-lg bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] overflow-hidden print:shadow-none print:border-none print:w-full print:bg-white print:text-black">
        {/* Top Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 border-b border-[#1A2E1E] flex items-center justify-between print:bg-white print:text-black print:border-b print:border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267] print:border">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal tracking-wide text-[#F2F0E8]">
                {t("brandName")}
              </h3>
              <p className="text-[11px] font-mono text-[#A6ADA3] print:text-gray-600">
                {t("officialReceiptHeader")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer print:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-[#071008] font-mono print:max-h-none print:p-4 print:bg-white">
          {/* Status Stamp */}
          <div className="bg-[#0A180D] border border-[#79C267]/40 p-3 flex items-center justify-between text-xs">
            <span className="font-mono text-[#79C267] flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
              {t("transactionCompletedBadge")}
            </span>
            <span className="text-[10px] font-mono text-[#A6ADA3]">
              {bookingId}
            </span>
          </div>

          {/* Farmer & Crop Details Grid */}
          <div className="bg-[#050805] p-4 border border-[#1A2E1E] space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 border-b border-[#1A2E1E] pb-3">
              <div>
                <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                  {t("farmerRole")}
                </span>
                <span className="font-serif text-[#F2F0E8] text-base block mt-0.5">
                  {farmerName}
                </span>
                <span className="text-[10px] font-mono text-[#79C267]">
                  {farmerId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                  {t("tokenNumberLabel")}
                </span>
                <span className="font-serif text-2xl text-[#79C267]">
                  {tokenDisplay}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                  {t("cropLabel")}
                </span>
                <span className="font-mono text-[#F2F0E8]">{crop}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                  {t("bookedQuantityLabel")}
                </span>
                <span className="font-mono text-[#E8E7DE]">
                  {bookedQuantity} Qtl
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                  {t("finalWeighedQuantityLabel")}
                </span>
                <span className="font-mono text-[#79C267] text-sm font-bold">
                  {weighedQuantity} Qtl
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                  {t("targetMandiCentre")}
                </span>
                <span className="font-mono text-[#E8E7DE] text-[11px]">
                  {centreName}
                </span>
              </div>
            </div>
          </div>

          {/* MSP Payment Box */}
          <div className="bg-[#164A29]/30 border border-[#79C267]/30 text-[#F2F0E8] p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                {t("totalMspAmountLabel")}
              </span>
              <div className="text-2xl font-serif text-[#79C267] mt-0.5">
                ₹{grossAmount.toLocaleString()}
              </div>
              <span className="text-[10px] font-mono text-[#A6ADA3]">
                {dbtTxnId}
              </span>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 border border-[#79C267]/40 bg-[#0A180D] text-[#79C267] text-[10px] font-mono uppercase tracking-wider">
                {t("paymentCompletedBadge")}
              </span>
              <p className="text-[10px] font-mono text-[#A6ADA3] mt-1.5">{completedAt}</p>
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="bg-[#050805] p-4 border border-[#1A2E1E] space-y-2 text-xs">
            <span className="text-[10px] text-[#A6ADA3] uppercase tracking-wider block mb-1">
              {t("timelineSummary")}
            </span>
            <div className="space-y-1.5 text-[11px]">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[#E8E7DE] py-0.5"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[#E8E7DE]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#79C267]" />
                    <span>{item.label || item.stage}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#A6ADA3]">
                    {item.time || "Completed"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Hash & QR Stamp */}
          <div className="bg-[#050805] p-3.5 border border-[#1A2E1E] flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[#79C267] font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                <span>{t("auditTrailBannerText")}</span>
              </div>
              <p className="text-[9px] font-mono text-[#A6ADA3] truncate">
                {booking.createdHash ||
                  "0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a"}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#0A180D] border border-[#1A2E1E] flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-[#79C267]" />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#0A180D] border-t border-[#1A2E1E] flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t("printReceipt")}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t("downloadReceipt")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
