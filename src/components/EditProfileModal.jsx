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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E0ECE0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1B4318] to-[#2E7D32] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                {t("editFarmerProfileTitle")}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Update canonical profile records in database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700 font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Read-Only Farmer ID Field */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>{t("readOnlyFarmerId")}</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">
                PERMANENT IDENTIFIER
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                disabled
                value={farmerProfile?.farmerId || "FRM-2026-000123"}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono font-black bg-gray-100 text-gray-600 cursor-not-allowed select-none"
              />
              <Shield className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-1">
              Farmer ID cannot be edited or regenerated to preserve database
              audit links.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {t("fullName")}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Rameshwar Singh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-white focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
              />
              <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-white focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <p className="text-[10px] text-gray-500 font-medium mt-1">
              Mobile number is used for authentication. Must be unique across
              accounts.
            </p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {t("emailLabel")}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. rameshwar.singh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-white focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {t("addressLabel")}
            </label>
            <div className="relative">
              <textarea
                rows="2"
                placeholder="e.g. Nellore, Andhra Pradesh"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-white focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] resize-none"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {t("cancelBtn")}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>{saving ? t("saving") : t("saveChanges")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
