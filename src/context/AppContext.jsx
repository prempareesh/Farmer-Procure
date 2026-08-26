import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSHA256 } from '../utils/crypto';
import { translations } from '../i18n/translations';

const AppContext = createContext();

const INITIAL_CROPS = [
  { id: 'c1', name: 'Paddy (Basmati 1121)', areaAcres: 4.5, expectedYieldQuintals: 90, mspPerQtl: 2320 },
  { id: 'c2', name: 'Wheat (Sharbati HD-2967)', areaAcres: 6.0, expectedYieldQuintals: 135, mspPerQtl: 2425 },
  { id: 'c3', name: 'Mustard (Pusa Mustard 30)', areaAcres: 2.0, expectedYieldQuintals: 30, mspPerQtl: 5650 },
  { id: 'c4', name: 'Soya (JS-335)', areaAcres: 3.5, expectedYieldQuintals: 45, mspPerQtl: 4892 },
];

const MANDI_CENTRES = [
  {
    id: 'mandi-1',
    code: 'K',
    name: 'Karnal Central Grain Mandi (HR)',
    state: 'Haryana',
    district: 'Karnal',
    activeCounters: 4,
    historicalAvgMins: 18,
    todayCapacity: 200,
    todayBooked: 142,
    tokenPrefix: 'K',
    currentServing: 110,
  },
  {
    id: 'mandi-2',
    code: 'L',
    name: 'Ludhiana Main Grain Market (PB)',
    state: 'Punjab',
    district: 'Ludhiana',
    activeCounters: 3,
    historicalAvgMins: 28,
    todayCapacity: 250,
    todayBooked: 228,
    tokenPrefix: 'L',
    currentServing: 85,
  },
  {
    id: 'mandi-3',
    code: 'N',
    name: 'Nalgonda Paddy Procurement Hub (TS)',
    state: 'Telangana',
    district: 'Nalgonda',
    activeCounters: 2,
    historicalAvgMins: 12,
    todayCapacity: 150,
    todayBooked: 65,
    tokenPrefix: 'N',
    currentServing: 42,
  },
  {
    id: 'mandi-4',
    code: 'Q',
    name: 'Kota Agricultural Mandi (RJ)',
    state: 'Rajasthan',
    district: 'Kota',
    activeCounters: 3,
    historicalAvgMins: 22,
    todayCapacity: 180,
    todayBooked: 110,
    tokenPrefix: 'Q',
    currentServing: 78,
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
  { key: 'BOOKED', label: 'Booked', desc: 'Slot confirmed & digital pass issued' },
  { key: 'ARRIVED', label: 'Arrived', desc: 'Gate face biometric verification confirmed' },
  { key: 'WEIGHING', label: 'Weighing', desc: 'Digital weighbridge loaded & gross tare recorded' },
  { key: 'QUALITY_CHECK', label: 'Quality Check', desc: 'Moisture (<17%) & foreign matter tested' },
  { key: 'PROCUREMENT', label: 'Procurement', desc: 'Official MSP purchase voucher logged' },
  { key: 'PAYMENT', label: 'Payment', desc: 'Direct DBT bank disbursement initiated' },
  { key: 'COMPLETED', label: 'Completed', desc: 'Procurement cycle completed with SHA-256 seal' },
];

export function AppProvider({ children }) {
  // 1. Language & Internationalization State
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('agri_lang') || 'en');
  const [languageModalOpen, setLanguageModalOpen] = useState(() => !localStorage.getItem('agri_lang_chosen'));

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  // 2. Navigation State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'auth' | 'farmer-dash' | 'worker-dash' | 'officer-dash' | 'book-slot' | 'queue' | 'profile' | 'audit' | 'qr-scanner'
  const [authRedirectView, setAuthRedirectView] = useState(null);

  // 3. User Authentication State (3 Roles: 'farmer' | 'worker' | 'officer')
  const [user, setUser] = useState(null);

  // Registered Farmers Database (for search & verification)
  const [farmersList, setFarmersList] = useState([
    {
      farmerId: 'FRM-2026-000123',
      name: 'Rameshwar Singh',
      mobile: '9876543210',
      aadhaar: 'XXXX-XXXX-8912',
      village: 'Taraori',
      district: 'Karnal',
      state: 'Haryana',
      address: 'Plot #42, Main GT Road, Taraori Tehsil',
      faceImage: '/hero_farmer.jpg',
      bankAccount: 'State Bank of India (Ending in 4092)',
      ifsc: 'SBIN0001234',
      crops: INITIAL_CROPS,
      history: [
        { season: 'Rabi 2025', crop: 'Wheat', quantity: 120, mspPaid: '₹2,73,000', status: 'COMPLETED', dbtRef: 'DBT-2025-88124' },
        { season: 'Kharif 2025', crop: 'Paddy', quantity: 85, mspPaid: '₹1,87,000', status: 'COMPLETED', dbtRef: 'DBT-2025-44912' },
      ],
    },
    {
      farmerId: 'FRM-2026-000124',
      name: 'Gurpreet Singh',
      mobile: '9812345678',
      aadhaar: 'XXXX-XXXX-3341',
      village: 'Samana',
      district: 'Patiala',
      state: 'Punjab',
      address: 'VPO Samana, District Patiala',
      faceImage: '/farmer_ultra_green.jpg',
      bankAccount: 'Punjab National Bank (Ending in 1184)',
      ifsc: 'PUNB0023400',
      crops: [
        { id: 'c10', name: 'Wheat (HD-3086)', areaAcres: 8.0, expectedYieldQuintals: 180, mspPerQtl: 2425 },
      ],
      history: [
        { season: 'Rabi 2025', crop: 'Wheat', quantity: 160, mspPaid: '₹3,64,000', status: 'COMPLETED', dbtRef: 'DBT-2025-99014' },
      ],
    },
  ]);

  // Current Logged-in Farmer Profile
  const [farmerProfile, setFarmerProfile] = useState(farmersList[0]);
  const [crops, setCrops] = useState(INITIAL_CROPS);

  // Mandi & Slots State
  const [mandiCentres] = useState(MANDI_CENTRES);
  const [selectedMandiId, setSelectedMandiId] = useState('mandi-1');
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIME_SLOTS);

  // Bookings State with Centre Token Sequencing (e.g. K001, K002)
  const [bookings, setBookings] = useState([
    {
      id: 'BK-2026-8812',
      farmerId: 'FRM-2026-000123',
      farmerName: 'Rameshwar Singh',
      centreId: 'mandi-1',
      centreCode: 'K',
      centreName: 'Karnal Central Grain Mandi (HR)',
      tokenDisplay: 'K00125',
      tokenSeq: 125,
      crop: 'Paddy (Basmati 1121)',
      quantity: 45,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '02:00 PM - 03:00 PM',
      stage: 'BOOKED',
      stageStatus: 'PENDING',
      faceVerified: false,
      rejectionDetails: null,
      paymentDetails: {
        mspPerQtl: 2320,
        grossAmount: 104400,
        dbtTxnId: 'DBT-PENDING',
        disbursed: false,
      },
      qrData: 'AGRI-PROCURE-FRM-2026-000123-K00125-PADDY',
      createdHash: '0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
      createdAt: '10:15 AM',
    },
    {
      id: 'BK-2026-8805',
      farmerId: 'FRM-2026-000124',
      farmerName: 'Gurpreet Singh',
      centreId: 'mandi-2',
      centreCode: 'L',
      centreName: 'Ludhiana Main Grain Market (PB)',
      tokenDisplay: 'L00088',
      tokenSeq: 88,
      crop: 'Wheat (HD-3086)',
      quantity: 60,
      date: '2026-08-26',
      timeSlot: '10:00 AM - 11:00 AM',
      stage: 'WEIGHING',
      stageStatus: 'IN_PROGRESS',
      faceVerified: true,
      rejectionDetails: null,
      paymentDetails: {
        mspPerQtl: 2425,
        grossAmount: 145500,
        dbtTxnId: 'DBT-PENDING',
        disbursed: false,
      },
      qrData: 'AGRI-PROCURE-FRM-2026-000124-L00088-WHEAT',
      createdHash: '0x3c9e1d7b0e885e4f2c118f2a4b127f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e',
      createdAt: '09:30 AM',
    },
  ]);

  const [activeBookingId, setActiveBookingId] = useState('BK-2026-8812');

  // Live Queue Simulation State
  const [servingToken, setServingToken] = useState(110);
  const [autoQueueTicker, setAutoQueueTicker] = useState(true);

  // Worker Assigned Stage Filter ('ALL' | 'ARRIVED' | 'WEIGHING' | 'QUALITY_CHECK' | 'PROCUREMENT')
  const [workerAssignedStage, setWorkerAssignedStage] = useState('WEIGHING');

  // Cryptographic SHA-256 Audit Chain
  const [auditChain, setAuditChain] = useState([
    {
      blockIndex: 1,
      timestamp: '2026-08-26 09:00:00',
      stage: 'GENESIS_BLOCK',
      bookingId: 'SYSTEM-INIT',
      farmerId: 'SYSTEM',
      farmerName: 'National Agri Ledger Node',
      dataSummary: 'AgriProcure National Cryptographic Ledger Initialized',
      prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      currentHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      isTampered: false,
    },
    {
      blockIndex: 2,
      timestamp: '2026-08-26 10:15:22',
      stage: 'BOOKED',
      bookingId: 'BK-2026-8812',
      farmerId: 'FRM-2026-000123',
      farmerName: 'Rameshwar Singh',
      dataSummary: 'Paddy (Basmati 1121) • 45 Quintals • Token #K00125',
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
      recommendation: 'Add One More Weighing Operator at Counter #2',
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
      farmerId: 'FRM-2026-000998',
      farmerName: 'Harpreet Singh (Anomaly Flag)',
      aadhaar: 'XXXX-XXXX-4412',
      issueType: 'Duplicate Booking Detected',
      description: 'Attempted 2 concurrent slot reservations for same crop at 2 different Mandis on same day.',
      severity: 'CRITICAL',
      status: 'Needs Review',
      timestamp: '10:48 AM',
    },
    {
      id: 'fa-2',
      farmerId: 'FRM-2026-000999',
      farmerName: 'Gopal Lal',
      aadhaar: 'XXXX-XXXX-9901',
      issueType: 'Impossible Timestamp Gap',
      description: 'Weighbridge exit timestamp logged 4 minutes before quality approval timestamp.',
      severity: 'WARNING',
      status: 'Needs Review',
      timestamp: '09:22 AM',
    },
  ]);

  // Live Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Slot Booking Confirmed',
      message: 'Token #K00125 for Paddy at Karnal Mandi is confirmed for today at 02:00 PM.',
      timestamp: '10:15 AM',
      type: 'success',
      read: false,
    },
    {
      id: 'n2',
      title: 'Queue Intake Update',
      message: 'Now serving Token K00110. 15 vehicles ahead of your token.',
      timestamp: '11:02 AM',
      type: 'info',
      read: false,
    },
  ]);

  // Modals state
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Queue Auto-Ticker Simulation (15s interval)
  useEffect(() => {
    if (!autoQueueTicker) return;
    const interval = setInterval(() => {
      setServingToken((prev) => {
        if (prev < 125) {
          const next = prev + 1;
          if (next === 120) {
            addNotification({
              title: 'Approaching Your Turn!',
              message: `Now serving Token K00${next}. Only 5 people ahead. Please proceed to Mandi Gate for Face Biometric check.`,
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
    const protectedViews = ['farmer-dash', 'worker-dash', 'officer-dash', 'book-slot', 'profile', 'queue', 'audit', 'qr-scanner'];
    if (protectedViews.includes(view) && !user) {
      setAuthRedirectView(view);
      setCurrentView('auth');
      addNotification({
        title: 'Sign-in Required',
        message: 'Please log in to your account to access this portal.',
        type: 'info',
      });
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Authentication Functions
  const registerFarmer = async (formData) => {
    const nextNum = 125 + farmersList.length;
    const newFarmerId = `FRM-2026-${String(nextNum).padStart(6, '0')}`;

    const newFarmer = {
      farmerId: newFarmerId,
      name: formData.name,
      mobile: formData.mobile,
      aadhaar: `XXXX-XXXX-${formData.aadhaar.slice(-4)}`,
      village: formData.village || 'Taraori',
      district: formData.district || 'Karnal',
      state: formData.state || 'Haryana',
      address: formData.address || `${formData.village}, ${formData.district}`,
      faceImage: formData.faceImage || '/hero_farmer.jpg',
      bankAccount: 'State Bank of India (Ending in 7712)',
      ifsc: 'SBIN0005432',
      crops: INITIAL_CROPS,
      history: [],
    };

    setFarmersList((prev) => [newFarmer, ...prev]);
    setFarmerProfile(newFarmer);

    // Cryptographic Registration Hash
    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${newFarmerId}|${newFarmer.name}|${newFarmer.aadhaar}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const regBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: 'FARMER_REGISTRATION',
      bookingId: 'REG-INIT',
      farmerId: newFarmerId,
      farmerName: newFarmer.name,
      dataSummary: `New Farmer Registered • Permanent ID ${newFarmerId} • Biometric Face Enrolled`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, regBlock]);

    addNotification({
      title: 'Farmer Registration Successful!',
      message: `Your permanent identity ${newFarmerId} has been created. Face biometric enrolled.`,
      type: 'success',
    });

    return newFarmer;
  };

  const loginUser = (identifier, password, role = 'farmer') => {
    if (role === 'officer') {
      const officerUser = {
        id: 'OFFICER-HR-402',
        name: 'Devendra Sharma',
        role: 'officer',
        designation: 'Chief Procurement Officer',
        zone: 'North Zone (Haryana & Punjab)',
      };
      setUser(officerUser);
      addNotification({
        title: 'Officer Access Granted',
        message: 'Signed in to Mandi Higher Authority & Command Tower.',
        type: 'success',
      });
      navigateTo('officer-dash');
      return officerUser;
    }

    if (role === 'worker') {
      const workerUser = {
        id: 'WRK-HR-108',
        name: 'Sukhvinder Singh',
        role: 'worker',
        assignedStage: workerAssignedStage || 'WEIGHING',
        mandiId: 'mandi-1',
        mandiName: 'Karnal Central Grain Mandi',
      };
      setUser(workerUser);
      addNotification({
        title: 'Worker Portal Initialized',
        message: `Signed in as Procurement Staff (${workerUser.assignedStage} Stage).`,
        type: 'success',
      });
      navigateTo('worker-dash');
      return workerUser;
    }

    // Default: Farmer
    const matchedFarmer = farmersList.find((f) => f.mobile === identifier || f.farmerId === identifier) || farmerProfile;
    const farmerUser = {
      ...matchedFarmer,
      role: 'farmer',
    };
    setUser(farmerUser);
    setFarmerProfile(matchedFarmer);
    addNotification({
      title: 'Farmer Sign-In Successful',
      message: `Welcome back, ${farmerUser.name}! (ID: ${farmerUser.farmerId})`,
      type: 'success',
    });
    navigateTo(authRedirectView || 'farmer-dash');
    setAuthRedirectView(null);
    return farmerUser;
  };

  const logoutUser = () => {
    setUser(null);
    setCurrentView('home');
    addNotification({
      title: 'Logged Out',
      message: 'You have been safely signed out.',
      type: 'info',
    });
  };

  // 5. Multi-Crop Profile Management (CRUD)
  const addCrop = (cropData) => {
    const newCrop = {
      id: 'crop-' + Date.now(),
      name: cropData.name,
      areaAcres: Number(cropData.areaAcres),
      expectedYieldQuintals: Number(cropData.expectedYieldQuintals),
      mspPerQtl: cropData.name.toLowerCase().includes('paddy') ? 2320 : cropData.name.toLowerCase().includes('wheat') ? 2425 : 5000,
    };
    setCrops((prev) => [...prev, newCrop]);
    setFarmerProfile((prev) => ({ ...prev, crops: [...(prev.crops || []), newCrop] }));
    addNotification({
      title: 'Crop Portfolio Updated',
      message: `Registered ${newCrop.name} (${newCrop.areaAcres} Acres) for procurement.`,
      type: 'success',
    });
  };

  const updateCrop = (id, updatedData) => {
    setCrops((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData, areaAcres: Number(updatedData.areaAcres), expectedYieldQuintals: Number(updatedData.expectedYieldQuintals) } : c))
    );
  };

  const deleteCrop = (id) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  // 6. Smart Slot Booking (Cinema-style Capacity Lock + Processing Duration Estimation)
  const bookSlot = async (bookingData) => {
    const centre = mandiCentres.find((m) => m.id === bookingData.centreId) || mandiCentres[0];
    const newBookingId = 'BK-2026-' + Math.floor(1000 + Math.random() * 9000);
    const tokenSeq = 125 + bookings.length;
    const tokenDisplay = `${centre.tokenPrefix}${String(tokenSeq).padStart(5, '0')}`;
    const qrData = `AGRI-PROCURE-${farmerProfile.farmerId}-${tokenDisplay}-${bookingData.crop.replace(/\s+/g, '')}`;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${newBookingId}|${farmerProfile.farmerId}|${centre.name}|${bookingData.crop}|${bookingData.quantity}|${tokenDisplay}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const matchedCrop = crops.find((c) => c.name === bookingData.crop);
    const mspRate = matchedCrop ? matchedCrop.mspPerQtl : 2320;
    const grossAmount = mspRate * Number(bookingData.quantity);

    const newBooking = {
      id: newBookingId,
      farmerId: farmerProfile.farmerId,
      farmerName: farmerProfile.name,
      centreId: centre.id,
      centreCode: centre.tokenPrefix,
      centreName: centre.name,
      tokenDisplay,
      tokenSeq,
      crop: bookingData.crop,
      quantity: Number(bookingData.quantity),
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      stage: 'BOOKED',
      stageStatus: 'CONFIRMED',
      faceVerified: false,
      rejectionDetails: null,
      paymentDetails: {
        mspPerQtl: mspRate,
        grossAmount,
        dbtTxnId: 'DBT-PENDING',
        disbursed: false,
      },
      qrData,
      createdHash: newHash,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingId(newBookingId);

    // Update slot capacity atomically
    setTimeSlots((prev) =>
      prev.map((s) => (s.time === bookingData.timeSlot ? { ...s, booked: Math.min(s.capacity, s.booked + 1) } : s))
    );

    // Append to Audit Chain
    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: 'BOOKED',
      bookingId: newBookingId,
      farmerId: farmerProfile.farmerId,
      farmerName: farmerProfile.name,
      dataSummary: `${bookingData.crop} • ${bookingData.quantity} Qtl • Token #${tokenDisplay} @ ${centre.name}`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, newBlock]);

    addNotification({
      title: 'Slot Reserved Successfully!',
      message: `Token #${tokenDisplay} generated for ${bookingData.crop} at ${centre.name}. Estimated processing time: 30 mins.`,
      type: 'success',
    });

    return newBooking;
  };

  // 7. Face Biometric Arrival Verification
  const verifyFaceArrival = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false };

    // Advance to ARRIVED
    await advanceBookingStage(bookingId, 'ARRIVED', 'Face Biometric Match Verified (Confidence: 98.4%)');
    
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, faceVerified: true } : b))
    );

    addNotification({
      title: 'Face Biometric Verified!',
      message: `Farmer ${booking.farmerName} confirmed at Mandi Gate. Token #${booking.tokenDisplay} is now ARRIVED.`,
      type: 'success',
    });

    return { success: true, confidence: 98.4 };
  };

  // 8. Worker Approval / Rejection Logic
  const approveStage = async (bookingId, stageKey, remarks = '') => {
    const currentIdx = WORKFLOW_STAGES.findIndex((s) => s.key === stageKey);
    const nextStage = currentIdx < WORKFLOW_STAGES.length - 1 ? WORKFLOW_STAGES[currentIdx + 1].key : 'COMPLETED';
    await advanceBookingStage(bookingId, nextStage, remarks || `Approved by ${user?.name || 'Staff'}`);
  };

  const rejectStage = async (bookingId, stageKey, { reason, remarks, proofImage }) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|REJECTED|${stageKey}|${reason}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              stageStatus: 'REJECTED',
              rejectionDetails: {
                rejectedAtStage: stageKey,
                reason,
                remarks,
                proofImage: proofImage || 'Proof attached (Moisture meter log)',
                rejectedBy: user?.name || 'Worker Staff',
                rejectedAt: new Date().toLocaleTimeString(),
              },
            }
          : b
      )
    );

    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: `${stageKey}_REJECTED`,
      bookingId,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      dataSummary: `Stage ${stageKey} REJECTED: ${reason} (Proof attached)`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, newBlock]);

    addNotification({
      title: `Stage ${stageKey} Rejected`,
      message: `Token #${booking.tokenDisplay} was rejected during ${stageKey}: ${reason}`,
      type: 'warning',
    });
  };

  // 9. Officer Final Payment Approval
  const approveFinalPayment = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const dbtTxnId = `DBT-SBI-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              stage: 'COMPLETED',
              stageStatus: 'COMPLETED',
              paymentDetails: {
                ...b.paymentDetails,
                dbtTxnId,
                disbursed: true,
                disbursedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
              },
            }
          : b
      )
    );

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|COMPLETED|${dbtTxnId}|${booking.paymentDetails.grossAmount}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: 'PAYMENT_COMPLETED',
      bookingId,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      dataSummary: `MSP DBT Payout Disbursed: ₹${booking.paymentDetails.grossAmount.toLocaleString()} • Txn #${dbtTxnId}`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, newBlock]);

    addNotification({
      title: 'DBT Payment Disbursed!',
      message: `₹${booking.paymentDetails.grossAmount.toLocaleString()} transferred to ${booking.farmerName}'s account (${dbtTxnId}).`,
      type: 'success',
    });
  };

  // Universal Workflow Stage Advancer
  const advanceBookingStage = async (bookingId, nextStage, remarks = '') => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|${nextStage}|${booking.farmerName}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, stage: nextStage, stageStatus: 'IN_PROGRESS' } : b))
    );

    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: nextStage,
      bookingId,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      dataSummary: `Stage transitioned to ${nextStage} for Token #${booking.tokenDisplay} ${remarks ? `(${remarks})` : ''}`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };

    setAuditChain((prev) => [...prev, newBlock]);
  };

  // Farmer Search Tool for Workers & Officers
  const searchFarmerById = (query) => {
    if (!query) return null;
    const cleanQ = query.trim().toUpperCase();
    return (
      farmersList.find((f) => f.farmerId.toUpperCase() === cleanQ || f.mobile.includes(cleanQ) || f.name.toUpperCase().includes(cleanQ)) || null
    );
  };

  // Bottleneck & Fraud Handlers
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

  const resolveFraudAlert = (id, resolution) => {
    setFraudAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: resolution } : a)));
    addNotification({
      title: 'Anomaly Reviewed',
      message: `Alert #${id} marked as ${resolution}.`,
      type: 'info',
    });
  };

  // Tamper Simulators
  const simulateTamper = () => {
    if (auditChain.length < 2) return;
    setAuditChain((prev) => {
      const copy = [...prev];
      copy[1] = {
        ...copy[1],
        currentHash: '0xDEADBEEF000000000000000000000000000000000000000000000000DEADBEEF',
        isTampered: true,
      };
      return copy;
    });
    addNotification({
      title: 'Tamper Simulation Activated',
      message: 'Block #2 modified. Ledger integrity test will fail.',
      type: 'warning',
    });
  };

  const repairAuditChain = async () => {
    const repaired = [];
    for (let i = 0; i < auditChain.length; i++) {
      const b = auditChain[i];
      if (i === 0) {
        repaired.push({ ...b, isTampered: false });
      } else {
        const prevH = repaired[i - 1].currentHash;
        const validH = await generateSHA256(prevH + b.bookingId + b.stage + b.dataSummary);
        repaired.push({ ...b, prevHash: prevH, currentHash: validH, isTampered: false });
      }
    }
    setAuditChain(repaired);
    addNotification({
      title: 'Consensus Repaired',
      message: 'SHA-256 chain re-verified and valid.',
      type: 'success',
    });
  };

  // Active Metrics Calculations
  const activeBooking = bookings.find((b) => b.id === activeBookingId) || bookings[0] || null;
  const peopleAhead = activeBooking ? Math.max(0, activeBooking.tokenSeq - servingToken) : 0;
  const estimatedWaitMins = Math.max(4, Math.round(peopleAhead * 1.8));
  const congestionRisk = peopleAhead > 25 ? 'HIGH' : peopleAhead > 10 ? 'MEDIUM' : 'LOW';

  const xaiFactors = [
    { factor: 'Queue Length Surge', impact: '+35%', positive: false, desc: `${peopleAhead} vehicles currently in Mandi intake lane` },
    { factor: 'Average Crop Load (45 Qtl)', impact: '+20%', positive: false, desc: 'Heavy grain bulk unloading required' },
    { factor: 'Weighbridge Counter Efficiency', impact: '-25%', positive: true, desc: '4/4 Weighbridges operating with digital sensor' },
    { factor: 'Moisture Testing Latency', impact: '+15%', positive: false, desc: 'Moisture lab averaging 4.2 mins per test' },
    { factor: 'Staggered Arrival Adherence', impact: '-18%', positive: true, desc: '82% farmers arriving in allocated slot window' },
  ];

  return (
    <AppContext.Provider
      value={{
        // i18n
        currentLang,
        setCurrentLang,
        languageModalOpen,
        setLanguageModalOpen,
        t,

        // Navigation
        currentView,
        setCurrentView,
        navigateTo,

        // Auth & 3 Roles
        user,
        farmerProfile,
        setFarmerProfile,
        farmersList,
        registerFarmer,
        loginUser,
        logoutUser,

        // Multi-Crops
        crops,
        addCrop,
        updateCrop,
        deleteCrop,

        // Mandis & Slots
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
        verifyFaceArrival,

        // Worker & Officer Operations
        workerAssignedStage,
        setWorkerAssignedStage,
        approveStage,
        rejectStage,
        approveFinalPayment,
        searchFarmerById,

        // Queue
        servingToken,
        setServingToken,
        autoQueueTicker,
        setAutoQueueTicker,
        peopleAhead,
        estimatedWaitMins,

        // AI & Security
        congestionRisk,
        xaiFactors,
        bottlenecks,
        resolveBottleneck,
        fraudAlerts,
        resolveFraudAlert,
        auditChain,
        simulateTamper,
        repairAuditChain,

        // Notifications & Modals
        notifications,
        addNotification,
        markAllNotificationsRead,
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
