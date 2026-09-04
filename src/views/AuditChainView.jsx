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
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 font-mono">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center gap-1.5 text-xs font-mono text-[#A6ADA3] hover:text-[#79C267] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo("dashboard")}
            className="px-3.5 py-1.5 border border-[#1A2E1E] bg-[#071008] text-xs font-mono uppercase text-[#A6ADA3] hover:text-[#F2F0E8] cursor-pointer"
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#071008] p-6 border border-[#1A2E1E] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-[#79C267]/40 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-serif text-[#F2F0E8]">
                Cryptographic SHA-256 Audit Ledger
              </h2>
              <span className="px-2.5 py-0.5 border border-[#79C267]/40 bg-[#0A180D] text-[#79C267] text-[10px] font-mono uppercase">
                IMMUTABLE CHAIN
              </span>
            </div>
            <p className="text-xs text-[#A6ADA3] font-mono mt-0.5">
              Tamper-evident verification of all Mandi procurement transactions
            </p>
          </div>
        </div>

        {/* Live Integrity Badge & Tamper Simulator Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div
            className={`px-4 py-2 border flex items-center gap-2 text-xs font-mono ${
              isIntegrityValid
                ? "bg-[#0A180D] border-[#79C267]/40 text-[#79C267]"
                : "bg-[#1C0A0A] border-red-500/40 text-red-400 animate-pulse"
            }`}
          >
            {isIntegrityValid ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                <div>
                  <span className="block leading-none font-bold">Hash Valid</span>
                  <span className="text-[10px] text-[#A6ADA3]">
                    100% Integrity Verified
                  </span>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <div>
                  <span className="block leading-none font-bold">Integrity Failure!</span>
                  <span className="text-[10px] text-red-300">
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
                className="px-3.5 py-2 bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-wider cursor-pointer"
                title="Test malicious block modification"
              >
                Simulate Tamper
              </button>
            ) : (
              <button
                onClick={repairAuditChain}
                className="px-3.5 py-2 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
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
        <h3 className="text-xs font-mono text-[#A6ADA3] uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#79C267]" />
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
                className={`p-6 border transition-all ${
                  isTampered
                    ? "border-red-500/60 bg-[#1C0A0A]"
                    : "border-[#1A2E1E] bg-[#071008]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A2E1E] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-[#79C267]/40 bg-[#0A180D] text-[#79C267] flex items-center justify-center font-mono text-xs">
                      #{block.blockIndex}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#79C267] uppercase">
                          Stage: {block.stage.replace("_", " ")}
                        </span>
                        <span className="font-mono text-[11px] text-[#A6ADA3]">
                          [{block.bookingId}]
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#A6ADA3]">
                        Farmer: <strong className="text-[#F2F0E8]">{block.farmerName}</strong> • {block.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTampered ? (
                      <span className="px-3 py-1 bg-red-950 border border-red-700 text-red-300 text-xs font-mono uppercase">
                        ⚠️ TAMPERED SIGNATURE
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-[#0A180D] border border-[#79C267]/40 text-[#79C267] text-xs font-mono uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Block Valid
                      </span>
                    )}
                  </div>
                </div>

                {/* Payload Summary */}
                <div className="py-3 font-mono">
                  <span className="text-[10px] text-[#A6ADA3] uppercase tracking-wider block">
                    Transaction Payload Summary
                  </span>
                  <p className="text-xs text-[#F2F0E8] mt-0.5 font-serif">
                    {block.dataSummary}
                  </p>
                </div>

                {/* Cryptographic Hash Pair */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#1A2E1E] text-xs font-mono">
                  <div className="p-3 bg-[#050805] border border-[#1A2E1E]">
                    <span className="text-[10px] text-[#A6ADA3] uppercase block">
                      Previous Block Hash (PrevHash)
                    </span>
                    <p
                      className="text-[11px] text-[#A6ADA3] truncate mt-0.5"
                      title={block.prevHash}
                    >
                      {block.prevHash}
                    </p>
                  </div>

                  <div
                    className={`p-3 border ${isTampered ? "bg-red-950/40 border-red-700 text-red-300" : "bg-[#0A180D] border-[#79C267]/40 text-[#79C267]"}`}
                  >
                    <span className="text-[10px] uppercase block opacity-80">
                      Current Block SHA-256 Hash
                    </span>
                    <p
                      className="text-[11px] font-bold truncate mt-0.5"
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
