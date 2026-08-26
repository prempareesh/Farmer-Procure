import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BarChart3, AlertCircle, Clock, Truck, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function LiveQueueModal({ isOpen, onClose }) {
  const [selectedMandi, setSelectedMandi] = useState('karnal');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mandiData = {
    karnal: {
      name: 'Karnal Grain Mandi (Haryana)',
      status: 'Optimal Queue Flow',
      statusColor: 'bg-green-100 text-green-800 border-green-300',
      queueLength: '14 Tractors / Trucks',
      estWaitTime: '18 Minutes',
      weighingBridge: '4/4 Operational (100% capacity)',
      moistureLab: '2/2 Labs Running (Latency 4 mins)',
      aiAdvice: 'Arrival condition is optimal right now. Surge predicted between 11:30 AM - 01:00 PM.',
      peakHours: [
        { time: '08:00 AM', load: 20 },
        { time: '10:00 AM', load: 35 },
        { time: '12:00 PM', load: 90 },
        { time: '02:00 PM', load: 60 },
        { time: '04:00 PM', load: 25 },
      ]
    },
    ludhiana: {
      name: 'Ludhiana Central Procurement Hub (Punjab)',
      status: 'Moderate Congestion',
      statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      queueLength: '32 Tractors / Trucks',
      estWaitTime: '42 Minutes',
      weighingBridge: '3/4 Operational (75% capacity)',
      moistureLab: '1/2 Labs Running (Lab #2 Calibrating)',
      aiAdvice: 'Book 03:00 PM slot to bypass current moisture testing lab queue.',
      peakHours: [
        { time: '08:00 AM', load: 45 },
        { time: '10:00 AM', load: 75 },
        { time: '12:00 PM', load: 95 },
        { time: '02:00 PM', load: 50 },
        { time: '04:00 PM', load: 30 },
      ]
    },
    nalgonda: {
      name: 'Nalgonda Paddy Mandi (Telangana)',
      status: 'Low Queue • Smooth Flow',
      statusColor: 'bg-green-100 text-green-800 border-green-300',
      queueLength: '6 Vehicles',
      estWaitTime: '8 Minutes',
      weighingBridge: '2/2 Operational (100% capacity)',
      moistureLab: '2/2 Labs Running (Fast Track)',
      aiAdvice: 'Excellent time for arrival. No waiting expected.',
      peakHours: [
        { time: '08:00 AM', load: 15 },
        { time: '10:00 AM', load: 30 },
        { time: '12:00 PM', load: 45 },
        { time: '02:00 PM', load: 40 },
        { time: '04:00 PM', load: 15 },
      ]
    }
  };

  const current = mandiData[selectedMandi];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Live Mandi Queue Telemetry</h3>
              <p className="text-xs text-[#A5D6A7]">Real-Time Bottleneck & SLA Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-[#FAF8F2]">
          
          {/* Mandi Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Object.keys(mandiData).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMandi(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedMandi === key
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {mandiData[key].name.split(' ')[0]} Mandi
              </button>
            ))}
          </div>

          {/* Mandi Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-gray-900">{current.name}</h4>
                <p className="text-xs text-gray-500 font-medium">GPS Telemetry Stream • Live Updates Every 30s</p>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${current.statusColor}`}>
                {current.status}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8E4D9]">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mb-1">
                  <Truck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Queue Length
                </div>
                <p className="text-sm font-black text-gray-900">{current.queueLength}</p>
              </div>

              <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8E4D9]">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Est. Wait Time
                </div>
                <p className="text-sm font-black text-[#2E7D32]">{current.estWaitTime}</p>
              </div>

              <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8E4D9]">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Weighing Bridge
                </div>
                <p className="text-xs font-bold text-gray-800">{current.weighingBridge}</p>
              </div>

              <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8E4D9]">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Moisture Lab
                </div>
                <p className="text-xs font-bold text-gray-800">{current.moistureLab}</p>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="bg-[#E8F5E9] p-3.5 rounded-xl border border-[#A5D6A7] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider block">
                  AI Prescriptive Intervention
                </span>
                <p className="text-xs text-gray-800 font-semibold mt-0.5">
                  {current.aiAdvice}
                </p>
              </div>
            </div>

            {/* Peak Hours Forecast Bar Chart */}
            <div>
              <span className="text-xs font-bold text-gray-600 mb-2 block">Today's Congestion Peak Profile</span>
              <div className="flex items-end justify-between h-24 pt-4 px-2 bg-gray-50 rounded-xl border border-gray-200">
                {current.peakHours.map((p, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                      style={{ height: `${p.load}%` }}
                      className={`w-6 rounded-t-md transition-all duration-500 ${
                        p.load > 70 ? 'bg-red-500' : p.load > 40 ? 'bg-amber-500' : 'bg-[#2E7D32]'
                      }`}
                    />
                    <span className="text-[10px] text-gray-500 font-bold mt-1">{p.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-sm shadow-md"
            >
              Close Live Tracker
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
