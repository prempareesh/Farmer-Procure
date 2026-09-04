import React, { useState } from "react";
import {
  User,
  Menu,
  X,
  Sprout,
  Bell,
  LogOut,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HomeHeader() {
  const {
    user,
    logoutUser,
    currentView,
    navigateTo,
    notifications,
    currentLang,
    setCurrentLang,
    setNotificationDrawerOpen,
    t,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी (Hindi)" },
    { code: "te", name: "తెలుగు (Telugu)" },
  ];

  const scrollToSection = (id) => {
    if (currentView !== "home") {
      navigateTo("home");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Pre-login public SPA nav items
  const navItems = [
    { name: "About", action: () => scrollToSection("problem") },
    { name: "Features", action: () => scrollToSection("benefits") },
    { name: "How It Works", action: () => scrollToSection("how-it-works") },
    { name: "Contact", action: () => scrollToSection("get-started") },
  ];

  return (
    <header className="sticky top-0 w-full bg-[#050705]/95 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between z-40 shrink-0 border-b border-[#12351F]/50 transition-all">
      {/* LEFT: Logo & Wordmark */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => navigateTo("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#12351F] border border-[#1D5A2D] flex items-center justify-center text-[#79C267]">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-normal text-[#F1EFE6] tracking-wider leading-none">
              AgriProcure
            </h1>
          </div>
        </div>
      </div>

      {/* CENTER: Clean Editorial Links */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={item.action}
            className="text-xs font-mono text-[#A9B0A5] hover:text-[#F1EFE6] tracking-widest uppercase transition-colors cursor-pointer"
          >
            {item.name}
          </button>
        ))}
      </nav>

      {/* RIGHT: Language & Sign In */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-[#F1EFE6] bg-[#0B120C] hover:bg-[#12351F]/60 rounded-lg border border-[#12351F] cursor-pointer transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#79C267]" />
            <span>
              {
                languages
                  .find((l) => l.code === currentLang)
                  ?.name.split(" ")[0]
              }
            </span>
            <ChevronDown className="w-3 h-3 text-[#A9B0A5]" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#0B120C] rounded-xl shadow-2xl border border-[#12351F] py-1.5 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    localStorage.setItem("agri_lang", lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-mono transition-colors cursor-pointer ${
                    currentLang === lang.code
                      ? "bg-[#12351F] text-[#79C267]"
                      : "text-[#F1EFE6] hover:bg-[#12351F]/40"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <>
            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2.5 rounded-lg bg-[#0B120C] border border-[#12351F] text-[#F1EFE6] hover:text-[#79C267] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#79C267] text-[#050705] text-[9px] font-mono font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() =>
                navigateTo(
                  user.role === "farmer"
                    ? "farmer-dash"
                    : user.role === "worker"
                      ? "worker-dash"
                      : "officer-dash",
                )
              }
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono text-[#F1EFE6] bg-[#12351F] border border-[#79C267]/30 hover:bg-[#1D5A2D] cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-[#79C267] text-[#050705] font-black flex items-center justify-center text-[10px]">
                {user.role === "farmer"
                  ? "F"
                  : user.role === "worker"
                    ? "W"
                    : "O"}
              </div>
              <span className="max-w-28 truncate">
                {user.name.split(" ")[0]}
              </span>
            </button>

            <button
              onClick={logoutUser}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-mono text-red-400 bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("logout")}</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-[#F1EFE6] bg-[#12351F] hover:bg-[#1D5A2D] border border-[#79C267]/40 transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#79C267]" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#F1EFE6] hover:text-[#79C267] cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0B120C] border-b border-[#12351F] p-5 space-y-4 shadow-2xl z-50 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                item.action();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs font-mono text-[#F1EFE6] uppercase tracking-widest hover:text-[#79C267] cursor-pointer"
            >
              {item.name}
            </button>
          ))}
          <div className="pt-3 border-t border-[#12351F]">
            <button
              onClick={() => {
                navigateTo("auth");
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#12351F] border border-[#79C267]/40 text-[#F1EFE6] font-mono text-xs uppercase tracking-wider rounded-lg cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
