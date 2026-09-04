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

  // Nav Items
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
    <header className="sticky top-0 w-full bg-[#050805]/95 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between z-40 shrink-0 border-b border-[#1A2E1E] transition-all">
      {/* LEFT: Logo & Brand */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => navigateTo("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#12351F] border border-[#1A2E1E] flex items-center justify-center text-[#79C267]">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-normal text-[#F2F0E8] tracking-wider leading-none">
              AGRIPROCURE
            </h1>
          </div>
        </div>
      </div>

      {/* CENTER: Navigation Links */}
      <nav className="hidden md:flex items-center gap-7">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.name}
              onClick={item.action}
              className={`relative py-1 text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "text-[#79C267]"
                  : "text-[#A6ADA3] hover:text-[#F2F0E8]"
              }`}
            >
              {item.name}
              {isActive && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#79C267]" />
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
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#E8E7DE] bg-[#071008] hover:bg-[#0A120C] rounded-lg transition-all border border-[#1A2E1E] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#79C267]" />
            <span>
              {
                languages
                  .find((l) => l.code === currentLang)
                  ?.name.split(" ")[0]
              }
            </span>
            <ChevronDown className="w-3 h-3 text-[#A6ADA3]" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#071008] rounded-xl shadow-2xl border border-[#1A2E1E] py-1.5 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    localStorage.setItem("agri_lang", lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    currentLang === lang.code
                      ? "bg-[#12351F] text-[#79C267]"
                      : "text-[#E8E7DE] hover:bg-[#0A120C]"
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
              className="relative p-2.5 rounded-lg bg-[#071008] border border-[#1A2E1E] hover:bg-[#0A120C] text-[#E8E7DE] hover:text-[#79C267] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#79C267] text-[#050805] text-[9px] font-black flex items-center justify-center">
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#F2F0E8] bg-[#12351F] border border-[#1A2E1E] hover:bg-[#164A29] cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-[#79C267] text-[#050805] font-black flex items-center justify-center text-[10px]">
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
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("logout")}</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigateTo("auth")}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold tracking-wider text-[#F2F0E8] bg-[#12351F] hover:bg-[#164A29] border border-[#1A2E1E] transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#79C267]" />
            <span>{t("login")}</span>
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#E8E7DE] hover:text-[#79C267] cursor-pointer"
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
        <div className="absolute top-16 left-0 right-0 bg-[#071008] border-b border-[#1A2E1E] p-4 space-y-3 shadow-2xl z-50 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                item.action();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 font-bold text-[#E8E7DE] hover:text-[#79C267] cursor-pointer"
            >
              {item.name}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-[#1A2E1E]">
            {user ? (
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-red-950/40 border border-red-900/50 text-red-400 font-bold rounded-lg text-xs cursor-pointer"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  navigateTo("auth");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#12351F] border border-[#1A2E1E] text-[#F2F0E8] font-bold rounded-lg text-xs cursor-pointer"
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
