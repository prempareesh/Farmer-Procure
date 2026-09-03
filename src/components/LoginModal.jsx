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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1B4318] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Procure Intelligence Portal</h3>
              <p className="text-xs text-[#A5D6A7]">
                Secure Farmer & Officer Single Sign-On
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!loggedInUser ? (
            <div>
              {/* Role Switcher Tabs */}
              <div className="flex bg-[#F4F9F4] p-1 rounded-2xl mb-6 border border-[#C8E6C9]">
                <button
                  type="button"
                  onClick={() => {
                    setRole("farmer");
                    setOtpSent(false);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === "farmer"
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "text-gray-700 hover:text-[#2E7D32]"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Farmer Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("officer")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === "officer"
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "text-gray-700 hover:text-[#2E7D32]"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Officer / Admin</span>
                </button>
              </div>

              {/* Farmer OTP Login Flow */}
              {role === "farmer" ? (
                !otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                        Farmer Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          maxLength="10"
                          className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5">
                        You will receive an instant 6-digit OTP for secure
                        authentication.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <span>Sending OTP...</span>
                      ) : (
                        <>
                          <span>Get OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="bg-[#E8F5E9] p-3 rounded-xl border border-[#A5D6A7] text-xs text-[#1B4318] font-semibold flex items-center justify-between">
                      <span>OTP sent to +91 {phone}</span>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[#2E7D32] underline font-bold"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        placeholder="1 2 3 4 5 6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength="6"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-mono tracking-widest text-center font-bold text-gray-900 focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
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
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      Govt Officer ID / Aadhaar SSO
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PO-HR-2026"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#2E7D32]" />
                      Password / Security PIN
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Authenticating..." : "Sign In as Officer"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Successful Login State */
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
                  Authentication Successful
                </span>
                <h4 className="text-xl font-bold text-gray-900 mt-2">
                  {loggedInUser.name}
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  {loggedInUser.role} • {loggedInUser.mandi}
                </p>
              </div>

              <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E8E4D9] text-left text-xs space-y-1.5 font-medium text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Security Token:</span>
                  <span className="font-mono text-[#2E7D32] font-bold">
                    SHA256-AUTH-OK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Access Level:</span>
                  <span className="font-bold text-gray-900">
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
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-xs shadow-md"
                >
                  Go to AI Dashboard
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
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
