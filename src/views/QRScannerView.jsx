import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Scan, CheckCircle2, ShieldCheck, ArrowLeft, ArrowRight, Download, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function QRScannerView() {
  const { activeBooking, bookings, processQRCheckIn, navigateTo } = useApp();
  const currentBooking = activeBooking || bookings[0];

  const [scanInput, setScanInput] = useState('');
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
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('queue')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Queue</span>
        </button>

        <button
          onClick={() => navigateTo('audit')}
          className="px-3.5 py-1.5 rounded-xl bg-[#1B4318] text-white text-xs font-bold hover:bg-[#2E7D32]"
        >
          View SHA-256 Chain →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Farmer Digital QR Mandi Pass */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-5 text-center flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-black text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-lg">
                DIGITAL MANDI PASS
              </span>
              <span className="text-xs font-bold font-mono text-gray-700">
                {currentBooking?.id || 'BK-2026-8812'}
              </span>
            </div>

            <div className="my-6 p-5 bg-[#FAF8F2] rounded-2xl border border-gray-200 inline-block mx-auto shadow-xs">
              <QrCode className="w-36 h-36 text-[#1B4318] mx-auto" />
              <p className="text-[10px] font-mono text-gray-500 mt-2 font-bold">
                TOKEN #{currentBooking?.tokenNumber || 125}
              </p>
            </div>

            <div className="text-left bg-[#FAF8F2] p-4 rounded-xl border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Farmer:</span>
                <span className="font-bold text-gray-900">{currentBooking?.farmerName || 'Rameshwar Singh'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Crop:</span>
                <span className="font-bold text-gray-900">{currentBooking?.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity:</span>
                <span className="font-bold text-[#2E7D32]">{currentBooking?.quantity} Quintals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Stage:</span>
                <span className="font-bold text-[#1B4318] uppercase">{currentBooking?.stage}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-semibold pt-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>Tamper-Proof Cryptographic QR Token</span>
          </div>
        </div>

        {/* 2. Gate Officer QR Scanner Simulator */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4318] text-white flex items-center justify-center">
                <Scan className="w-5 h-5 text-[#F9A825]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Mandi Gate QR Check-In</h3>
                <p className="text-xs text-gray-500">Simulate physical scanner at entrance booth</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Scanning the farmer's QR pass automatically verifies the token payload, confirms physical gate arrival, and triggers state transition to <strong>ARRIVED</strong> with a SHA-256 block hash.
            </p>

            {/* Scanner Viewport Simulation */}
            <div className="p-6 bg-[#1A2619] rounded-2xl text-center space-y-3 relative overflow-hidden border border-green-800">
              <div className="w-20 h-20 border-2 border-dashed border-[#F9A825] rounded-xl mx-auto flex items-center justify-center animate-pulse">
                <Camera className="w-8 h-8 text-white/80" />
              </div>
              <p className="text-xs font-bold text-[#A5D6A7]">
                {scanning ? 'Decoding QR Payload & Verifying Signature...' : 'Mandi Gate Scanner Ready'}
              </p>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 rounded-2xl border border-green-200 text-xs text-green-900 space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-[#2E7D32]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Gate Arrival Confirmed!</span>
                </div>
                <p className="text-[11px] text-gray-700">
                  Token #{scanResult.booking.tokenNumber} is now marked as <strong>ARRIVED</strong>. Direct to Weighbridge Counter #2.
                </p>
              </motion.div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>{scanning ? 'Scanning...' : 'Simulate Mandi Gate Scan'}</span>
            </button>

            <button
              onClick={() => navigateTo('queue')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
            >
              View Updated Workflow Progress →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
