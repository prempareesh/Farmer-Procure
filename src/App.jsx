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

// Full Functional Views
import AuthView from './views/AuthView';
import ProfileView from './views/ProfileView';
import SlotBookingView from './views/SlotBookingView';
import LiveQueueView from './views/LiveQueueView';
import QRScannerView from './views/QRScannerView';
import AuditChainView from './views/AuditChainView';
import AdminDashboardView from './views/AdminDashboardView';

function MainApp() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen w-screen bg-[#F4F8F2] text-[#1B1B1B] flex flex-col justify-between relative selection:bg-[#2E7D32] selection:text-white">
      
      {/* 1. Universal Top Navigation Bar */}
      <Header />

      {/* 2. Main Content View Routing */}
      {currentView === 'home' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <HeroSection />
          <FeatureCards />
          <ImpactStrip />
        </div>
      )}

      {currentView === 'auth' && <AuthView />}
      {currentView === 'profile' && <ProfileView />}
      {currentView === 'book-slot' && <SlotBookingView />}
      {currentView === 'queue' && <LiveQueueView />}
      {currentView === 'qr-scanner' && <QRScannerView />}
      {currentView === 'audit' && <AuditChainView />}
      {currentView === 'dashboard' && <AdminDashboardView />}

      {/* 3. Global Modals & Drawers */}
      <NotificationDrawer />
      <AboutModal />
      <HowItWorksModal />
      <ContactModal />

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
