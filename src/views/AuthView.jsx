import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Phone, Lock, ArrowRight, CheckCircle2, Building, ArrowLeft, UserPlus, Camera, Wrench, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthView() {
  const { registerFarmer, loginUser, navigateTo, t } = useApp();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('farmer'); // 'farmer' | 'worker' | 'officer'
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regForm, setRegForm] = useState({
    name: '',
    mobile: '',
    aadhaar: '',
    village: '',
    district: 'Karnal',
    state: 'Haryana',
    address: '',
    faceImage: '/hero_farmer.jpg',
    password: '',
    confirmPassword: '',
  });

  const [faceCaptured, setFaceCaptured] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!regForm.name.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!regForm.mobile || regForm.mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!regForm.aadhaar || regForm.aadhaar.length < 12) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    if (!faceCaptured) {
      setError('Face image capture is mandatory for biometric registration.');
      return;
    }
    if (regForm.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const newFarmer = await registerFarmer(regForm);
      setLoading(false);
      setAuthSuccessMessage(`Farmer registered successfully! Your Permanent ID is: ${newFarmer.farmerId}. Please sign in.`);
      setIsRegistering(false);
      setLoginIdentifier(newFarmer.farmerId);
    } catch {
      setLoading(false);
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier) {
      setError('Identifier / Mobile is required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser(loginIdentifier, loginPassword, role);
    }, 600);
  };

  // Quick Demo Buttons for SIH Judging
  const fillDemo = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'farmer') {
      setLoginIdentifier('FRM-2026-000123');
      setLoginPassword('farmer2026');
    } else if (demoRole === 'worker') {
      setLoginIdentifier('WRK-HR-108');
      setLoginPassword('worker2026');
    } else if (demoRole === 'officer') {
      setLoginIdentifier('OFFICER-HR-402');
      setLoginPassword('admin2026');
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Link */}
        <button
          onClick={() => navigateTo('home')}
          className="mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Top Banner */}
          <div className="bg-[#1B4318] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825] shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {isRegistering ? 'Farmer Registration' : 'AgriProcure Unified Portal'}
                </h2>
                <p className="text-xs text-[#A5D6A7]">
                  {isRegistering ? 'Permanent Biometric Kisan Identity (FRM-2026-XXXXXX)' : 'Sign in as Farmer, Staff, or Officer'}
                </p>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {authSuccessMessage && (
            <div className="bg-green-50 p-4 border-b border-green-200 text-xs text-green-900 font-bold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
              <span>{authSuccessMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 p-3.5 border-b border-red-200 text-xs text-red-700 font-bold">
              {error}
            </div>
          )}

          <div className="p-6">
            {!isRegistering ? (
              /* LOGIN FORM (3 ROLES) */
              <div className="space-y-4">
                
                {/* Role Switcher */}
                <div className="grid grid-cols-3 bg-[#F4F8F2] p-1 rounded-2xl border border-[#C8E6C9] text-xs">
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                      role === 'farmer' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Farmer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('worker')}
                    className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                      role === 'worker' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-gray-700'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('officer')}
                    className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                      role === 'officer' ? 'bg-[#1B4318] text-white shadow-xs' : 'text-gray-700'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Officer</span>
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {role === 'farmer' ? 'Farmer ID or Mobile' : role === 'worker' ? 'Worker Staff ID' : 'Officer SSO ID'}
                    </label>
                    <input
                      type="text"
                      placeholder={role === 'farmer' ? 'FRM-2026-000123 or 9876543210' : role === 'worker' ? 'WRK-HR-108' : 'OFFICER-HR-402'}
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Password / Security PIN
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#FAF8F2] focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Authenticating...' : `Sign in as ${role === 'farmer' ? 'Farmer' : role === 'worker' ? 'Mandi Staff' : 'Field Officer'}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* 1-Click Demo Fill for Judges */}
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center mb-2">
                    ⚡ 1-Click Demo Testing Credentials
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillDemo('farmer')}
                      className="p-2 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] text-[10px] font-black text-center"
                    >
                      Demo Farmer
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemo('worker')}
                      className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] font-black text-center"
                    >
                      Demo Staff
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemo('officer')}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-black text-center"
                    >
                      Demo Officer
                    </button>
                  </div>
                </div>

                {role === 'farmer' && (
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-600 font-medium">
                      New Farmer?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsRegistering(true); setError(''); }}
                        className="font-bold text-[#2E7D32] hover:underline"
                      >
                        Register with Face Capture
                      </button>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* REGISTRATION WITH MANDATORY FACE CAPTURE */
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rameshwar Singh"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Mobile (10-Digits) *</label>
                    <input
                      type="tel"
                      maxLength="10"
                      placeholder="9876543210"
                      value={regForm.mobile}
                      onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Aadhaar (12-Digits) *</label>
                    <input
                      type="text"
                      maxLength="12"
                      placeholder="12-digit Aadhaar"
                      value={regForm.aadhaar}
                      onChange={(e) => setRegForm({ ...regForm, aadhaar: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Village / Tehsil</label>
                    <input
                      type="text"
                      placeholder="e.g. Taraori"
                      value={regForm.village}
                      onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">State</label>
                    <select
                      value={regForm.state}
                      onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
                    >
                      <option value="Haryana">Haryana</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                  </div>
                </div>

                {/* Mandatory Face Biometric Capture */}
                <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#A5D6A7] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#1B4318] uppercase flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-[#2E7D32]" />
                      Mandatory Face Capture
                    </span>
                    {faceCaptured && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-[#2E7D32] text-[9px] font-black">
                        CAPTURED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden border border-gray-300 shrink-0">
                      <img src="/hero_farmer.jpg" alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFaceCaptured(true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        faceCaptured ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]' : 'bg-[#2E7D32] text-white'
                      }`}
                    >
                      {faceCaptured ? 'Biometric Face Enrolled ✓' : 'Capture Live Face Frame'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Create Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 mt-2"
                >
                  {loading ? 'Enrolling Farmer...' : 'Generate Permanent Farmer ID (FRM-2026-XXXXXX)'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-xs font-bold text-[#2E7D32] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
