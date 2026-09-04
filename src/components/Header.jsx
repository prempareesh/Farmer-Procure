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
import { useApp } from "../context/AppContext";

export default function Header() {
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

  // Dynamic Nav Items based on user role
  let navItems = [];

  if (!user) {
    navItems = [
      {
        name: t("navHowItWorks"),
        action: () => scrollToSection("how-it-works"),
      },
      { name: t("navBenefits"), action: () => scrollToSection("benefits") },
    ];
  } else if (user.role === "farmer") {
    navItems = [
      { name: t("home"), action: () => navigateTo("home"), view: "home" },
      {
        name: t("farmerPortal"),
        action: () => navigateTo("farmer-dash"),
        view: "farmer-dash",
      },
      {
        name: t("bookSlot"),
        action: () => navigateTo("book-slot"),
        view: "book-slot",
      },
      {
        name: t("liveQueue"),
        action: () => navigateTo("queue"),
        view: "queue",
      },
    ];
  } else if (user.role === "worker") {
    navItems = [
      { name: t("home"), action: () => navigateTo("home"), view: "home" },
      {
        name: t("workerPortal"),
        action: () => navigateTo("worker-dash"),
        view: "worker-dash",
      },
      {
        name: t("gateScanner"),
        action: () => navigateTo("qr-scanner"),
        view: "qr-scanner",
      },
    ];
  } else if (user.role === "officer") {
    navItems = [
      { name: t("home"), action: () => navigateTo("home"), view: "home" },
      {
        name: t("officerPortal"),
        action: () => navigateTo("officer-dash"),
        view: "officer-dash",
      },
      {
        name: t("auditTrail"),
        action: () => navigateTo("audit"),
        view: "audit",
      },
    ];
  }

  return (
    <header className="sticky top-0 w-full bg-[#FAFBF8]/95 backdrop-blur-md px-6 lg:px-12 py-3.5 flex items-center justify-between z-40 shrink-0 border-b border-[#E8EFE6] transition-all">
      {/* LEFT: Logo & Brand */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => navigateTo("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7CB342] via-[#2E7D32] to-[#1B4318] flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1B1B1B] tracking-tight leading-none">
              {t("brandName")}
            </h1>
            <p className="text-[11px] font-medium text-gray-500 tracking-tight mt-1 leading-none">
              {t("brandTagline")}
            </p>
          </div>
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
                isActive
                  ? "text-[#2E7D32]"
                  : "text-gray-700 hover:text-[#2E7D32]"
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

      {/* RIGHT: Language Selector & Auth Actions */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200 shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>
              {
                languages
                  .find((l) => l.code === currentLang)
                  ?.name.split(" ")[0]
              }
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    localStorage.setItem("agri_lang", lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors ${
                    currentLang === lang.code
                      ? "bg-[#E8F5E9] text-[#2E7D32]"
                      : "text-gray-700 hover:bg-gray-50"
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
            {/* Notification Bell */}
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

            {/* Role Profile Badge */}
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
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 bg-white border border-[#D5E2D3] hover:bg-[#FAF8F2] shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-[10px]">
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

            {/* Logout */}
            <button
              onClick={logoutUser}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("logout")}</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1B4318] hover:bg-[#2E7D32] shadow-xs transition-all duration-200 active:scale-95"
          >
            <User className="w-4 h-4 text-[#F9A825]" />
            <span>{t("login")}</span>
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="flex md:hidden items-center gap-2">
        {user && (
          <button
            onClick={() => setNotificationDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-white border border-[#D5E2D3] text-gray-700 hover:text-[#2E7D32]"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-700 hover:text-[#2E7D32]"
          aria-label="Toggle Navigation Menu"
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
        <div className="absolute top-full left-0 right-0 bg-[#FAFBF8] border-b border-[#E2EBE0] p-4 space-y-3 shadow-xl z-50 md:hidden animate-in fade-in max-h-[85vh] overflow-y-auto">
          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2.5 px-3 font-bold text-gray-800 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-xl text-sm transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Language Selector inside Mobile Drawer */}
          <div className="pt-3 border-t border-[#E2EBE0] space-y-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block px-1">
              Select Language / भाषा चुनें
            </span>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    localStorage.setItem("agri_lang", lang.code);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                    currentLang === lang.code
                      ? "bg-[#2E7D32] text-white shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  {lang.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* User Auth / Logout Actions inside Mobile Drawer */}
          <div className="pt-3 flex flex-col gap-2 border-t border-[#E2EBE0]">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigateTo(
                      user.role === "farmer"
                        ? "farmer-dash"
                        : user.role === "worker"
                          ? "worker-dash"
                          : "officer-dash",
                    );
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-white border border-[#D5E2D3] text-gray-800 font-bold rounded-xl text-xs flex items-center justify-between"
                >
                  <span>Signed in as: <strong>{user.name}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] text-[10px] uppercase font-black">
                    {user.role}
                  </span>
                </button>

                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs border border-red-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t("logout")}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigateTo("auth");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4 text-[#F9A825]" />
                <span>{t("login")}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
