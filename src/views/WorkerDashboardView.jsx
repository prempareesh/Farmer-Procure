import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Search, QrCode, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, ShieldCheck, Upload, FileText, User } from 'lucide-react';
import { useApp, WORKFLOW_STAGES } from '../context/AppContext';

export default function WorkerDashboardView() {
  const {
    user,
    bookings,
    workerAssignedStage,
    setWorkerAssignedStage,
    approveStage,
    rejectStage,
    searchFarmerById,
    navigateTo,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedFarmer, setSearchedFarmer] = useState(null);

  // Rejection Modal State
  const [rejectingBookingId, setRejectingBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Moisture content exceeds 17% threshold');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [proofFileName, setProofFileName] = useState('lab_moisture_sensor_report.pdf');

  // Filter tasks for worker's assigned stage or all
  const filteredBookings = bookings.filter((b) => {
    if (workerAssignedStage === 'ALL') return true;
    return b.stage === workerAssignedStage;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchedFarmer(null);
      return;
    }
    const result = searchFarmerById(searchQuery);
    setSearchedFarmer(result || 'NOT_FOUND');
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingBookingId || !rejectReason) return;
    await rejectStage(rejectingBookingId, workerAssignedStage, {
      reason: rejectReason,
      remarks: rejectRemarks || 'Stage rejected based on physical inspection standards.',
      proofImage: proofFileName,
    });
    setRejectingBookingId(null);
    setRejectRemarks('');
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo('home')}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#2E7D32] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {t('workerPortal')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1B4318] text-white text-[10px] font-black uppercase">
              STAFF DESK
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Logged in as {user?.name || 'Sukhvinder Singh'} • Mandi Staff ID: {user?.id || 'WRK-HR-108'}
          </p>
        </div>

        {/* Assigned Stage Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 pl-2">Assigned Duty:</span>
          <select
            value={workerAssignedStage}
            onChange={(e) => setWorkerAssignedStage(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#E8F5E9] text-[#1B4318] border border-[#A5D6A7] focus:outline-none"
          >
            <option value="ALL">All Stages Desk</option>
            <option value="ARRIVED">Gate Arrival Verification</option>
            <option value="WEIGHING">Weighbridge Loading (Tare/Gross)</option>
            <option value="QUALITY_CHECK">Quality Lab (Moisture & Foreign Matter)</option>
            <option value="PROCUREMENT">Procurement Voucher Recording</option>
          </select>
        </div>
      </div>

      {/* Farmer Search & QR Scanner Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#2E7D32]" />
          <span>Search Farmer by Permanent ID (FRM-2026-XXXXXX) or Mobile</span>
        </h3>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. FRM-2026-000123 or 9876543210"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#2E7D32] bg-[#FAF8F2]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            Search Profile
          </button>
        </form>

        {/* Searched Farmer Result */}
        {searchedFarmer && searchedFarmer !== 'NOT_FOUND' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#E8F5E9]/60 rounded-2xl border border-[#A5D6A7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4318] text-white flex items-center justify-center font-bold">
                <User className="w-5 h-5 text-[#F9A825]" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900">{searchedFarmer.name}</h4>
                <p className="text-gray-600 font-mono text-[11px]">ID: {searchedFarmer.farmerId} • Mobile: +91 {searchedFarmer.mobile}</p>
                <p className="text-gray-500 text-[10px]">{searchedFarmer.village}, {searchedFarmer.district} ({searchedFarmer.state})</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white text-[#2E7D32] font-black text-[10px] border border-[#A5D6A7]">
                {searchedFarmer.crops?.length || 4} Registered Crops
              </span>
            </div>
          </motion.div>
        )}

        {searchedFarmer === 'NOT_FOUND' && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            No farmer found matching query "{searchQuery}". Please check the ID.
          </div>
        )}
      </div>

      {/* Assigned Tasks Queue Table */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Pending Queue for {workerAssignedStage === 'ALL' ? 'All Desks' : workerAssignedStage} Stage
            </h3>
            <p className="text-xs text-gray-500">
              {filteredBookings.length} vehicles currently queued for physical processing
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle2 className="w-10 h-10 mx-auto text-[#2E7D32] mb-2" />
              <p className="text-xs font-bold text-gray-700">No pending tokens in this stage.</p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E0ECE0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-[#1B4318]">Token #{b.tokenDisplay}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-[10px] border border-[#A5D6A7]">
                      {b.stage}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">[{b.farmerId}]</span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900">{b.farmerName}</h4>
                  <p className="text-xs text-gray-600 font-medium">
                    Crop: <strong>{b.crop}</strong> • Quantity: <strong className="text-[#2E7D32]">{b.quantity} Quintals</strong> • Center: {b.centreName}
                  </p>
                </div>

                {/* Worker Decision Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => approveStage(b.id, b.stage)}
                    className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Stage</span>
                  </button>

                  <button
                    onClick={() => setRejectingBookingId(b.id)}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Stage</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mandatory Rejection Reason & Proof Modal */}
      <AnimatePresence>
        {rejectingBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden"
            >
              <div className="bg-red-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="text-base font-bold">Mandatory Rejection Documentation</h3>
                    <p className="text-xs text-red-100">Audit compliance requires reason & supporting proof</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRejectSubmit} className="p-6 space-y-4 bg-[#FAF8F2]">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Standard Rejection Reason *
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Moisture content exceeds 17% threshold">Moisture content exceeds 17% threshold</option>
                    <option value="Foreign matter / husk exceeds 2% permissible limit">Foreign matter / husk exceeds 2% permissible limit</option>
                    <option value="Gross vs tare weight discrepancy exceeds 50kg">Gross vs tare weight discrepancy exceeds 50kg</option>
                    <option value="Grain discolored or insect damaged">Grain discolored or insect damaged</option>
                    <option value="Aadhaar KYC mismatch with registered slot profile">Aadhaar KYC mismatch with registered slot profile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Detailed Inspection Remarks *
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Enter physical inspection notes and sensor readings..."
                    value={rejectRemarks}
                    onChange={(e) => setRejectRemarks(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Supporting Proof Document / Photo *
                  </label>
                  <div className="p-3 bg-white rounded-xl border border-dashed border-gray-300 flex items-center justify-between text-xs font-mono">
                    <span className="truncate text-gray-600">{proofFileName}</span>
                    <span className="px-2 py-0.5 rounded bg-green-100 text-[#2E7D32] font-bold text-[10px]">ATTACHED</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setRejectingBookingId(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
                  >
                    Confirm Rejection & Log SHA-256
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
