import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  Scan,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Camera,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function QRScannerView() {
  const { activeBooking, bookings, processQRCheckIn, navigateTo } = useApp();
  const currentBooking = activeBooking || bookings[0];

  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = async () => {
    if (!currentBooking) return;
    setScanning(true);
    setTimeout(async () => {
      const res = await processQRCheckIn(currentBooking.qrData);
      setScanning(false);
      setScanResult(res);
    }, 800);
  };

  return (
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 font-mono">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo("queue")}
          className="flex items-center gap-1.5 text-xs font-mono text-[#A6ADA3] hover:text-[#79C267] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Queue</span>
        </button>

        <button
          onClick={() => navigateTo("audit")}
          className="px-3.5 py-1.5 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider cursor-pointer"
        >
          View SHA-256 Chain →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Farmer Digital QR Mandi Pass */}
        <div className="bg-[#071008] p-6 border border-[#1A2E1E] space-y-5 text-center flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#79C267] bg-[#0A180D] px-2.5 py-1 border border-[#79C267]/30">
                DIGITAL MANDI PASS
              </span>
              <span className="text-xs font-mono text-[#A6ADA3]">
                {currentBooking?.id || "BK-2026-8812"}
              </span>
            </div>

            <div className="my-6 p-5 bg-[#050805] border border-[#1A2E1E] inline-block mx-auto">
              <QrCode className="w-36 h-36 text-[#79C267] mx-auto" />
              <p className="text-[10px] font-mono text-[#A6ADA3] mt-2">
                TOKEN #{currentBooking?.tokenNumber || 125}
              </p>
            </div>

            <div className="text-left bg-[#050805] p-4 border border-[#1A2E1E] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#A6ADA3]">Farmer:</span>
                <span className="font-serif text-[#F2F0E8]">
                  {currentBooking?.farmerName || "Rameshwar Singh"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6ADA3]">Crop:</span>
                <span className="text-[#F2F0E8]">
                  {currentBooking?.crop}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6ADA3]">Quantity:</span>
                <span className="text-[#79C267]">
                  {currentBooking?.quantity} Quintals
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6ADA3]">Current Stage:</span>
                <span className="text-[#79C267] uppercase">
                  {currentBooking?.stage}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A6ADA3] font-mono pt-2">
            <ShieldCheck className="w-4 h-4 text-[#79C267]" />
            <span>Tamper-Proof Cryptographic QR Token</span>
          </div>
        </div>

        {/* 2. Gate Officer QR Scanner Simulator */}
        <div className="bg-[#071008] p-6 border border-[#1A2E1E] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#79C267]/40 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-[#F2F0E8]">
                  Mandi Gate QR Check-In
                </h3>
                <p className="text-[11px] font-mono text-[#A6ADA3]">
                  Simulate physical scanner at entrance booth
                </p>
              </div>
            </div>

            <p className="text-xs font-mono text-[#A6ADA3] leading-relaxed">
              Scanning farmer's QR pass automatically verifies token payload, confirms gate arrival, and triggers state transition to <strong>ARRIVED</strong> with SHA-256 hash.
            </p>

            {/* Scanner Viewport Simulation */}
            <div className="p-6 bg-[#050805] border border-[#1A2E1E] text-center space-y-3 relative overflow-hidden">
              <div className="w-16 h-16 border-2 border-dashed border-[#79C267] mx-auto flex items-center justify-center animate-pulse">
                <Camera className="w-6 h-6 text-[#79C267]" />
              </div>
              <p className="text-xs font-mono text-[#79C267]">
                {scanning
                  ? "Decoding QR Payload & Verifying Signature..."
                  : "Mandi Gate Scanner Ready"}
              </p>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#0A180D] border border-[#79C267]/40 text-xs font-mono text-[#79C267] space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-[#79C267]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gate Arrival Confirmed!</span>
                </div>
                <p className="text-[11px] text-[#A6ADA3]">
                  Token #{scanResult.booking.tokenNumber} is now marked as{" "}
                  <strong className="text-[#F2F0E8]">ARRIVED</strong>. Direct to Weighbridge Counter #2.
                </p>
              </motion.div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
            >
              <Scan className="w-4 h-4 text-[#79C267]" />
              <span>
                {scanning ? "Scanning..." : "Simulate Mandi Gate Scan"}
              </span>
            </button>

            <button
              onClick={() => navigateTo("queue")}
              className="w-full py-2.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              View Updated Workflow Progress →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
