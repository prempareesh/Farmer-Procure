import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import SolutionFlowSection from "./components/SolutionFlowSection";
import HowAgriProcureWorks from "./components/HowAgriProcureWorks";
import BenefitsSection from "./components/BenefitsSection";
import TrustSection from "./components/TrustSection";
import FinalCtaBand from "./components/FinalCtaBand";
import NotificationDrawer from "./components/NotificationDrawer";
import HowItWorksModal from "./components/HowItWorksModal";
import ContactModal from "./components/ContactModal";
import LanguageModal from "./components/LanguageModal";

// Dedicated Role-Based Views (Authenticated App Views)
import AuthView from "./views/AuthView";
import FarmerDashboardView from "./views/FarmerDashboardView";
import WorkerDashboardView from "./views/WorkerDashboardView";
import OfficerDashboardView from "./views/OfficerDashboardView";
import ProfileView from "./views/ProfileView";
import SlotBookingView from "./views/SlotBookingView";
import LiveQueueView from "./views/LiveQueueView";
import QRScannerView from "./views/QRScannerView";
import AuditChainView from "./views/AuditChainView";

function MainApp() {
  const { user, currentView, languageModalOpen, setLanguageModalOpen } =
    useApp();

  // Public Pre-Login SPA views redirect to home SPA
  const isPublicSpaView =
    currentView === "home" ||
    currentView === "about" ||
    currentView === "features" ||
    currentView === "how-it-works";

  return (
    <div className="min-h-screen w-screen bg-[#050805] text-[#E8E7DE] flex flex-col justify-between relative selection:bg-[#164A29] selection:text-[#79C267]">
      {/* 1. Universal Header Navigation Bar */}
      <Header />

      {/* 2. Single Pre-Login SPA Experience */}
      {isPublicSpaView && (
        <main className="flex-1 flex flex-col justify-between overflow-x-hidden">
          <HeroSection />
          <ProblemSection />
          <SolutionFlowSection />
          <HowAgriProcureWorks />
          <BenefitsSection />
          <TrustSection />
          <FinalCtaBand />
        </main>
      )}

      {/* 3. Authenticated Application Views with Strict Role Guards */}
      {currentView === "auth" && <AuthView />}
      {currentView === "farmer-dash" && <FarmerDashboardView />}

      {/* Staff / Worker Dashboard Guard */}
      {currentView === "worker-dash" &&
        (user?.role === "worker" || user?.role === "staff" ? (
          <WorkerDashboardView />
        ) : user?.role === "officer" ? (
          <OfficerDashboardView />
        ) : (
          <FarmerDashboardView />
        ))}

      {/* Officer Command Tower Guard */}
      {currentView === "officer-dash" &&
        (user?.role === "officer" ? (
          <OfficerDashboardView />
        ) : user?.role === "worker" || user?.role === "staff" ? (
          <WorkerDashboardView />
        ) : (
          <FarmerDashboardView />
        ))}

      {/* Audit Ledger Guard (Officer Only) */}
      {currentView === "audit" &&
        (user?.role === "officer" ? (
          <AuditChainView />
        ) : user?.role === "worker" || user?.role === "staff" ? (
          <WorkerDashboardView />
        ) : (
          <FarmerDashboardView />
        ))}

      {currentView === "profile" && <ProfileView />}
      {currentView === "book-slot" && <SlotBookingView />}
      {currentView === "queue" && <LiveQueueView />}
      {currentView === "qr-scanner" &&
        (user?.role === "worker" || user?.role === "staff" ? (
          <QRScannerView />
        ) : (
          <FarmerDashboardView />
        ))}

      {/* 4. Global Modals & Notifications */}
      <NotificationDrawer />
      <HowItWorksModal />
      <ContactModal />
      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
