import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Phone, Lock, ArrowRight, CheckCircle2, Building, ArrowLeft, UserPlus, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthView() {
  const { registerUser, loginUser, navigateTo } = useApp();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('farmer'); // 'farmer' | 'admin'
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    name: '',
    mobile: '',
    aadhaar: '',
    village: '',
    state: 'Haryana',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!regForm.name.trim()) {
      setError('Farmer Name is required.');
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
      await registerUser(regForm);
      setLoading(false);
      setAuthSuccessMessage('Account Created Successfully! Please login with your credentials.');
      setIsRegistering(false);
      setLoginPhone(regForm.mobile);
    } catch {
      setLoading(false);
      setError('Failed to create account. Please try again.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!loginPhone) {
      setError(role === 'admin' ? 'Officer ID / Mobile is required.' : 'Mobile number is required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser(loginPhone, loginPassword, role);
    }, 600);
  };

  // Quick Demo Fill for Judging Demo
  const fillDemoFarmer = () => {
    setRole('farmer');
    setLoginPhone('9876543210');
    setLoginPassword('farmer2026');
  };

  const fillDemoAdmin = () => {
    setRole('admin');
    setLoginPhone('OFFICER-HR-402');
    setLoginPassword('admin2026');
  };

  return (
    <div className="min-h-[88vh] bg-[#F4F8F2] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back to Home Link */}
        <button
          onClick={() => navigateTo('home')}
          className="mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#1B4318] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825] shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {isRegistering ? 'Farmer Registration' : 'Procure Intelligence Portal'}
                </h2>
                <p className="text-xs text-[#A5D6A7]">
                  {isRegistering ? 'Create your official SIH 2026 Kisan Account' : 'Unified Farmer & Mandi Officer Sign-In'}
                </p>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {authSuccessMessage && (
            <div className="bg-green-50 p-4 border-b border-green-200 flex items-start gap-2.5 text-xs text-green-900 font-bold">
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
              /* LOGIN FORM */
              <div className="space-y-5">
                {/* Role Switcher */}
                <div className="flex bg-[#F4F8F2] p-1 rounded-2xl border border-[#C8E6C9]">
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      role === 'farmer'
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'text-gray-700 hover:text-[#2E7D32]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Farmer Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      role === 'admin'
                        ? 'bg-[#1B4318] text-white shadow-xs'
                        : 'text-gray-700 hover:text-[#1B4318]'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Mandi Officer / Admin</span>
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      {role === 'farmer' ? 'Mobile Number' : 'Officer ID / SSO ID'}
                    </label>
                    <div className="relative">
                      {role === 'farmer' ? (
                        <>
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                            +91
                          </span>
                          <input
                            type="tel"
                            placeholder="98765 43210"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            required
                            maxLength="10"
                            className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2E7D32]"
                          />
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder="e.g. OFFICER-HR-402"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#1B4318]"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#2E7D32]" />
                      Password / Security PIN
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Demo Logins Shortcut Bar for Judges */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center mb-2">
                    ⚡ Quick Demo Fill for Judges
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={fillDemoFarmer}
                      className="px-3 py-2 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] text-xs font-bold transition-colors"
                    >
                      Fill Demo Farmer
                    </button>
                    <button
                      type="button"
                      onClick={fillDemoAdmin}
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                    >
                      Fill Demo Officer
                    </button>
                  </div>
                </div>

                {/* Switch to Registration */}
                <div className="pt-2 text-center">
                  <p className="text-xs text-gray-600 font-medium">
                    New User?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegistering(true); setError(''); setAuthSuccessMessage(''); }}
                      className="font-bold text-[#2E7D32] hover:underline"
                    >
                      Register Here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Farmer Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rameshwar Singh"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength="10"
                      value={regForm.mobile}
                      onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Aadhaar Number *
                    </label>
                    <input
                      type="text"
                      placeholder="12-digit Aadhaar"
                      maxLength="12"
                      value={regForm.aadhaar}
                      onChange={(e) => setRegForm({ ...regForm, aadhaar: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Village / Tehsil
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Taraori"
                      value={regForm.village}
                      onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      State
                    </label>
                    <select
                      value={regForm.state}
                      onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32]"
                    >
                      <option value="Haryana">Haryana</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Creating Account...' : 'Complete Farmer Registration'}</span>
                </button>

                <div className="pt-2 text-center">
                  <p className="text-xs text-gray-600 font-medium">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegistering(false); setError(''); }}
                      className="font-bold text-[#2E7D32] hover:underline"
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
