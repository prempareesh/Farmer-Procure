import React from "react";
import { Users, Sprout, Clock, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ImpactStrip() {
  const { t } = useApp();

  const stats = [
    {
      icon: Users,
      value: "1.2M+",
      label: t("statFarmers"),
    },
    {
      icon: Sprout,
      value: "850+",
      label: t("statCentres"),
    },
    {
      icon: Clock,
      value: "35%",
      label: t("statWait"),
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: t("statAudit"),
    },
  ];

  return (
    <div className="w-full bg-[#071008] text-[#E8E7DE] py-4 px-6 lg:px-12 z-20 shrink-0 border-t border-[#1A2E1E]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-md border border-[#1A2E1E] bg-[#050805] flex items-center justify-center text-[#79C267] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-serif text-[#F2F0E8] leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-[#A6ADA3] uppercase tracking-wider font-mono mt-1">
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

