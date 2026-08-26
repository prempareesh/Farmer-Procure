import React from 'react';
import { Users, Sprout, Clock, ShieldCheck } from 'lucide-react';

export default function ImpactStrip() {
  const stats = [
    {
      icon: Users,
      value: '1.2M+',
      label: 'Farmers Benefited',
    },
    {
      icon: Sprout,
      value: '850+',
      label: 'Procurement Centres',
    },
    {
      icon: Clock,
      value: '35%',
      label: 'Reduction in Waiting Time',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Transparent Transactions',
    },
  ];

  return (
    <div className="w-full bg-[#1B4318] text-white py-3.5 px-6 lg:px-12 z-20 shrink-0 border-t border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-[#A5D6A7] font-semibold mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
