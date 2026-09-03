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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in selection:bg-[#2E7D32] selection:text-white print:p-0 print:bg-white">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden print:shadow-none print:border-none print:w-full">
        {/* Top Header */}
        <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between print:bg-white print:text-black print:border-b print:border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825] print:border">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                {t("brandName")}
              </h3>
              <p className="text-[11px] text-[#A5D6A7] font-medium print:text-gray-600">
                {t("officialReceiptHeader")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer print:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-[#FAFBF8] print:max-h-none print:p-4">
          {/* Status Stamp */}
          <div className="bg-[#E8F5E9] border border-[#A5D6A7] p-3 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-black text-[#1B4318] flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              {t("transactionCompletedBadge")}
            </span>
            <span className="text-[10px] font-mono text-gray-500 font-bold">
              {bookingId}
            </span>
          </div>

          {/* Farmer & Crop Details Grid */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  {t("farmerRole")}
                </span>
                <span className="font-extrabold text-[#111827] text-sm">
                  {farmerName}
                </span>
                <span className="text-[10px] font-mono text-gray-500 block">
                  {farmerId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  {t("tokenNumberLabel")}
                </span>
                <span className="font-black text-2xl text-[#1B4318]">
                  {tokenDisplay}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  {t("cropLabel")}
                </span>
                <span className="font-bold text-[#111827]">{crop}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  {t("bookedQuantityLabel")}
                </span>
                <span className="font-bold text-gray-700">
                  {bookedQuantity} Qtl
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  {t("finalWeighedQuantityLabel")}
                </span>
                <span className="font-black text-[#2E7D32] text-sm">
                  {weighedQuantity} Qtl
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  {t("targetMandiCentre")}
                </span>
                <span className="font-bold text-gray-800 text-[11px]">
                  {centreName}
                </span>
              </div>
            </div>
          </div>

          {/* MSP Payment Box */}
          <div className="bg-[#1B4318] text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#C8E6C9] font-bold uppercase block">
                {t("totalMspAmountLabel")}
              </span>
              <div className="text-2xl font-black text-[#F9A825]">
                ₹{grossAmount.toLocaleString()}
              </div>
              <span className="text-[10px] text-[#C8E6C9] font-mono">
                {dbtTxnId}
              </span>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black uppercase">
                {t("paymentCompletedBadge")}
              </span>
              <p className="text-[10px] text-white/70 mt-1">{completedAt}</p>
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
              {t("timelineSummary")}
            </span>
            <div className="space-y-1.5 text-[11px]">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-gray-700 py-0.5"
                >
                  <span className="flex items-center gap-1.5 font-medium text-gray-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{item.label || item.stage}</span>
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">
                    {item.time || "Completed"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Hash & QR Stamp */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[#1B4318] font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#F9A825]" />
                <span>{t("auditTrailBannerText")}</span>
              </div>
              <p className="text-[9px] font-mono text-gray-400 truncate">
                {booking.createdHash ||
                  "0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a"}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-[#1B4318]" />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t("printReceipt")}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t("downloadReceipt")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
