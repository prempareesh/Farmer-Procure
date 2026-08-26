import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sprout, Plus, Edit2, Trash2, ShieldCheck, MapPin, Phone, ArrowLeft, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfileView() {
  const { farmerProfile, crops, addCrop, updateCrop, deleteCrop, navigateTo } = useApp();

  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);

  // Form states for adding crop
  const [newCropName, setNewCropName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newYield, setNewYield] = useState('');

  // Form states for editing crop
  const [editCropName, setEditCropName] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editYield, setEditYield] = useState('');

  const handleAddCropSubmit = (e) => {
    e.preventDefault();
    if (!newCropName || !newArea || !newYield) return;
    addCrop({
      name: newCropName,
      areaAcres: newArea,
      expectedYieldQuintals: newYield,
    });
    setNewCropName('');
    setNewArea('');
    setNewYield('');
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
    <div className="min-h-[88vh] bg-[#F4F8F2] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      
      {/* Navigation Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('book-slot')}
            className="px-4 py-2 rounded-xl bg-[#1B4318] text-white text-xs font-bold hover:bg-[#2E7D32] transition-all shadow-xs"
          >
            Book Slot with Crops
          </button>
        </div>
      </div>

      {/* 1. Farmer Identity Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8F5E9]/60 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#1B4318] flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0">
              <User className="w-8 h-8 text-[#F9A825]" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-gray-900">{farmerProfile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black border border-[#A5D6A7]">
                  VERIFIED KISAN
                </span>
              </div>
              <p className="text-xs text-gray-500 font-bold mt-0.5">
                Farmer ID: <span className="text-[#1B4318] font-mono">{farmerProfile.farmerId}</span>
              </p>

              <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-600 font-medium">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                  +91 {farmerProfile.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Aadhaar: {farmerProfile.aadhaar}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {farmerProfile.village}, {farmerProfile.district} ({farmerProfile.state})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E8E4D9] text-xs space-y-1 shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase">DBT Linked Account</span>
            <p className="font-bold text-gray-800">{farmerProfile.bankAccount}</p>
            <p className="text-[11px] text-gray-500 font-mono">IFSC: {farmerProfile.ifsc}</p>
          </div>
        </div>
      </div>

      {/* 2. Multiple Crops Management Section */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E0ECE0] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="text-base font-bold text-gray-900">Registered Crop Portfolio</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage all cultivated crops, land acreage, and expected yields for procurement
            </p>
          </div>

          <button
            onClick={() => setIsAddingCrop(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Crop</span>
          </button>
        </div>

        {/* Add Crop Modal Form */}
        <AnimatePresence>
          {isAddingCrop && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCropSubmit}
              className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#C8E6C9] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
                  Register New Crop Details
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingCrop(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Crop Name & Variety *</label>
                  <input
                    type="text"
                    placeholder="e.g. Paddy (Basmati PB-1)"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Cultivated Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.0"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Expected Yield (Quintals) *</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 100"
                    value={newYield}
                    onChange={(e) => setNewYield(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCrop(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B4318]"
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
                className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E0ECE0] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                {isEditing ? (
                  <form onSubmit={handleEditCropSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Crop Name</label>
                      <input
                        type="text"
                        value={editCropName}
                        onChange={(e) => setEditCropName(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Area (Acres)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editArea}
                          onChange={(e) => setEditArea(e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Yield (Qtl)</label>
                        <input
                          type="number"
                          value={editYield}
                          onChange={(e) => setEditYield(e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingCropId(null)}
                        className="p-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg bg-[#2E7D32] text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold shrink-0">
                          <Sprout className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditCrop(crop)}
                            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
                            title="Edit Crop"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCrop(crop.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Crop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{crop.name}</h4>
                        <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                          MSP Eligible Crop Variety
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase">Land Area</span>
                          <span className="text-sm font-black text-gray-800">{crop.areaAcres} Acres</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase">Exp. Yield</span>
                          <span className="text-sm font-black text-[#2E7D32]">{crop.expectedYieldQuintals} Qtl</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateTo('book-slot')}
                      className="mt-4 w-full py-2 bg-[#FAF8F2] hover:bg-[#E8F5E9] text-[#2E7D32] font-bold text-xs rounded-xl border border-[#C8E6C9] transition-colors text-center block"
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

    </div>
  );
}
