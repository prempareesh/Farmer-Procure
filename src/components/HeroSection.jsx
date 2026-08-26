import React from 'react';
import { User, BarChart2, Play, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HeroSection() {
  const { navigateTo, setHowItWorksModalOpen, t } = useApp();

  return (
    <section id="hero" className="relative flex-1 w-full flex items-center z-10 my-auto overflow-hidden bg-[#F4F8F2]">
      
      {/* 1. RIGHT-ALIGNED NATURAL FARMER & OXEN IMAGE ZONE (Covers right 56%, zero overlap with left text) */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[56%] pointer-events-none overflow-hidden z-0">
        <img
          src="/farmer_ultra_green.jpg"
          alt="Traditional Indian Farmer with two white oxen in vibrant emerald green paddy field at sunrise"
          className="w-full h-full object-cover object-[72%_center] lg:object-[76%_center] filter brightness-[1.02] contrast-[1.06] saturate-[1.15]"
        />

        {/* Soft Left-Edge Transition Blend to #F4F8F2 */}
        <div className="absolute left-0 inset-y-0 w-32 lg:w-48 bg-gradient-to-r from-[#F4F8F2] via-[#F4F8F2]/70 to-transparent" />
        
        {/* Top and Bottom Clean Fades */}
        <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#F4F8F2] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#F4F8F2] to-transparent" />
      </div>

      {/* 2. LEFT CONTENT ZONE (Clean, high-contrast, zero overlap with oxen) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="max-w-lg lg:max-w-xl space-y-4">
          
          {/* Small Pill Badge */}
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] shadow-xs">
            <span className="text-xs font-black tracking-widest text-[#2E7D32] uppercase">
              {t('heroBadge')}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1B1B1B] tracking-tight leading-[1.1]">
              {t('heroHeadline1')} <br />
              <span className="text-[#1B4318]">{t('heroHeadline2')}</span>
            </h1>

            {/* Green Agricultural Flourish Accent Line */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="h-[2px] w-14 bg-[#2E7D32] rounded-full" />
              <Sprout className="w-4 h-4 text-[#2E7D32]" />
              <div className="h-[2px] w-14 bg-[#2E7D32] rounded-full" />
            </div>
          </div>

          {/* Subheading Description */}
          <p className="text-xs sm:text-sm lg:text-base text-gray-700 font-semibold leading-relaxed max-w-md">
            {t('heroDescription')}
          </p>

          {/* 3 CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* Primary: Book Your Slot */}
            <button
              onClick={() => navigateTo('book-slot')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4 text-white" />
              <span>{t('btnBookSlot')}</span>
            </button>

            {/* Secondary: Live Queue Status */}
            <button
              onClick={() => navigateTo('queue')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-[#D5E2D3] shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-[#2E7D32]" />
              <span>{t('btnLiveQueue')}</span>
            </button>

            {/* Tertiary: How It Works */}
            <button
              onClick={() => setHowItWorksModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-[#D5E2D3] shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#2E7D32] fill-[#2E7D32]" />
              <span>{t('btnHowItWorks')}</span>
            </button>

          </div>

        </div>
      </div>

    </section>
  );
}
