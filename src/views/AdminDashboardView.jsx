import React, { useState } from 'react';
import { Building, Users, Calendar, Clock, AlertTriangle, ShieldCheck, TrendingUp, Sparkles, ArrowLeft, ShieldAlert, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminDashboardView() {
  const {
    mandiCentres,
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
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bottlenecks' | 'fraud' | 'xai'

  // Summary Metrics
  const totalFarmers = 12480;
  const todayBookings = bookings.length + 140;
  const activeBottlenecks = bottlenecks.filter((b) => !b.resolved).length;
  const pendingFraudAlerts = fraudAlerts.filter((f) => f.status === 'Needs Review').length;

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
              Mandi Command Tower & AI Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1B4318] text-white text-[10px] font-black uppercase">
              SIH 2026 ADMIN
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Real-time procurement telemetry, predictive bottleneck intervention & cryptographic audit supervision
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('audit')}
            className="px-4 py-2 rounded-xl bg-[#1B4318] text-white text-xs font-bold hover:bg-[#2E7D32] flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#F9A825]" />
            <span>Audit Chain Ledger</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Farmers */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Total Farmers</span>
            <h3 className="text-2xl font-black text-gray-900">{totalFarmers.toLocaleString()}+</h3>
            <span className="text-[10px] text-[#2E7D32] font-semibold">100% Aadhaar Verified</span>
          </div>
        </div>

        {/* KPI 2: Today's Bookings */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold shrink-0">
            <Calendar className="w-6 h-6 text-[#F9A825]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Today's Bookings</span>
            <h3 className="text-2xl font-black text-gray-900">{todayBookings}</h3>
            <span className="text-[10px] text-gray-500 font-semibold">Across 4 State Mandis</span>
          </div>
        </div>

        {/* KPI 3: Current Queue & Wait */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Current Queue (P-{servingToken})</span>
            <h3 className="text-2xl font-black text-amber-600">{peopleAhead} in Line</h3>
            <span className="text-[10px] text-gray-600 font-semibold">Est. Wait: ~{estimatedWaitMins} mins</span>
          </div>
        </div>

        {/* KPI 4: Congestion Risk Level */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E0ECE0] flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
            congestionRisk === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Congestion Risk</span>
            <h3 className={`text-xl font-black ${congestionRisk === 'HIGH' ? 'text-red-700' : 'text-[#2E7D32]'}`}>
              {congestionRisk} RISK
            </h3>
            <span className="text-[10px] text-gray-500 font-semibold">AI Predictive Flow</span>
          </div>
        </div>

      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          Mandi Telemetry Overview
        </button>
        <button
          onClick={() => setActiveTab('xai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'xai' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explainable AI (XAI)</span>
        </button>
        <button
          onClick={() => setActiveTab('bottlenecks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'bottlenecks' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Bottlenecks ({activeBottlenecks})</span>
        </button>
        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'fraud' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Fraud Screening ({pendingFraudAlerts})</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Mandi Centres Intake Table */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#2E7D32]" />
              <span>Multi-Mandi Live Capacity & Intake Hubs</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Procurement Centre</th>
                    <th className="pb-3">State / District</th>
                    <th className="pb-3">Weighbridges</th>
                    <th className="pb-3">Today Reserved</th>
                    <th className="pb-3">Capacity Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mandiCentres.map((centre) => {
                    const pct = Math.round((centre.todayBooked / centre.todayCapacity) * 100);
                    return (
                      <tr key={centre.id} className="hover:bg-[#FAF8F2]">
                        <td className="py-3 font-bold text-gray-900">{centre.name}</td>
                        <td className="py-3 text-gray-600">{centre.district}, {centre.state}</td>
                        <td className="py-3 font-bold text-[#2E7D32]">{centre.activeCounters} Digital Lanes</td>
                        <td className="py-3 font-bold">{centre.todayBooked} / {centre.todayCapacity}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct > 85 ? 'bg-amber-500' : 'bg-[#2E7D32]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-bold text-[11px] text-gray-700">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Anomaly & Bottleneck Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Active Bottleneck Warnings</span>
              </h3>
              {bottlenecks.slice(0, 2).map((b) => (
                <div key={b.id} className="p-3 bg-[#FAF8F2] rounded-2xl border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900">{b.stage}</span>
                    <span className="text-red-600">{b.currentMins} min (Exp: {b.expectedMins}m)</span>
                  </div>
                  <p className="text-[11px] text-gray-600">{b.recommendation}</p>
                </div>
              ))}
              <button
                onClick={() => setActiveTab('bottlenecks')}
                className="w-full py-2 bg-[#FAF8F2] hover:bg-[#E8F5E9] text-[#2E7D32] font-bold text-xs rounded-xl border border-[#C8E6C9]"
              >
                Manage All Bottlenecks →
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 2. EXPLAINABLE AI (XAI) */}
      {activeTab === 'xai' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="text-base font-bold text-gray-900">Explainable AI (XAI) Congestion Decomposition</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Shapley-style factor breakdown explaining why current wait times are predicted at ~{estimatedWaitMins} mins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {xaiFactors.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F2] border border-gray-200 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{item.factor}</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">{item.desc}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${
                    item.positive
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. BOTTLENECK DETECTION */}
      {activeTab === 'bottlenecks' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="text-base font-bold text-gray-900">Live Bottleneck Detection & Operator Dispatch</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated comparison of expected vs actual cycle times across Quality Check, Weighing, and Procurement
            </p>
          </div>

          <div className="space-y-4">
            {bottlenecks.map((b) => (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all ${
                  b.resolved
                    ? 'bg-green-50/60 border-green-200 opacity-70'
                    : 'bg-white border-amber-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-gray-900">{b.stage}</span>
                      <span className="text-xs font-bold text-gray-500">[{b.centreName}]</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        b.resolved ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-800 animate-pulse'
                      }`}>
                        {b.resolved ? 'RESOLVED' : 'BOTTLENECK DETECTED'}
                      </span>
                    </div>

                    <div className="flex gap-4 text-xs text-gray-600 mt-1">
                      <span>Expected Time: <strong>{b.expectedMins} min</strong></span>
                      <span>Current Processing Time: <strong className="text-red-600">{b.currentMins} min</strong></span>
                    </div>

                    <p className="text-xs text-gray-700 font-semibold mt-2">
                      💡 <strong>Prescriptive Recommendation:</strong> {b.recommendation}
                    </p>
                  </div>

                  {!b.resolved && (
                    <button
                      onClick={() => resolveBottleneck(b.id)}
                      className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white text-xs font-bold shrink-0 shadow-xs"
                    >
                      Apply Recommendation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. FRAUD SCREENING */}
      {activeTab === 'fraud' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-bold text-gray-900">Fraud Screening & Anomaly Engine</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated detection of duplicate bookings, invalid workflow hops, and impossible timestamp gaps
            </p>
          </div>

          <div className="space-y-4">
            {fraudAlerts.map((fa) => (
              <div
                key={fa.id}
                className="p-5 rounded-2xl bg-white border border-red-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase">
                      {fa.severity}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900">{fa.issueType}</h4>
                    <span className="text-xs text-gray-400 font-mono">[{fa.aadhaar}]</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{fa.timestamp}</span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {fa.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="font-bold text-amber-700">Status: {fa.status}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolveFraudAlert(fa.id, 'Dismissed (False Positive)')}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 text-[11px]"
                    >
                      Dismiss Alert
                    </button>
                    <button
                      onClick={() => resolveFraudAlert(fa.id, 'Flagged & Verified')}
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 text-[11px]"
                    >
                      Freeze Token
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
