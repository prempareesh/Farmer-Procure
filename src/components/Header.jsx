import React, { useState } from 'react';
import { User, Calendar, Menu, X, Sprout, Bell, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const {
    user,
    logoutUser,
    currentView,
    navigateTo,
    notifications,
    setAboutModalOpen,
    setHowItWorksModalOpen,
    setContactModalOpen,
    setNotificationDrawerOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Nav Items Definition based on Auth State
  const navItems = user
    ? [
        { name: 'Home', action: () => navigateTo('home'), view: 'home' },
        { name: 'About', action: () => setAboutModalOpen(true), modal: true },
        { name: 'Features', action: () => navigateTo('home'), view: 'features' },
        { name: 'How It Works', action: () => setHowItWorksModalOpen(true), modal: true },
        { name: 'Dashboard', action: () => navigateTo('dashboard'), view: 'dashboard' },
        { name: 'Contact', action: () => setContactModalOpen(true), modal: true },
        { name: 'Book Slot', action: () => navigateTo('book-slot'), view: 'book-slot' },
        { name: 'Profile', action: () => navigateTo('profile'), view: 'profile' },
      ]
    : [
        { name: 'Home', action: () => navigateTo('home'), view: 'home' },
        { name: 'About', action: () => setAboutModalOpen(true), modal: true },
        { name: 'Features', action: () => navigateTo('home'), view: 'features' },
        { name: 'How It Works', action: () => setHowItWorksModalOpen(true), modal: true },
        { name: 'Contact', action: () => setContactModalOpen(true), modal: true },
      ];

  return (
    <header className="w-full bg-[#F4F8F2] px-6 lg:px-12 py-3.5 flex items-center justify-between z-30 shrink-0 border-b border-[#E2EBE0]">
      
      {/* LEFT: Logo Emblem & Brand Title */}
      <div 
        onClick={() => navigateTo('home')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7CB342] via-[#2E7D32] to-[#1B4318] flex items-center justify-center shadow-xs">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1B1B1B] tracking-tight leading-none">
            AgriProcure
          </h1>
          <p className="text-[11px] font-medium text-gray-500 tracking-tight mt-1 leading-none">
            Smart Procurement. Better Future.
          </p>
        </div>
      </div>

      {/* CENTER: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-7">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.name}
              onClick={item.action}
              className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${
                isActive ? 'text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'
              }`}
            >
              {item.name}
              {isActive && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#2E7D32] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* RIGHT: Auth Actions */}
      <div className="hidden sm:flex items-center gap-3">
        {user ? (
          <>
            {/* Notification Bell with live unread badge */}
            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-white border border-[#D5E2D3] hover:bg-[#E8F5E9] text-gray-700 hover:text-[#2E7D32] transition-colors shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Badge */}
            <button
              onClick={() => navigateTo(user.role === 'admin' ? 'dashboard' : 'profile')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 bg-white border border-[#D5E2D3] hover:bg-[#FAF8F2] shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-[10px]">
                {user.name.charAt(0)}
              </div>
              <span className="max-w-28 truncate">{user.name.split(' ')[0]}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          /* Unauthenticated State: Only Login button is shown */
          <button
            onClick={() => navigateTo('auth')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1B4318] hover:bg-[#2E7D32] shadow-xs transition-all duration-200 active:scale-95"
          >
            <User className="w-4 h-4 text-[#F9A825]" />
            <span>Login</span>
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex md:hidden items-center gap-2">
        {user && (
          <button
            onClick={() => setNotificationDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-white text-gray-700"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600" />
            )}
          </button>
        )}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-700 hover:text-[#2E7D32]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#F4F8F2] border-b border-[#E2EBE0] p-4 space-y-3 shadow-xl z-50 md:hidden animate-in fade-in">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { item.action(); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-bold text-gray-800 hover:text-[#2E7D32]"
            >
              {item.name}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-[#E2EBE0]">
            {user ? (
              <button
                onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-red-100 text-red-800 font-bold rounded-xl text-xs"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                onClick={() => { navigateTo('auth'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-[#1B4318] text-white font-bold rounded-xl text-sm"
              >
                Login Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
