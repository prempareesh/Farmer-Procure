import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, TrendingUp, HelpCircle, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'OBSERVE',
      num: '01',
      title: 'OBSERVE',
      subtitle: 'Data Ingestion',
      icon: Eye,
      description: 'Collect live procurement telemetry, Mandi arrivals, vehicle registrations, and historical MSP queue data in real-time.',
      metrics: '500+ Mandi Sensors Active',
    },
    {
      id: 'PREDICT',
      num: '02',
      title: 'PREDICT',
      subtitle: 'Congestion Forecasting',
      icon: TrendingUp,
      description: 'Forecast queue length, estimated waiting times, and surge spikes up to 72 hours in advance using predictive AI algorithms.',
      metrics: '94.8% Congestion Accuracy',
    },
    {
      id: 'EXPLAIN',
      num: '03',
      title: 'EXPLAIN',
      subtitle: 'Root Cause Analytics',
      icon: HelpCircle,
      description: 'Show explainable insights into why congestion may occur — whether due to weighing delay, moisture testing, or unloading equipment.',
      metrics: 'XAI Bottleneck Breakdown',
    },
    {
      id: 'IDENTIFY',
      num: '04',
      title: 'IDENTIFY',
      subtitle: 'Operational Bottlenecks',
      icon: AlertTriangle,
      description: 'Automatically detect operational bottlenecks in real time and notify procurement officers before queues stall.',
      metrics: '< 2 Min Alert Latency',
    },
    {
      id: 'ACT',
      num: '05',
      title: 'ACT',
      subtitle: 'Smart Slot Allocation',
      icon: Zap,
      description: 'Recommend optimal slot times to farmers, dynamically balancing Mandi loads and eliminating hours of waiting in line.',
      metrics: 'Smooth Arrival Distribution',
    },
    {
      id: 'VERIFY',
      num: '06',
      title: 'VERIFY',
      subtitle: 'Tamper-Evident Chain',
      icon: CheckCircle2,
      description: 'Maintain immutable, tamper-evident SHA-256 digital audit trails for every transaction to guarantee trust & MSP compliance.',
      metrics: '100% Cryptographic Audit',
    },
  ];

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
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">How Procure Intelligence Works</h3>
              <p className="text-xs text-[#A5D6A7]">6-Stage AI Procurement Pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-[#FAF8F2]">
          
          {/* Step Selector Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    isActive
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm font-bold scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 text-xs'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[10px] font-bold block">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Content */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-lg">
                Stage {steps[activeStep].num}: {steps[activeStep].title}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {steps[activeStep].subtitle}
              </span>
            </div>

            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              {steps[activeStep].description}
            </p>

            <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E8E4D9] flex items-center justify-between text-xs font-bold">
              <span className="text-gray-600">Metric Status:</span>
              <span className="text-[#2E7D32]">{steps[activeStep].metrics}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4318]"
            >
              Next Stage
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
