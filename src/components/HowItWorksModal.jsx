import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Eye,
  TrendingUp,
  HelpCircle,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function HowItWorksModal({ isOpen, onClose }) {
  const { t } = useApp();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "OBSERVE",
      num: "01",
      title: t("modalStepObserve"),
      subtitle: t("modalSubObserve"),
      icon: Eye,
      description: t("modalDescObserve"),
      metrics: t("modalMetricsObserve"),
    },
    {
      id: "PREDICT",
      num: "02",
      title: t("modalStepPredict"),
      subtitle: t("modalSubPredict"),
      icon: TrendingUp,
      description: t("modalDescPredict"),
      metrics: t("modalMetricsPredict"),
    },
    {
      id: "EXPLAIN",
      num: "03",
      title: t("modalStepExplain"),
      subtitle: t("modalSubExplain"),
      icon: HelpCircle,
      description: t("modalDescExplain"),
      metrics: t("modalMetricsExplain"),
    },
    {
      id: "IDENTIFY",
      num: "04",
      title: t("modalStepIdentify"),
      subtitle: t("modalSubIdentify"),
      icon: AlertTriangle,
      description: t("modalDescIdentify"),
      metrics: t("modalMetricsIdentify"),
    },
    {
      id: "ACT",
      num: "05",
      title: t("modalStepAct"),
      subtitle: t("modalSubAct"),
      icon: Zap,
      description: t("modalDescAct"),
      metrics: t("modalMetricsAct"),
    },
    {
      id: "VERIFY",
      num: "06",
      title: t("modalStepVerify"),
      subtitle: t("modalSubVerify"),
      icon: CheckCircle2,
      description: t("modalDescVerify"),
      metrics: t("modalMetricsVerify"),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in selection:bg-[#79C267] selection:text-[#050805]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 border-b border-[#1A2E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal text-[#F2F0E8] tracking-wide">{t("howProcureIntelWorks")}</h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">{t("sixStagePipeline")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-[#071008] font-mono">
          {/* Step Selector Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-2.5 text-center border transition-all cursor-pointer font-mono ${
                    isActive
                      ? "bg-[#164A29] text-[#F2F0E8] border-[#79C267]/50"
                      : "bg-[#050805] text-[#A6ADA3] border-[#1A2E1E] hover:border-[#79C267]/30 hover:text-[#F2F0E8]"
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1 text-[#79C267]" />
                  <span className="text-[10px] uppercase block tracking-wider">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Content */}
          <div className="bg-[#050805] p-5 border border-[#1A2E1E] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-3">
              <span className="text-xs font-mono text-[#79C267] bg-[#0A180D] px-2.5 py-1 border border-[#79C267]/30 uppercase">
                {t("stepLabel")} {steps[activeStep].num}: {steps[activeStep].title}
              </span>
              <span className="text-xs font-mono text-[#A6ADA3]">
                {steps[activeStep].subtitle}
              </span>
            </div>

            <p className="text-sm font-serif text-[#F2F0E8] leading-relaxed">
              {steps[activeStep].description}
            </p>

            <div className="bg-[#0A180D] p-3 border border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
              <span className="text-[#A6ADA3]">Metric Status:</span>
              <span className="text-[#79C267]">
                {steps[activeStep].metrics}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() =>
                setActiveStep((prev) =>
                  prev > 0 ? prev - 1 : steps.length - 1,
                )
              }
              className="px-4 py-2 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              {t("btnPrevious")}
            </button>
            <button
              onClick={() =>
                setActiveStep((prev) =>
                  prev < steps.length - 1 ? prev + 1 : 0,
                )
              }
              className="px-5 py-2 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              {t("btnNext")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
