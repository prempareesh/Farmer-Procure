import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  ShieldCheck,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building,
} from "lucide-react";

export default function LoginModal({ isOpen, onClose }) {
  const [role, setRole] = useState("farmer"); // 'farmer' or 'officer'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoggedInUser({
        name: "Rameshwar Singh",
        role: "Registered Farmer",
        kisanId: "KA-2026-98124",
        mandi: "Karnal Grain Market",
      });
    }, 700);
  };

  const handleOfficerLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoggedInUser({
        name: "Devendra Sharma",
        role: "Procurement Officer (Admin)",
        officerId: officerId || "PO-HR-402",
        mandi: "Haryana Central Zone",
      });
    }, 700);
  };

  const handleReset = () => {
    setOtpSent(false);
    setLoggedInUser(null);
    setPhone("");
    setOtp("");
    setOfficerId("");
    setPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden font-mono"
      >
        {/* Header */}
        <div className="bg-[#0A180D] text-[#F2F0E8] p-6 border-b border-[#1A2E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal text-[#F2F0E8] tracking-wide">Procure Telemetry Portal</h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                Single Sign-On Authentication
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-[#071008]">
          {!loggedInUser ? (
            <div>
              {/* Role Switcher Tabs */}
              <div className="flex bg-[#050805] p-1 mb-6 border border-[#1A2E1E]">
                <button
                  type="button"
                  onClick={() => {
                    setRole("farmer");
                    setOtpSent(false);
                  }}
                  className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === "farmer"
                      ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/40"
                      : "text-[#A6ADA3] hover:text-[#F2F0E8]"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Farmer Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("officer")}
                  className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === "officer"
                      ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/40"
                      : "text-[#A6ADA3] hover:text-[#F2F0E8]"
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Officer / Admin</span>
                </button>
              </div>

              {/* Farmer OTP Login Flow */}
              {role === "farmer" ? (
                !otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#79C267]" />
                        Farmer Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A6ADA3]">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          maxLength="10"
                          className="w-full pl-14 pr-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                        />
                      </div>
                      <p className="text-[10px] font-mono text-[#A6ADA3]/60 mt-1.5">
                        Instant 6-digit OTP will be dispatched via SMS gateway.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <span>Dispatching OTP...</span>
                      ) : (
                        <>
                          <span>Get OTP</span>
                          <ArrowRight className="w-4 h-4 text-[#79C267]" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="bg-[#0A180D] p-3 border border-[#79C267]/40 text-xs text-[#79C267] font-mono flex items-center justify-between">
                      <span>OTP sent to +91 {phone}</span>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[#79C267] underline uppercase text-[10px]"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        placeholder="1 2 3 4 5 6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength="6"
                        className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-base font-mono tracking-widest text-center text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading
                        ? "Verifying OTP..."
                        : "Verify & Enter Dashboard"}
                    </button>
                  </form>
                )
              ) : (
                /* Officer Login Form */
                <form onSubmit={handleOfficerLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5">
                      Govt Officer ID / Aadhaar SSO
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PO-HR-2026"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#79C267]" />
                      Password / Security PIN
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? "Authenticating..." : "Sign In as Officer"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Successful Login State */
            <div className="text-center space-y-4 py-2 bg-[#050805] p-5 border border-[#1A2E1E]">
              <div className="w-12 h-12 border border-[#79C267]/40 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#79C267] bg-[#0A180D] px-3 py-1 border border-[#79C267]/40">
                  Authentication Successful
                </span>
                <h4 className="text-xl font-serif text-[#F2F0E8] mt-2">
                  {loggedInUser.name}
                </h4>
                <p className="text-xs text-[#A6ADA3] font-mono">
                  {loggedInUser.role} • {loggedInUser.mandi}
                </p>
              </div>

              <div className="bg-[#071008] p-4 border border-[#1A2E1E] text-left text-xs font-mono space-y-1.5 text-[#E8E7DE]">
                <div className="flex justify-between">
                  <span className="text-[#A6ADA3]">Security Token:</span>
                  <span className="font-mono text-[#79C267]">
                    SHA256-AUTH-OK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6ADA3]">Access Level:</span>
                  <span className="text-[#F2F0E8]">
                    Mandi Slot & Telemetry Access
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    handleReset();
                    const dash = document.getElementById("dashboard");
                    if (dash) dash.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 py-2.5 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  Go to AI Dashboard
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
