import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import ImpactStrip from './components/ImpactStrip';
import NotificationDrawer from './components/NotificationDrawer';
import AboutModal from './components/AboutModal';
import HowItWorksModal from './components/HowItWorksModal';
import ContactModal from './components/ContactModal';
import LanguageModal from './components/LanguageModal';

// Dedicated Role-Based Views
import AuthView from './views/AuthView';
import FarmerDashboardView from './views/FarmerDashboardView';
import WorkerDashboardView from './views/WorkerDashboardView';
import OfficerDashboardView from './views/OfficerDashboardView';
import ProfileView from './views/ProfileView';
import SlotBookingView from './views/SlotBookingView';
import LiveQueueView from './views/LiveQueueView';
import QRScannerView from './views/QRScannerView';
import AuditChainView from './views/AuditChainView';

function MainApp() {
  const { currentView, languageModalOpen, setLanguageModalOpen } = useApp();

  return (
    <div className="min-h-screen w-screen bg-[#F4F8F2] text-[#1B1B1B] flex flex-col justify-between relative selection:bg-[#2E7D32] selection:text-white">
      
      {/* 1. Universal Header Navigation Bar */}
      <Header />

      {/* 2. Main Role Views & Routing */}
      {currentView === 'home' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <HeroSection />
          <FeatureCards />
          <ImpactStrip />
        </div>
      )}

      {currentView === 'auth' && <AuthView />}
      {currentView === 'farmer-dash' && <FarmerDashboardView />}
      {currentView === 'worker-dash' && <WorkerDashboardView />}
      {currentView === 'officer-dash' && <OfficerDashboardView />}
      {currentView === 'profile' && <ProfileView />}
      {currentView === 'book-slot' && <SlotBookingView />}
      {currentView === 'queue' && <LiveQueueView />}
      {currentView === 'qr-scanner' && <QRScannerView />}
      {currentView === 'audit' && <AuditChainView />}

      {/* 3. Global Modals & Notifications */}
      <NotificationDrawer />
      <AboutModal />
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
