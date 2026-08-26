import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, AlertCircle, ShieldCheck, Activity, Filter, Search, ChevronRight } from 'lucide-react';

export default function DashboardPreview({ onBookSlotClick }) {
  const [activeTab, setActiveTab] = useState('telemetry');

  const auditLogs = [
    { id: 'TX-9021', time: '10:42 AM', farmer: 'Sukhdev Singh', mandi: 'Karnal Central', crop: 'Paddy Grade A', hash: '0x8f2a...4b12', status: 'VERIFIED' },
    { id: 'TX-9020', time: '10:38 AM', farmer: 'Anand Verma', mandi: 'Ludhiana Hub', crop: 'Wheat Sharbati', hash: '0x3c9e...9a41', status: 'VERIFIED' },
    { id: 'TX-9019', time: '10:31 AM', farmer: 'Kavita Reddy', mandi: 'Nalgonda Main', crop: 'Paddy Grade A', hash: '0x1d7b...0e88', status: 'VERIFIED' },
    { id: 'TX-9018', time: '10:25 AM', farmer: 'Gurpreet Kaur', mandi: 'Patiala Mandi', crop: 'Mustard', hash: '0x5e4f...2c11', status: 'VERIFIED' },
  ];

  return (
    <section id="dashboard" className="py-20 bg-[#FAF8F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#A5D6A7]">
            AI CONTROL TOWER
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#1B1B1B]">
            Predictive Mandi Dashboard
          </h2>
          <p className="mt-3 text-base text-gray-600 font-medium">
            Real-time queue analytics, automated bottleneck isolation, and tamper-evident audit trails at your fingertips.
          </p>
        </div>

        {/* Dashboard Frame Container */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
          
          {/* Dashboard Header Bar */}
          <div className="bg-[#1B4318] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825]">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Procure Intelligence Command Tower</span>
                <span className="text-[11px] text-[#A5D6A7]">National Procurement Telemetry • Node #42-Karnal</span>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'telemetry' ? 'bg-white text-[#1B4318] shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Queue Telemetry
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'audit' ? 'bg-white text-[#1B4318] shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                SHA-256 Audit Chain
              </button>
            </div>
          </div>

          {/* Tab Content 1: Telemetry */}
          {activeTab === 'telemetry' ? (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#E8E4D9]">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                    <span>Active Queued Tractors</span>
                    <Activity className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">42 Vehicles</div>
                  <span className="text-[11px] text-[#2E7D32] font-semibold">↓ 35% vs Yesterday Peak</span>
                </div>

                <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#E8E4D9]">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                    <span>Avg Gate-to-Unload Latency</span>
                    <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div className="text-2xl font-black text-[#2E7D32]">18.4 Mins</div>
                  <span className="text-[11px] text-[#2E7D32] font-semibold">Target SLA &lt; 25 Mins</span>
                </div>

                <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#E8E4D9]">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                    <span>Automated Interventions</span>
                    <AlertCircle className="w-4 h-4 text-[#F9A825]" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">12 Dispatched</div>
                  <span className="text-[11px] text-[#B78103] font-semibold">3 Active Bottlenecks Fixed</span>
                </div>
              </div>

              {/* Live Mandi Operations Grid */}
              <div className="bg-[#F4F9F4] p-5 rounded-2xl border border-[#C8E6C9] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-extrabold text-gray-900">Optimal Slot Recommendation Engine Active</h4>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Surge protection algorithms are actively staggering 15-minute farmer arrival tokens.
                  </p>
                </div>
                <button
                  onClick={onBookSlotClick}
                  className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Test AI Slot Allocation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Tab Content 2: Cryptographic SHA-256 Audit Chain */
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Live Immutable Transaction Log</span>
                <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SHA-256 Verified
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase font-bold bg-gray-50/50">
                      <th className="py-3 px-4">Token ID</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Farmer Name</th>
                      <th className="py-3 px-4">Mandi Hub</th>
                      <th className="py-3 px-4">Crop</th>
                      <th className="py-3 px-4">SHA-256 Hash</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#FAF8F2]">
                        <td className="py-3 px-4 font-bold text-gray-900">{log.id}</td>
                        <td className="py-3 px-4 text-gray-600">{log.time}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{log.farmer}</td>
                        <td className="py-3 px-4 text-gray-700">{log.mandi}</td>
                        <td className="py-3 px-4 text-gray-700">{log.crop}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#2E7D32]">{log.hash}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px]">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
