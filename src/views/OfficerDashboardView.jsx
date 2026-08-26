import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Users, Search, ShieldCheck, CheckCircle2, AlertTriangle, Clock, TrendingUp, Sparkles, Wrench, ShieldAlert, ArrowLeft, ArrowRight, FileText, Check, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OfficerDashboardView() {
  const {
    farmersList,
    bookings,
    servingToken,
    peopleAhead,
    estimatedWaitMins,
    congestionRisk,
    xaiFactors,
    bottlenecks,
    resolveBottleneck,
    fraudAlerts,
    resolveFraudAlert,
    approveFinalPayment,
    searchFarmerById,
    auditChain,
    navigateTo,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'farmers' | 'payments' | 'xai' | 'bottlenecks' | 'fraud'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerHistory, setSelectedFarmerHistory] = useState(null);

  const pendingPayments = bookings.filter((b) => b.stage === 'PAYMENT' || (!b.paymentDetails?.disbursed && b.stage !== 'BOOKED'));

  const handleSearchFarmer = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSelectedFarmerHistory(null);
      return;
    }
    const res = searchFarmerById(searchQuery);
    setSelectedFarmerHistory(res || 'NOT_FOUND');
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
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
              {t('officerPortal')} & Higher Authority Tower
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1B4318] text-white text-[10px] font-black uppercase">
              NORTH ZONE
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Supervisory procurement control, DBT payment authorizations, anomaly resolution & cryptographic oversight
          </p>
        </div>

        <button
          onClick={() => navigateTo('audit')}
          className="px-4 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-[#F9A825]" />
          <span>SHA-256 Cryptographic Ledger</span>
        </button>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Registered Farmers</span>
            <h3 className="text-2xl font-black text-gray-900">{farmersList.length + 12480}</h3>
            <span className="text-[10px] text-[#2E7D32] font-semibold">100% Aadhaar Verified</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Pending Payments</span>
            <h3 className="text-2xl font-black text-amber-600">{pendingPayments.length} Authorizations</h3>
            <span className="text-[10px] text-gray-500 font-semibold">Direct DBT Queue</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Live Queue Wait</span>
            <h3 className="text-2xl font-black text-gray-900">~{estimatedWaitMins} mins</h3>
            <span className="text-[10px] text-[#2E7D32] font-semibold">{peopleAhead} Trucks in Lane</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Fraud & Anomaly</span>
            <h3 className="text-2xl font-black text-red-700">{fraudAlerts.filter(f => f.status === 'Needs Review').length} Review Flags</h3>
            <span className="text-[10px] text-gray-500 font-semibold">Automated AI Detection</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          Overview & Telemetry
        </button>
        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'farmers' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Farmer Search & History</span>
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'payments' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>DBT Payment Approvals ({pendingPayments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bottlenecks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'bottlenecks' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Bottleneck Dispatch</span>
        </button>
        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'fraud' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Fraud Screening</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
            <h3 className="text-base font-bold text-gray-900">Multi-Mandi Live Capacity Telemetry</h3>
            <div className="divide-y divide-gray-100 text-xs">
              {bookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-[#1B4318]">Token #{b.tokenDisplay}</span>
                    <p className="font-bold text-gray-900">{b.farmerName} • {b.crop} ({b.quantity} Qtl)</p>
                    <span className="text-[10px] text-gray-500">{b.centreName}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-[10px]">
                      {b.stage}
                    </span>
                    <p className="text-[11px] font-bold text-gray-700 mt-1">₹{b.paymentDetails?.grossAmount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span>Explainable AI (XAI)</span>
              </h3>
              {xaiFactors.slice(0, 3).map((f, i) => (
                <div key={i} className="p-3 bg-[#FAF8F2] rounded-xl text-xs flex justify-between items-center">
                  <span className="font-medium text-gray-800">{f.factor}</span>
                  <span className="font-bold text-[#2E7D32]">{f.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FARMER SEARCH & COMPLETE HISTORY */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <form onSubmit={handleSearchFarmer} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by Farmer ID (e.g. FRM-2026-000123) or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B4318] text-white text-xs font-bold rounded-xl"
            >
              Search
            </button>
          </form>

          {selectedFarmerHistory && selectedFarmerHistory !== 'NOT_FOUND' && (
            <div className="p-5 bg-[#FAF8F2] rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h4 className="text-base font-extrabold text-gray-900">{selectedFarmerHistory.name}</h4>
                  <p className="text-xs font-mono text-gray-600">ID: {selectedFarmerHistory.farmerId} • Mobile: +91 {selectedFarmerHistory.mobile}</p>
                </div>
                <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-xs font-black">
                  VERIFIED KISAN
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700 block mb-2">Historical Procurement Transactions:</span>
                <div className="space-y-2">
                  {selectedFarmerHistory.history?.map((h, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-900">{h.season} - {h.crop} ({h.quantity} Qtl)</span>
                        <p className="text-[10px] text-gray-500 font-mono">Ref: {h.dbtRef}</p>
                      </div>
                      <span className="font-black text-[#2E7D32]">{h.mspPaid} (COMPLETED)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DBT PAYMENT APPROVALS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
          <h3 className="text-base font-bold text-gray-900">Direct Benefit Transfer (DBT) Authorizations</h3>
          <div className="space-y-3">
            {pendingPayments.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E0ECE0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#1B4318]">Token #{b.tokenDisplay} [{b.farmerId}]</span>
                  <h4 className="font-bold text-sm text-gray-900">{b.farmerName}</h4>
                  <p className="text-gray-600 font-medium">{b.crop} • {b.quantity} Qtl • Rate: ₹{b.paymentDetails?.mspPerQtl}/Qtl</p>
                  <p className="text-base font-black text-[#1B4318] mt-1">Total: ₹{b.paymentDetails?.grossAmount.toLocaleString()}</p>
                </div>

                {!b.paymentDetails?.disbursed ? (
                  <button
                    onClick={() => approveFinalPayment(b.id)}
                    className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs shadow-xs"
                  >
                    Authorize DBT Payout
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-green-100 text-green-800 font-bold text-xs">
                    Disbursed ({b.paymentDetails?.dbtTxnId})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BOTTLENECKS */}
      {activeTab === 'bottlenecks' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
          <h3 className="text-base font-bold text-gray-900">Bottleneck Intervention Desk</h3>
          {bottlenecks.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-[#FAF8F2] border border-amber-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-gray-900">{b.stage} ({b.centreName})</span>
                <p className="text-red-600 font-semibold">Actual Time: {b.currentMins} mins (Expected: {b.expectedMins}m)</p>
                <p className="text-gray-700 mt-1">{b.recommendation}</p>
              </div>
              {!b.resolved && (
                <button
                  onClick={() => resolveBottleneck(b.id)}
                  className="px-4 py-2 bg-[#2E7D32] text-white font-bold rounded-xl text-xs"
                >
                  Dispatch Operator
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: FRAUD SCREENING */}
      {activeTab === 'fraud' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
          <h3 className="text-base font-bold text-gray-900">Fraud & Anomaly Review</h3>
          {fraudAlerts.map((fa) => (
            <div key={fa.id} className="p-4 rounded-2xl bg-white border border-red-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-black text-red-700">{fa.issueType}</span>
                <span className="text-gray-500">{fa.timestamp}</span>
              </div>
              <p className="text-gray-700">{fa.description}</p>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => resolveFraudAlert(fa.id, 'Dismissed')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => resolveFraudAlert(fa.id, 'Confirmed Fraud')}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-xl"
                >
                  Confirm Flag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
