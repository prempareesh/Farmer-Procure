import React, { useState } from "react";
import { Sprout, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthView() {
  const { registerFarmer, loginUser, t } = useApp();

  const [isRegistering, setIsRegistering] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form State
  const [regForm, setRegForm] = useState({
    name: "",
    mobile: "",
    aadhaar: "",
    village: "",
    district: "Karnal",
    state: "Haryana",
    address: "",
    faceImage: "/hero_farmer.jpg",
    password: "",
    confirmPassword: "",
    otp: "881240",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setAuthSuccessMessage("");

    if (!regForm.name.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!regForm.mobile || regForm.mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!regForm.aadhaar || regForm.aadhaar.length < 12) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    if (regForm.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerFarmer(regForm);
      if (res && !res.success) {
        setError(res.error || "Registration failed. Please check inputs.");
        return;
      }
      setAuthSuccessMessage(
        `Account created successfully! Your Farmer ID is ${res.farmerId}. Please sign in below.`,
      );
      setIsRegistering(false);
      setLoginIdentifier(res.farmerId);
      setLoginPassword(regForm.password);
    } catch {
      setError("Unable to complete registration right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [selectedRole, setSelectedRole] = useState("farmer"); // 'farmer' | 'worker' | 'officer'

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!loginIdentifier.trim()) {
      setError("Identifier is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(loginIdentifier, loginPassword, selectedRole);
      if (res && !res.success) {
        setError(res.error || "Invalid credentials.");
      }
    } catch {
      setError("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#050805] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#164A29] selection:text-[#79C267]">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 justify-center">
            <div className="w-8 h-8 rounded bg-[#164A29] border border-[#79C267]/30 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-[#79C267]" />
            </div>
            <span className="text-2xl font-serif text-[#F2F0E8] tracking-wide">
              {t("brandName")}
            </span>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#A6ADA3]">
            {t("brandTagline")}
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#071008] rounded-md p-8 border border-[#1A2E1E] space-y-6">
          {/* Main Heading & Subtitle */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl font-serif text-[#F2F0E8] tracking-tight">
              {isRegistering
                ? t("registerTitle")
                : selectedRole === "worker"
                  ? "Sign In as Mandi Staff"
                  : selectedRole === "officer"
                    ? "Sign In as Command Officer"
                    : t("welcomeBackFarmer")}
            </h2>
            <p className="text-xs text-[#A6ADA3] font-sans">
              {isRegistering
                ? t("registerSub")
                : selectedRole === "worker"
                  ? "Manage weighbridge, quality inspection & procurement queues."
                  : selectedRole === "officer"
                    ? "Supervise Mandi operations, DBT payments & bottleneck AI."
                    : t("signInFarmerSub")}
            </p>
          </div>

          {/* Success Banner */}
          {authSuccessMessage && (
            <div className="p-3.5 bg-[#12351F]/60 rounded-sm border border-[#79C267]/40 text-xs text-[#79C267] font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#79C267]" />
              <span>{authSuccessMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-950/40 rounded-sm border border-red-900/60 text-xs text-red-300 font-mono">
              {error}
            </div>
          )}

          {!isRegistering ? (
            /* SIGN IN FORM WITH ROLE SWITCHER */
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Selection Tabs */}
              <div className="flex bg-[#050805] p-1 rounded border border-[#1A2E1E] text-xs font-mono uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("farmer");
                    setLoginIdentifier("FRM-2026-000123");
                    setLoginPassword("1234");
                  }}
                  className={`flex-1 py-2 rounded-sm transition-all cursor-pointer ${
                    selectedRole === "farmer"
                      ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
                      : "text-[#A6ADA3] hover:text-[#F2F0E8]"
                  }`}
                >
                  Farmer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("worker");
                    setLoginIdentifier("staff");
                    setLoginPassword("staff1");
                  }}
                  className={`flex-1 py-2 rounded-sm transition-all cursor-pointer ${
                    selectedRole === "worker"
                      ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
                      : "text-[#A6ADA3] hover:text-[#F2F0E8]"
                  }`}
                >
                  Mandi Staff
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("officer");
                    setLoginIdentifier("officer");
                    setLoginPassword("officer1");
                  }}
                  className={`flex-1 py-2 rounded-sm transition-all cursor-pointer ${
                    selectedRole === "officer"
                      ? "bg-[#164A29] text-[#F2F0E8] border border-[#79C267]/30"
                      : "text-[#A6ADA3] hover:text-[#F2F0E8]"
                  }`}
                >
                  Officer
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5">
                  {selectedRole === "worker"
                    ? "Staff ID / User Identifier"
                    : selectedRole === "officer"
                      ? "Officer ID / Command Identifier"
                      : t("farmerIdOrMobile")}
                </label>
                <input
                  type="text"
                  placeholder={
                    selectedRole === "worker"
                      ? "e.g. staff1"
                      : selectedRole === "officer"
                        ? "e.g. officer1"
                        : t("enterFarmerIdOrMobile")
                  }
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-sm border border-[#1A2E1E] text-sm bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1.5">
                  {t("passwordPin")}
                </label>
                <input
                  type="password"
                  placeholder={t("enterPasswordPin")}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-sm border border-[#1A2E1E] text-sm bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267] transition-colors"
                />
              </div>

              {/* Sub Row: Remember Me & Forgot PIN */}
              <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#A6ADA3]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#050805] border-[#1A2E1E] text-[#79C267] focus:ring-0 cursor-pointer"
                  />
                  <span>{t("rememberMe")}</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Password reset instructions sent to registered contact.",
                    )
                  }
                  className="text-[#79C267] hover:underline cursor-pointer"
                >
                  {t("forgotPin")}
                </button>
              </div>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-widest border border-[#79C267]/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {loading
                    ? "SIGNING IN..."
                    : selectedRole === "worker"
                      ? "Sign In as Mandi Staff →"
                      : selectedRole === "officer"
                        ? "Sign In as Officer →"
                        : t("signInAsFarmer")}
                </span>
              </button>
            </form>
          ) : (
            /* FARMER REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rameshwar Singh"
                  value={regForm.name}
                  onChange={(e) =>
                    setRegForm({ ...regForm, name: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                    {t("mobile10")}
                  </label>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="9876543210"
                    value={regForm.mobile}
                    onChange={(e) =>
                      setRegForm({ ...regForm, mobile: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                    {t("aadhaar12")}
                  </label>
                  <input
                    type="text"
                    maxLength="14"
                    placeholder="XXXX-XXXX-8912"
                    value={regForm.aadhaar}
                    onChange={(e) =>
                      setRegForm({ ...regForm, aadhaar: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                  {t("villageTehsil")}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Taraori, Karnal"
                  value={regForm.village}
                  onChange={(e) =>
                    setRegForm({ ...regForm, village: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                    {t("createPassword")}
                  </label>
                  <input
                    type="password"
                    placeholder="Min 4 chars"
                    value={regForm.password}
                    onChange={(e) =>
                      setRegForm({ ...regForm, password: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider mb-1">
                    {t("confirmPassword")}
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm"
                    value={regForm.confirmPassword}
                    onChange={(e) =>
                      setRegForm({
                        ...regForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#1A2E1E] text-xs bg-[#050805] text-[#F2F0E8] placeholder:text-[#A6ADA3]/40 focus:outline-none focus:border-[#79C267]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] font-mono text-xs uppercase tracking-widest border border-[#79C267]/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>
                  {loading ? "Creating Identity..." : t("registerBtn")}
                </span>
              </button>
            </form>
          )}

          {/* Registration Secondary Link */}
          <div className="text-center pt-2 text-xs font-mono text-[#A6ADA3]">
            {!isRegistering ? (
              <span>
                {t("newFarmerText")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError("");
                  }}
                  className="text-[#79C267] hover:underline cursor-pointer"
                >
                  {t("createFarmerIdText")}
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError("");
                }}
                className="text-[#79C267] hover:underline cursor-pointer"
              >
                {t("backToSignIn")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

