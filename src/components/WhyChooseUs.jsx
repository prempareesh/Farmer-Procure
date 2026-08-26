import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function WhyChooseUs() {
  const traditionalPoints = [
    'Long waiting times (3 to 8 hours stuck at Mandi gates)',
    'Reactive operations & unorganized vehicle overcrowding',
    'Zero congestion visibility before arriving at Mandi',
    'Manual bottleneck detection prone to delays & errors',
    'Paper-based receipt slips easily misplaced or manipulated',
  ];

  const procureIntelligencePoints = [
    'Smart slot recommendations with 15-minute precision',
    'AI congestion prediction up to 72 hours in advance',
    'Automated bottleneck detection & live supervisor alerts',
    'Trusted SHA-256 tamper-evident digital audit trail',
    'Real-time queue visibility via Web, Mobile & WhatsApp',
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#A5D6A7]">
            WHY CHOOSE US
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#1B1B1B]">
            Transforming Agricultural Procurement
          </h2>
          <p className="mt-3 text-base text-gray-600 font-medium">
            See how Procure Intelligence replaces archaic chaotic waiting with predictive, trusted AI scheduling.
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Traditional Procurement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-8 bg-[#FFF8F8] border border-[#FFCDD2] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-200">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Archaic Method</span>
                  <h3 className="text-2xl font-extrabold text-gray-900 mt-1">Traditional Procurement</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                  <XCircle className="w-7 h-7" />
                </div>
              </div>

              <ul className="space-y-4">
                {traditionalPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-red-100">
              <p className="text-xs font-semibold text-red-700 bg-red-100/60 p-3 rounded-xl text-center">
                High friction, wasted farmer time, and zero operational predictability.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Procure Intelligence */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-8 bg-[#F4FBF4] border-2 border-[#A5D6A7] shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Recommended Tag */}
            <div className="absolute top-4 right-4 bg-[#2E7D32] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
              SIH 2026 Recommended
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-200">
                <div>
                  <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">AI Powered Platform</span>
                  <h3 className="text-2xl font-extrabold text-[#1B1B1B] mt-1">Procure Intelligence</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] flex items-center justify-center text-white shadow-md shadow-[#2E7D32]/25">
                  <Zap className="w-6 h-6 text-[#F9A825]" />
                </div>
              </div>

              <ul className="space-y-4">
                {procureIntelligencePoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-bold text-gray-900">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-green-200">
              <div className="bg-[#2E7D32] text-white p-3 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-bold shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#F9A825]" />
                <span>Empowering farmers with predictable, trusted, and transparent MSP.</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
