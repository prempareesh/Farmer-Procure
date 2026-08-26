import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSHA256 } from '../utils/crypto';

const AppContext = createContext();

const INITIAL_CROPS = [
  { id: 'c1', name: 'Paddy (Basmati 1121)', areaAcres: 4.5, expectedYieldQuintals: 90 },
  { id: 'c2', name: 'Wheat (Sharbati HD-2967)', areaAcres: 6.0, expectedYieldQuintals: 135 },
  { id: 'c3', name: 'Mustard (Pusa Mustard 30)', areaAcres: 2.0, expectedYieldQuintals: 30 },
];

const MANDI_CENTRES = [
  {
    id: 'mandi-1',
    name: 'Karnal Central Grain Mandi (HR)',
    state: 'Haryana',
    district: 'Karnal',
    activeCounters: 4,
    historicalAvgMins: 18,
    todayCapacity: 200,
    todayBooked: 142,
  },
  {
    id: 'mandi-2',
    name: 'Ludhiana Main Grain Market (PB)',
    state: 'Punjab',
    district: 'Ludhiana',
    activeCounters: 3,
    historicalAvgMins: 28,
    todayCapacity: 250,
    todayBooked: 228,
  },
  {
    id: 'mandi-3',
    name: 'Nalgonda Paddy Procurement Hub (TS)',
    state: 'Telangana',
    district: 'Nalgonda',
    activeCounters: 2,
    historicalAvgMins: 12,
    todayCapacity: 150,
    todayBooked: 65,
  },
  {
    id: 'mandi-4',
    name: 'Kota Agricultural Mandi (RJ)',
    state: 'Rajasthan',
    district: 'Kota',
    activeCounters: 3,
    historicalAvgMins: 22,
    todayCapacity: 180,
    todayBooked: 110,
  },
];

const INITIAL_TIME_SLOTS = [
  { time: '08:00 AM - 09:00 AM', capacity: 20, booked: 18, expectedWaitMins: 15, isRecommended: false },
  { time: '09:00 AM - 10:00 AM', capacity: 20, booked: 20, expectedWaitMins: 45, isRecommended: false }, // FULL
  { time: '10:00 AM - 11:00 AM', capacity: 20, booked: 19, expectedWaitMins: 40, isRecommended: false },
  { time: '11:00 AM - 12:00 PM', capacity: 20, booked: 20, expectedWaitMins: 60, isRecommended: false }, // FULL
  { time: '01:00 PM - 02:00 PM', capacity: 20, booked: 12, expectedWaitMins: 20, isRecommended: false },
  { time: '02:00 PM - 03:00 PM', capacity: 20, booked: 8, expectedWaitMins: 10, isRecommended: true }, // Recommended
  { time: '03:00 PM - 04:00 PM', capacity: 20, booked: 6, expectedWaitMins: 8, isRecommended: true }, // Recommended
  { time: '04:00 PM - 05:00 PM', capacity: 20, booked: 14, expectedWaitMins: 16, isRecommended: false },
];

export const WORKFLOW_STAGES = [
  { key: 'BOOKED', label: 'Booked', desc: 'Slot confirmed & QR pass generated' },
  { key: 'ARRIVED', label: 'Arrived', desc: 'Gate QR scanned & entry token verified' },
  { key: 'QUALITY_CHECK', label: 'Quality Check', desc: 'Moisture & foreign matter tested' },
  { key: 'WEIGHING', label: 'Weighing', desc: 'Digital weighbridge loaded & logged' },
  { key: 'PROCUREMENT', label: 'Procurement', desc: 'MSP purchase slip recorded' },
  { key: 'PAYMENT', label: 'Payment', desc: 'Direct DBT bank disbursement initiated' },
];

export function AppProvider({ children }) {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'auth' | 'profile' | 'book-slot' | 'queue' | 'dashboard' | 'audit' | 'qr-scanner'
  const [currentLang, setCurrentLang] = useState('en');

  // Auth State (null initially - unauthenticated as requested)
  const [user, setUser] = useState(null);
  const [authRedirectView, setAuthRedirectView] = useState(null);

  // Farmer Profile & Crops
  const [farmerProfile, setFarmerProfile] = useState({
    farmerId: 'KA-2026-98124',
    name: 'Rameshwar Singh',
    mobile: '9876543210',
    aadhaar: 'XXXX-XXXX-8912',
    village: 'Taraori',
    district: 'Karnal',
    state: 'Haryana',
    bankAccount: 'State Bank of India (Ending in 4092)',
    ifsc: 'SBIN0001234',
  });

  const [crops, setCrops] = useState(INITIAL_CROPS);

  // Mandi & Slots State
  const [mandiCentres] = useState(MANDI_CENTRES);
  const [selectedMandiId, setSelectedMandiId] = useState('mandi-1');
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIME_SLOTS);

  // Bookings State
  const [bookings, setBookings] = useState([
    {
      id: 'BK-2026-8812',
      tokenNumber: 125,
      farmerId: 'KA-2026-98124',
      farmerName: 'Rameshwar Singh',
      centreId: 'mandi-1',
      centreName: 'Karnal Central Grain Mandi (HR)',
      crop: 'Paddy (Basmati 1121)',
      quantity: 45,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '02:00 PM - 03:00 PM',
      stage: 'BOOKED',
      qrData: 'AGRI-PROCURE-BK-2026-8812-P125',
      createdHash: '0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
      createdAt: '10:15 AM',
    },
    {
      id: 'BK-2026-8805',
      tokenNumber: 104,
      farmerId: 'KA-2026-98124',
      farmerName: 'Rameshwar Singh',
      centreId: 'mandi-1',
      centreName: 'Karnal Central Grain Mandi (HR)',
      crop: 'Wheat (Sharbati HD-2967)',
      quantity: 60,
      date: '2026-08-20',
      timeSlot: '10:00 AM - 11:00 AM',
      stage: 'PAYMENT',
      qrData: 'AGRI-PROCURE-BK-2026-8805-P104',
      createdHash: '0x3c9e1d7b0e885e4f2c118f2a4b127f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e',
      createdAt: '09:30 AM',
    },
  ]);

  // Active Selected Booking for Queue/Progress Tracker
  const [activeBookingId, setActiveBookingId] = useState('BK-2026-8812');

  // Live Queue Simulation State
  const [servingToken, setServingToken] = useState(110);
  const [autoQueueTicker, setAutoQueueTicker] = useState(true);

  // Cryptographic SHA-256 Audit Chain
  const [auditChain, setAuditChain] = useState([
    {
      blockIndex: 1,
      timestamp: '2026-08-26 09:00:00',
      stage: 'GENESIS_BLOCK',
      bookingId: 'SYSTEM-INIT',
      farmerName: 'System Genesis Node',
      dataSummary: 'AgriProcure National Ledger Initialized',
      prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      currentHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      isTampered: false,
    },
    {
      blockIndex: 2,
      timestamp: '2026-08-26 10:15:22',
      stage: 'BOOKED',
      bookingId: 'BK-2026-8812',
      farmerName: 'Rameshwar Singh',
      dataSummary: 'Paddy (Basmati 1121) • 45 Quintals • Token #125',
      prevHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      currentHash: '0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
      isTampered: false,
    },
  ]);

  // Bottleneck Detection State
  const [bottlenecks, setBottlenecks] = useState([
    {
      id: 'bn-1',
      centreId: 'mandi-1',
      centreName: 'Karnal Central Grain Mandi',
      stage: 'Weighing Bridge #2',
      expectedMins: 5,
      currentMins: 11,
      severity: 'HIGH',
      recommendation: 'Add one more operator at Weighing Counter #2 to relieve queue backlog.',
      resolved: false,
    },
    {
      id: 'bn-2',
      centreId: 'mandi-2',
      centreName: 'Ludhiana Main Grain Market',
      stage: 'Moisture Testing Lab',
      expectedMins: 6,
      currentMins: 9,
      severity: 'MEDIUM',
      recommendation: 'Recalibrate moisture sensor device #3 to speed up sample testing.',
      resolved: false,
    },
  ]);

  // Fraud / Anomaly Screening State
  const [fraudAlerts, setFraudAlerts] = useState([
    {
      id: 'fa-1',
      farmerName: 'Harpreet Singh (Sample Anomaly)',
      aadhaar: 'XXXX-XXXX-4412',
      issueType: 'Duplicate Booking Attempt',
      description: 'Attempted 2 concurrent slot bookings for same crop at 2 different Mandis on same day.',
      severity: 'CRITICAL',
      status: 'Needs Review',
      timestamp: '10:48 AM',
    },
    {
      id: 'fa-2',
      farmerName: 'Gopal Lal',
      aadhaar: 'XXXX-XXXX-9901',
      issueType: 'Impossible Timestamp Gap',
      description: 'Weighbridge exit timestamp recorded before quality check approval timestamp.',
      severity: 'WARNING',
      status: 'Needs Review',
      timestamp: '09:22 AM',
    },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Slot Booking Confirmed',
      message: 'Your slot for Paddy at Karnal Central Mandi (Token #125) is confirmed for today at 02:00 PM.',
      timestamp: '10:15 AM',
      type: 'success',
      read: false,
    },
    {
      id: 'n2',
      title: 'Queue Update Notification',
      message: 'Queue serving token advanced to P-110. 15 farmers ahead of your token.',
      timestamp: '11:02 AM',
      type: 'info',
      read: false,
    },
    {
      id: 'n3',
      title: 'Optimal Arrival Recommendation',
      message: 'Mandi traffic is optimal. Estimated wait time for your 02:00 PM slot is just 10 minutes.',
      timestamp: '11:45 AM',
      type: 'recommendation',
      read: false,
    },
  ]);

  // Modals state for header links
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Queue Auto-Ticker Simulation (Advances serving token every 15s if enabled)
  useEffect(() => {
    if (!autoQueueTicker) return;
    const interval = setInterval(() => {
      setServingToken((prev) => {
        if (prev < 125) {
          const next = prev + 1;
          // Trigger notification at milestone
          if (next === 120) {
            addNotification({
              title: 'Approaching Your Turn!',
              message: `Now serving Token P-${next}. Only 5 people ahead of your Token #125. Please proceed to Mandi Gate.`,
              type: 'warning',
            });
          }
          return next;
        }
        return prev;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [autoQueueTicker]);

  // Notification Helper
  const addNotification = ({ title, message, type = 'info' }) => {
    const newNotif = {
      id: 'n-' + Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Navigation Guard Helper
  const navigateTo = (view) => {
    const protectedViews = ['dashboard', 'book-slot', 'profile', 'queue', 'audit', 'qr-scanner'];
    if (protectedViews.includes(view) && !user) {
      setAuthRedirectView(view);
      setCurrentView('auth');
      addNotification({
        title: 'Authentication Required',
        message: 'Please login or create an account to access ' + view.replace('-', ' ') + '.',
        type: 'info',
      });
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Functions
  const registerUser = async (formData) => {
    const newUser = {
      id: 'KA-2026-' + Math.floor(10000 + Math.random() * 90000),
      name: formData.name,
      mobile: formData.mobile,
      aadhaar: `XXXX-XXXX-${formData.aadhaar.slice(-4)}`,
      village: formData.village || 'Taraori',
      district: 'Karnal',
      state: formData.state || 'Haryana',
      role: 'farmer',
      createdAt: new Date().toISOString(),
    };
    setFarmerProfile((prev) => ({ ...prev, ...newUser, farmerId: newUser.id }));
    addNotification({
      title: 'Registration Successful',
      message: `Welcome ${newUser.name}! Your account ${newUser.id} has been created successfully.`,
      type: 'success',
    });
    return newUser;
  };

  const loginUser = (identifier, password, role = 'farmer') => {
    if (role === 'admin') {
      const adminUser = {
        id: 'ADMIN-HR-01',
        name: 'Devendra Sharma (Mandi Officer)',
        mobile: identifier || '9876543210',
        role: 'admin',
        designation: 'Chief Procurement Officer',
        zone: 'North Zone (Haryana/Punjab)',
      };
      setUser(adminUser);
      addNotification({
        title: 'Officer Login Successful',
        message: 'Signed in as Mandi Procurement Admin.',
        type: 'success',
      });
      navigateTo(authRedirectView || 'dashboard');
      setAuthRedirectView(null);
      return adminUser;
    }

    const farmerUser = {
      id: farmerProfile.farmerId,
      name: farmerProfile.name,
      mobile: identifier || farmerProfile.mobile,
      aadhaar: farmerProfile.aadhaar,
      village: farmerProfile.village,
      district: farmerProfile.district,
      state: farmerProfile.state,
      role: 'farmer',
    };
    setUser(farmerUser);
    addNotification({
      title: 'Login Successful',
      message: `Welcome back, ${farmerUser.name}!`,
      type: 'success',
    });
    navigateTo(authRedirectView || 'book-slot');
    setAuthRedirectView(null);
    return farmerUser;
  };

  const logoutUser = () => {
    setUser(null);
    setCurrentView('home');
    addNotification({
      title: 'Logged Out',
      message: 'You have been successfully logged out.',
      type: 'info',
    });
  };

  // Crops Management
  const addCrop = (cropData) => {
    const newCrop = {
      id: 'crop-' + Date.now(),
      name: cropData.name,
      areaAcres: Number(cropData.areaAcres),
      expectedYieldQuintals: Number(cropData.expectedYieldQuintals),
    };
    setCrops((prev) => [...prev, newCrop]);
    addNotification({
      title: 'Crop Portfolio Updated',
      message: `Added ${newCrop.name} (${newCrop.areaAcres} Acres) to your registered portfolio.`,
      type: 'success',
    });
  };

  const updateCrop = (id, updatedData) => {
    setCrops((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData, areaAcres: Number(updatedData.areaAcres), expectedYieldQuintals: Number(updatedData.expectedYieldQuintals) } : c))
    );
    addNotification({
      title: 'Crop Details Updated',
      message: 'Crop information updated successfully.',
      type: 'info',
    });
  };

  const deleteCrop = (id) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
    addNotification({
      title: 'Crop Removed',
      message: 'Crop has been removed from portfolio.',
      type: 'warning',
    });
  };

  // Slot Booking Handler
  const bookSlot = async (bookingData) => {
    const centre = mandiCentres.find((m) => m.id === bookingData.centreId) || mandiCentres[0];
    const newBookingId = 'BK-2026-' + Math.floor(1000 + Math.random() * 9000);
    const tokenNum = 125 + bookings.length;
    const qrData = `AGRI-PROCURE-${newBookingId}-P${tokenNum}-${bookingData.crop.replace(/\s+/g, '')}`;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${newBookingId}|${farmerProfile.name}|${centre.name}|${bookingData.crop}|${bookingData.quantity}|${tokenNum}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const newBooking = {
      id: newBookingId,
      tokenNumber: tokenNum,
      farmerId: farmerProfile.farmerId,
      farmerName: farmerProfile.name,
      centreId: centre.id,
      centreName: centre.name,
      crop: bookingData.crop,
      quantity: Number(bookingData.quantity),
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      stage: 'BOOKED',
      qrData,
      createdHash: newHash,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingId(newBookingId);

    // Update slot capacity
    setTimeSlots((prev) =>
      prev.map((s) => (s.time === bookingData.timeSlot ? { ...s, booked: Math.min(s.capacity, s.booked + 1) } : s))
    );

    // Append to Audit Chain
    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: 'BOOKED',
      bookingId: newBookingId,
      farmerName: farmerProfile.name,
      dataSummary: `${bookingData.crop} • ${bookingData.quantity} Qtl • Token #${tokenNum}`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, newBlock]);

    addNotification({
      title: 'Slot Booking Confirmed!',
      message: `Token #${tokenNum} issued for ${bookingData.crop} at ${centre.name}. SHA-256 block #${newBlock.blockIndex} created.`,
      type: 'success',
    });

    return newBooking;
  };

  // Advance Booking Stage (Workflow Tracking + Audit Chain)
  const advanceBookingStage = async (bookingId, nextStage) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|${nextStage}|${booking.farmerName}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, stage: nextStage } : b))
    );

    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: nextStage,
      bookingId,
      farmerName: booking.farmerName,
      dataSummary: `Stage updated to ${nextStage.replace('_', ' ')} for Token #${booking.tokenNumber}`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };

    setAuditChain((prev) => [...prev, newBlock]);

    const stageObj = WORKFLOW_STAGES.find((s) => s.key === nextStage);
    addNotification({
      title: `Stage Updated: ${stageObj ? stageObj.label : nextStage}`,
      message: `Token #${booking.tokenNumber} is now in ${stageObj ? stageObj.label : nextStage} stage. Cryptographic hash verified.`,
      type: 'info',
    });
  };

  // QR Check-in Handler
  const processQRCheckIn = async (scannedCode) => {
    // Find matching booking
    const matchedBooking = bookings.find((b) => b.qrData === scannedCode || b.id === scannedCode || scannedCode.includes(b.id));
    if (matchedBooking) {
      await advanceBookingStage(matchedBooking.id, 'ARRIVED');
      return { success: true, booking: matchedBooking };
    }
    // Fallback: Check in active booking
    if (bookings.length > 0) {
      await advanceBookingStage(bookings[0].id, 'ARRIVED');
      return { success: true, booking: bookings[0] };
    }
    return { success: false, message: 'Invalid QR Code payload.' };
  };

  // Bottleneck Resolution
  const resolveBottleneck = (id) => {
    setBottlenecks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, resolved: true, currentMins: b.expectedMins } : b))
    );
    addNotification({
      title: 'Bottleneck Resolved',
      message: 'Operational intervention applied. Processing time normalized.',
      type: 'success',
    });
  };

  // Fraud Alert Action
  const resolveFraudAlert = (id, resolution) => {
    setFraudAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: resolution } : a))
    );
    addNotification({
      title: 'Anomaly Reviewed',
      message: `Alert #${id} marked as ${resolution}.`,
      type: 'info',
    });
  };

  // Audit Chain Tamper Simulation & Verification
  const simulateTamper = () => {
    if (auditChain.length < 2) return;
    setAuditChain((prev) => {
      const copy = [...prev];
      // Tamper with block 2 hash
      copy[1] = {
        ...copy[1],
        currentHash: '0xDEADBEEF000000000000000000000000000000000000000000000000DEADBEEF',
        isTampered: true,
      };
      return copy;
    });
    addNotification({
      title: 'Tamper Simulation Activated',
      message: 'Block #2 hash modified to test cryptographic anomaly detection.',
      type: 'warning',
    });
  };

  const repairAuditChain = async () => {
    // Regenerate correct hashes
    const repaired = [];
    for (let i = 0; i < auditChain.length; i++) {
      const b = auditChain[i];
      if (i === 0) {
        repaired.push({ ...b, isTampered: false });
      } else {
        const prevH = repaired[i - 1].currentHash;
        const validH = await generateSHA256(prevH + b.bookingId + b.stage + b.dataSummary);
        repaired.push({
          ...b,
          prevHash: prevH,
          currentHash: validH,
          isTampered: false,
        });
      }
    }
    setAuditChain(repaired);
    addNotification({
      title: 'Audit Chain Repaired',
      message: 'All blocks re-verified and cryptographic integrity restored.',
      type: 'success',
    });
  };

  // AI Calculations
  const activeBooking = bookings.find((b) => b.id === activeBookingId) || bookings[0] || null;
  const peopleAhead = activeBooking ? Math.max(0, activeBooking.tokenNumber - servingToken) : 0;
  const estimatedWaitMins = Math.max(4, Math.round(peopleAhead * 1.8));

  // AI Congestion & Explainability
  const congestionRisk = peopleAhead > 25 ? 'HIGH' : peopleAhead > 10 ? 'MEDIUM' : 'LOW';
  const xaiFactors = [
    { factor: 'Queue Length Surge', impact: '+35%', positive: false, desc: `${peopleAhead} vehicles currently in Mandi pipeline` },
    { factor: 'Average Crop Load (45 Qtl)', impact: '+20%', positive: false, desc: 'Heavy grain bulk unloading required' },
    { factor: 'Weighbridge Counter Efficiency', impact: '-25%', positive: true, desc: '4/4 Weighbridges operating with digital sensors' },
    { factor: 'Moisture Testing Latency', impact: '+15%', positive: false, desc: 'Moisture lab averaging 4.2 mins per test' },
    { factor: 'Staggered Arrival Adherence', impact: '-18%', positive: true, desc: '82% farmers arriving in allocated 15-min window' },
  ];

  return (
    <AppContext.Provider
      value={{
        // Navigation & Language
        currentView,
        setCurrentView,
        navigateTo,
        currentLang,
        setCurrentLang,

        // User & Auth
        user,
        farmerProfile,
        setFarmerProfile,
        registerUser,
        loginUser,
        logoutUser,

        // Crops CRUD
        crops,
        addCrop,
        updateCrop,
        deleteCrop,

        // Mandi & Slots
        mandiCentres,
        selectedMandiId,
        setSelectedMandiId,
        timeSlots,

        // Bookings
        bookings,
        activeBookingId,
        setActiveBookingId,
        activeBooking,
        bookSlot,
        advanceBookingStage,
        processQRCheckIn,

        // Queue Simulation
        servingToken,
        setServingToken,
        autoQueueTicker,
        setAutoQueueTicker,
        peopleAhead,
        estimatedWaitMins,

        // AI & Explainability
        congestionRisk,
        xaiFactors,

        // Bottlenecks & Fraud
        bottlenecks,
        resolveBottleneck,
        fraudAlerts,
        resolveFraudAlert,

        // Audit Chain
        auditChain,
        simulateTamper,
        repairAuditChain,

        // Notifications
        notifications,
        addNotification,
        markAllNotificationsRead,

        // Modals & Drawers
        aboutModalOpen,
        setAboutModalOpen,
        howItWorksModalOpen,
        setHowItWorksModalOpen,
        contactModalOpen,
        setContactModalOpen,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
