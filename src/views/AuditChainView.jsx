import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Layers,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuditChainView() {
  const { auditChain, simulateTamper, repairAuditChain, navigateTo } = useApp();

  // Check integrity: Verify each block's prevHash matches predecessor's currentHash and isTampered is false
  const isIntegrityValid = auditChain.every((block, idx) => {
    if (block.isTampered) return false;
    if (idx === 0) return true;
    return block.prevHash === auditChain[idx - 1].currentHash;
  });

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo("dashboard")}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50"
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1B4318] text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Lock className="w-7 h-7 text-[#F9A825]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-gray-900">
                Cryptographic SHA-256 Audit Ledger
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black border border-[#A5D6A7]">
                IMMUTABLE CHAIN
              </span>
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Tamper-evident blockchain-grade verification of all Mandi
              procurement transactions
            </p>
          </div>
        </div>

        {/* Live Integrity Badge & Tamper Simulator Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div
            className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 text-xs font-black shadow-xs ${
              isIntegrityValid
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-red-50 border-red-300 text-red-800 animate-pulse"
            }`}
          >
            {isIntegrityValid ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                <div>
                  <span className="block leading-none">Hash Valid</span>
                  <span className="text-[10px] text-[#2E7D32] font-semibold">
                    100% Integrity Verified
                  </span>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <span className="block leading-none">Integrity Failure!</span>
                  <span className="text-[10px] text-red-700 font-semibold">
                    Block Hash Mismatch Detected
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {isIntegrityValid ? (
              <button
                onClick={simulateTamper}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-xs"
                title="Test malicious block modification"
              >
                Simulate Tamper Test
              </button>
            ) : (
              <button
                onClick={repairAuditChain}
                className="px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Repair Consensus</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ledger Block List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2E7D32]" />
          <span>
            Sequential Block Ledger ({auditChain.length} Verified Blocks)
          </span>
        </h3>

        <div className="space-y-4">
          {auditChain.map((block, idx) => {
            const isTampered = block.isTampered;

            return (
              <motion.div
                key={block.blockIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-6 border transition-all shadow-xs ${
                  isTampered
                    ? "border-red-400 bg-red-50/40 ring-2 ring-red-500/20"
                    : "border-[#E0ECE0] hover:border-[#A5D6A7]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1B4318] text-white flex items-center justify-center font-mono font-black text-xs">
                      #{block.blockIndex}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#1B4318] uppercase">
                          Stage: {block.stage.replace("_", " ")}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-gray-500">
                          [{block.bookingId}]
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Farmer: <strong>{block.farmerName}</strong> •{" "}
                        {block.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTampered ? (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black border border-red-300">
                        ⚠️ TAMPERED SIGNATURE
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold border border-[#A5D6A7] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Block Valid
                      </span>
                    )}
                  </div>
                </div>

                {/* Payload Summary */}
                <div className="py-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Transaction Payload Summary
                  </span>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {block.dataSummary}
                  </p>
                </div>

                {/* Cryptographic Hash Pair */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs font-mono">
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Previous Block Hash (PrevHash)
                    </span>
                    <p
                      className="text-[11px] text-gray-600 truncate mt-0.5"
                      title={block.prevHash}
                    >
                      {block.prevHash}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${isTampered ? "bg-red-100 border-red-300" : "bg-[#E8F5E9]/60 border-[#C8E6C9]"}`}
                  >
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">
                      Current Block SHA-256 Hash
                    </span>
                    <p
                      className={`text-[11px] font-bold truncate mt-0.5 ${isTampered ? "text-red-700" : "text-[#1B4318]"}`}
                      title={block.currentHash}
                    >
                      {block.currentHash}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
