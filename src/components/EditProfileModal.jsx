import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function EditProfileModal({ isOpen, onClose }) {
  const { farmerProfile, updateFarmerProfile, t } = useApp();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (farmerProfile) {
      setName(farmerProfile.name || "");
      setMobile(farmerProfile.mobile || "");
      setEmail(farmerProfile.email || "");
      setAddress(
        farmerProfile.address ||
          `${farmerProfile.village || ""}, ${farmerProfile.district || ""}, ${farmerProfile.state || ""}`.replace(
            /^, |, $/g,
            "",
          ),
      );
    }
    setError("");
    setSuccessMsg("");
  }, [farmerProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setError("");
    setSuccessMsg("");

    if (!name.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!address.trim()) {
      setError("Address is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateFarmerProfile({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        address: address.trim(),
      });

      if (res && !res.success) {
        setError(res.error || t("unableToUpdateProfile"));
      } else {
        setSuccessMsg(t("profileUpdatedSuccess"));
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#071008] text-[#E8E7DE] rounded-none w-full max-w-lg border border-[#1A2E1E] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#0A180D] border-b border-[#1A2E1E] text-[#F2F0E8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal tracking-wide text-[#F2F0E8]">
                {t("editFarmerProfileTitle")}
              </h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                Update canonical profile records in database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1 font-mono"
        >
          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-[#1C0A0A] border border-red-900/50 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 bg-[#0A180D] border border-[#79C267]/40 text-xs text-[#79C267] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#79C267] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Read-Only Farmer ID Field */}
          <div>
            <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>{t("readOnlyFarmerId")}</span>
              <span className="text-[10px] bg-[#050805] text-[#79C267] px-2 py-0.5 border border-[#1A2E1E]">
                PERMANENT IDENTIFIER
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                disabled
                value={farmerProfile?.farmerId || "FRM-2026-000123"}
                className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono font-bold text-[#79C267] cursor-not-allowed select-none"
              />
              <Shield className="w-4 h-4 text-[#A6ADA3]/40 absolute right-3.5 top-3" />
            </div>
            <p className="text-[10px] text-[#A6ADA3]/60 font-mono mt-1">
              Farmer ID cannot be edited or regenerated to preserve database audit links.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1.5">
              {t("fullName")}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Rameshwar Singh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
              />
              <User className="w-4 h-4 text-[#A6ADA3]/40 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1.5">
              {t("mobile10")}
            </label>
            <div className="relative">
              <input
                type="tel"
                maxLength="10"
                placeholder="e.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
              />
              <Phone className="w-4 h-4 text-[#A6ADA3]/40 absolute right-3.5 top-3 pointer-events-none" />
            </div>
            <p className="text-[10px] text-[#A6ADA3]/60 font-mono mt-1">
              Mobile number is used for authentication. Must be unique across accounts.
            </p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1.5">
              {t("emailLabel")}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. rameshwar.singh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
              />
              <Mail className="w-4 h-4 text-[#A6ADA3]/40 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[11px] text-[#A6ADA3] uppercase tracking-wider mb-1.5">
              {t("addressLabel")}
            </label>
            <div className="relative">
              <textarea
                rows="2"
                placeholder="e.g. Taraori, Karnal District, Haryana"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#050805] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8] focus:outline-none focus:border-[#79C267] resize-none"
              />
              <MapPin className="w-4 h-4 text-[#A6ADA3]/40 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A2E1E]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              {t("cancelBtn")}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>{saving ? t("saving") : t("saveChanges")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
