import React from 'react';
import { BarChart3, Target, ShieldCheck, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FeatureCards() {
  const { navigateTo, t } = useApp();

  const cards = [
    {
      id: '01',
      icon: BarChart3,
      title: t('feat1Title'),
      description: t('feat1Desc'),
      action: () => navigateTo('queue'),
    },
    {
      id: '02',
      icon: Target,
      title: t('feat2Title'),
      description: t('feat2Desc'),
      action: () => navigateTo('book-slot'),
    },
    {
      id: '03',
      icon: ShieldCheck,
      title: t('feat3Title'),
      description: t('feat3Desc'),
      action: () => navigateTo('audit'),
    },
    {
      id: '04',
      icon: Users,
      title: t('feat4Title'),
      description: t('feat4Desc'),
      action: () => navigateTo('profile'),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 z-20 shrink-0 mt-6 mb-5">
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#E0ECE0] shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E6EFE5] transition-all hover:bg-white hover:shadow-sm cursor-pointer active:scale-98"
              >
                <div className="w-11 h-11 rounded-full bg-[#1B4318] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1B1B1B] leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-gray-600 font-medium leading-snug mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
