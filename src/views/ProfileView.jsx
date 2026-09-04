import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Sprout,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  MapPin,
  Phone,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import EditProfileModal from "../components/EditProfileModal";

export default function ProfileView() {
  const {
    farmerProfile,
    crops,
    addCrop,
    updateCrop,
    deleteCrop,
    navigateTo,
    t,
  } = useApp();

  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Form states for adding crop
  const [newCropName, setNewCropName] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newYield, setNewYield] = useState("");

  // Form states for editing crop
  const [editCropName, setEditCropName] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editYield, setEditYield] = useState("");

  const handleAddCropSubmit = (e) => {
    e.preventDefault();
    if (!newCropName || !newArea || !newYield) return;
    addCrop({
      name: newCropName,
      areaAcres: newArea,
      expectedYieldQuintals: newYield,
    });
    setNewCropName("");
    setNewArea("");
    setNewYield("");
    setIsAddingCrop(false);
  };

  const startEditCrop = (crop) => {
    setEditingCropId(crop.id);
    setEditCropName(crop.name);
    setEditArea(crop.areaAcres);
    setEditYield(crop.expectedYieldQuintals);
  };

  const handleEditCropSubmit = (e) => {
    e.preventDefault();
    updateCrop(editingCropId, {
      name: editCropName,
      areaAcres: editArea,
      expectedYieldQuintals: editYield,
    });
    setEditingCropId(null);
  };

  return (
    <div className="min-h-[88vh] bg-[#050805] text-[#E8E7DE] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 font-mono">
      {/* Navigation Header Bar */}
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
            onClick={() => setEditProfileOpen(true)}
            className="px-4 py-2 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#79C267]" />
            <span>{t("editProfile")}</span>
          </button>
          <button
            onClick={() => navigateTo("book-slot")}
            className="px-4 py-2 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
          >
            Book Slot with Crops
          </button>
        </div>
      </div>

      {/* 1. Farmer Identity Card */}
      <div className="bg-[#071008] p-6 border border-[#1A2E1E] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 border border-[#79C267]/40 bg-[#164A29]/40 flex items-center justify-center text-[#79C267] shrink-0">
              <User className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-serif text-[#F2F0E8]">
                  {farmerProfile.name}
                </h2>
                <span className="px-2.5 py-0.5 border border-[#79C267]/40 bg-[#0A180D] text-[#79C267] text-[10px] font-mono uppercase">
                  VERIFIED KISAN
                </span>
              </div>
              <p className="text-xs text-[#A6ADA3] font-mono mt-0.5">
                Farmer ID:{" "}
                <span className="text-[#79C267] font-mono">
                  {farmerProfile.farmerId}
                </span>
              </p>

              <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#A6ADA3] font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#79C267]" />
                  +91 {farmerProfile.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#79C267]" />
                  Aadhaar: {farmerProfile.aadhaar}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#79C267]" />
                  {farmerProfile.address ||
                    `${farmerProfile.village}, ${farmerProfile.district} (${farmerProfile.state})`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-4 py-2 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#79C267]" />
              <span>{t("editProfile")}</span>
            </button>

            <div className="bg-[#050805] p-3.5 border border-[#1A2E1E] text-xs space-y-1 text-right font-mono">
              <span className="text-[10px] text-[#A6ADA3] uppercase block">
                DBT Linked Account
              </span>
              <p className="text-[#F2F0E8]">
                {farmerProfile.bankAccount}
              </p>
              <p className="text-[11px] text-[#A6ADA3]">
                IFSC: {farmerProfile.ifsc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Multiple Crops Management Section */}
      <div className="bg-[#071008] p-6 border border-[#1A2E1E] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2E1E] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#79C267]" />
              <h3 className="text-xl font-serif text-[#F2F0E8]">
                Registered Crop Portfolio
              </h3>
            </div>
            <p className="text-xs text-[#A6ADA3] mt-0.5">
              Manage all cultivated crops, land acreage, and expected yields for procurement
            </p>
          </div>

          <button
            onClick={() => setIsAddingCrop(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#79C267]" />
            <span>Add New Crop</span>
          </button>
        </div>

        {/* Add Crop Modal Form */}
        <AnimatePresence>
          {isAddingCrop && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCropSubmit}
              className="bg-[#050805] p-5 border border-[#1A2E1E] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#79C267] uppercase tracking-wider">
                  Register New Crop Details
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingCrop(false)}
                  className="text-[#A6ADA3] hover:text-[#F2F0E8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase mb-1">
                    Crop Name & Variety *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paddy (Basmati PB-1)"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#071008] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase mb-1">
                    Cultivated Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.0"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#071008] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase mb-1">
                    Expected Yield (Quintals) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 100"
                    value={newYield}
                    onChange={(e) => setNewYield(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#071008] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCrop(false)}
                  className="px-3.5 py-1.5 border border-[#1A2E1E] bg-[#071008] text-xs font-mono text-[#A6ADA3] hover:text-[#F2F0E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#164A29] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider"
                >
                  Save Crop
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crops.map((crop) => {
            const isEditing = editingCropId === crop.id;

            return (
              <div
                key={crop.id}
                className="p-5 bg-[#050805] border border-[#1A2E1E] flex flex-col justify-between"
              >
                {isEditing ? (
                  <form onSubmit={handleEditCropSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-[#A6ADA3] uppercase">
                        Crop Name
                      </label>
                      <input
                        type="text"
                        value={editCropName}
                        onChange={(e) => setEditCropName(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 bg-[#071008] border border-[#1A2E1E] text-xs font-serif text-[#F2F0E8]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#A6ADA3] uppercase">
                          Area (Acres)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editArea}
                          onChange={(e) => setEditArea(e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 bg-[#071008] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#A6ADA3] uppercase">
                          Yield (Qtl)
                        </label>
                        <input
                          type="number"
                          value={editYield}
                          onChange={(e) => setEditYield(e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 bg-[#071008] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingCropId(null)}
                        className="p-1.5 border border-[#1A2E1E] bg-[#071008] text-[#A6ADA3] text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="submit"
                        className="p-1.5 bg-[#164A29] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-[#79C267]" />
                        <span>Save</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center shrink-0">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditCrop(crop)}
                            className="p-1.5 border border-[#1A2E1E] bg-[#071008] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
                            title="Edit Crop"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCrop(crop.id)}
                            className="p-1.5 border border-red-900/40 bg-[#1C0A0A] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete Crop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-serif text-[#F2F0E8]">
                          {crop.name}
                        </h4>
                        <p className="text-[11px] font-mono text-[#A6ADA3] mt-0.5">
                          MSP Eligible Crop Variety
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1A2E1E] text-xs">
                        <div className="bg-[#071008] p-2.5 border border-[#1A2E1E]">
                          <span className="text-[10px] text-[#A6ADA3] block uppercase">
                            Land Area
                          </span>
                          <span className="text-sm font-mono text-[#F2F0E8]">
                            {crop.areaAcres} Acres
                          </span>
                        </div>
                        <div className="bg-[#071008] p-2.5 border border-[#1A2E1E]">
                          <span className="text-[10px] text-[#A6ADA3] block uppercase">
                            Exp. Yield
                          </span>
                          <span className="text-sm font-mono text-[#79C267]">
                            {crop.expectedYieldQuintals} Qtl
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateTo("book-slot")}
                      className="mt-4 w-full py-2 bg-[#0A180D] hover:bg-[#164A29] text-[#79C267] hover:text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 transition-colors text-center block cursor-pointer"
                    >
                      Book Slot for this Crop →
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </div>
  );
}
