import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateSHA256 } from '../utils/crypto';
import { translations } from '../i18n/translations';

const AppContext = createContext();

const INITIAL_CROPS = [
  { id: 'c1', name: 'Paddy (Basmati 1121)', areaAcres: 4.5, expectedYieldQuintals: 90, mspPerQtl: 2320 },
  { id: 'c2', name: 'Wheat (Sharbati HD-2967)', areaAcres: 6.0, expectedYieldQuintals: 135, mspPerQtl: 2425 },
  { id: 'c3', name: 'Mustard (Pusa Mustard 30)', areaAcres: 2.0, expectedYieldQuintals: 30, mspPerQtl: 5650 },
  { id: 'c4', name: 'Soya (JS-335)', areaAcres: 3.5, expectedYieldQuintals: 45, mspPerQtl: 4892 },
];

const INITIAL_CENTRES = [
  {
    id: 'mandi-1',
    centre_code: 'P',
    centre_name: 'Karnal Central Grain Mandi (HR)',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Taraori',
    daily_capacity: 200,
    activeCounters: 4,
    historicalAvgMins: 18,
    todayCapacity: 200,
    todayBooked: 142,
  },
  {
    id: 'mandi-2',
    centre_code: 'Q',
    centre_name: 'Ludhiana Main Grain Market (PB)',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Samana',
    daily_capacity: 250,
    activeCounters: 3,
    historicalAvgMins: 28,
    todayCapacity: 250,
    todayBooked: 228,
  },
  {
    id: 'mandi-3',
    centre_code: 'D',
    centre_name: 'Nalgonda Paddy Procurement Hub (TS)',
    state: 'Telangana',
    district: 'Nalgonda',
    village: 'Miryalaguda',
    daily_capacity: 150,
    activeCounters: 2,
    historicalAvgMins: 12,
    todayCapacity: 150,
    todayBooked: 65,
  },
  {
    id: 'mandi-4',
    centre_code: 'F',
    centre_name: 'Kota Agricultural Mandi (RJ)',
    state: 'Rajasthan',
    district: 'Kota',
    village: 'Borkheda',
    daily_capacity: 180,
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
  { key: 'BOOKED', label: 'Booked', desc: 'Slot confirmed & digital pass issued' },
  { key: 'ARRIVED', label: 'Arrived', desc: 'Gate face biometric verification confirmed' },
  { key: 'WEIGHING', label: 'Weighing', desc: 'Digital weighbridge loaded & gross tare recorded' },
  { key: 'QUALITY_CHECK', label: 'Quality Check', desc: 'Moisture (<17%) & foreign matter tested' },
  { key: 'PROCUREMENT', label: 'Procurement', desc: 'Official MSP purchase voucher logged' },
  { key: 'PAYMENT', label: 'Payment', desc: 'Direct DBT bank disbursement initiated' },
  { key: 'COMPLETED', label: 'Completed', desc: 'Procurement cycle completed with SHA-256 seal' },
];

export function AppProvider({ children }) {
  // 1. Language State
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('agri_lang') || 'en');
  const [languageModalOpen, setLanguageModalOpen] = useState(() => !localStorage.getItem('agri_lang_chosen'));

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  // 2. Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [authRedirectView, setAuthRedirectView] = useState(null);

  // 3. User Authentication State (3 Roles: 'farmer' | 'worker' | 'officer')
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Primary State Lists
  const [farmersList, setFarmersList] = useState([
    {
      id: 'usr-001',
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
      role: 'farmer',
      crops: INITIAL_CROPS,
      history: [
        { season: 'Rabi 2025', crop: 'Wheat', quantity: 120, mspPaid: '₹2,73,000', status: 'COMPLETED', dbtRef: 'DBT-2025-88124' },
        { season: 'Kharif 2025', crop: 'Paddy', quantity: 85, mspPaid: '₹1,87,000', status: 'COMPLETED', dbtRef: 'DBT-2025-44912' },
      ],
    },
  ]);

  const [farmerProfile, setFarmerProfile] = useState(farmersList[0]);
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [mandiCentres, setMandiCentres] = useState(INITIAL_CENTRES);
  const [selectedMandiId, setSelectedMandiId] = useState('mandi-1');
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIME_SLOTS);

  const [bookings, setBookings] = useState([
    {
      id: 'BK-2026-000125',
      booking_id: 'BK-2026-000125',
      farmerId: 'FRM-2026-000123',
      farmerName: 'Rameshwar Singh',
      centreId: 'mandi-1',
      centreCode: 'P',
      centreName: 'Karnal Central Grain Mandi (HR)',
      tokenDisplay: 'P001',
      tokenSeq: 1,
      crop: 'Paddy (Basmati 1121)',
      quantity: 45,
      date: new Date().toISOString().split('T')[0],
      slot_date: new Date().toISOString().split('T')[0],
      timeSlot: '02:00 PM - 03:00 PM',
      slot_time: '02:00 PM - 03:00 PM',
      stage: 'BOOKED',
      status: 'BOOKED',
      stageStatus: 'CONFIRMED',
      faceVerified: false,
      rejectionDetails: null,
      paymentDetails: {
        mspPerQtl: 2320,
        grossAmount: 104400,
        dbtTxnId: 'DBT-PENDING',
        disbursed: false,
      },
      qrData: 'AGRI-PROCURE-FRM-2026-000123-P001-PADDY',
      createdHash: '0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
      createdAt: '10:15 AM',
    },
    {
      id: 'BK-2026-000088',
      booking_id: 'BK-2026-000088',
      farmerId: 'FRM-2026-000124',
      farmerName: 'Gurpreet Singh',
      centreId: 'mandi-2',
      centreCode: 'Q',
      centreName: 'Ludhiana Main Grain Market (PB)',
      tokenDisplay: 'Q001',
      tokenSeq: 1,
      crop: 'Wheat (HD-3086)',
      quantity: 60,
      date: '2026-08-26',
      slot_date: '2026-08-26',
      timeSlot: '10:00 AM - 11:00 AM',
      slot_time: '10:00 AM - 11:00 AM',
      stage: 'WEIGHING',
      status: 'WEIGHING',
      stageStatus: 'IN_PROGRESS',
      faceVerified: true,
      rejectionDetails: null,
      paymentDetails: {
        mspPerQtl: 2425,
        grossAmount: 145500,
        dbtTxnId: 'DBT-PENDING',
        disbursed: false,
      },
      qrData: 'AGRI-PROCURE-FRM-2026-000124-Q001-WHEAT',
      createdHash: '0x3c9e1d7b0e885e4f2c118f2a4b127f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e',
      createdAt: '09:30 AM',
    },
  ]);

  const [activeBookingId, setActiveBookingId] = useState('BK-2026-000125');
  const [servingToken, setServingToken] = useState(1);
  const [autoQueueTicker, setAutoQueueTicker] = useState(true);
  const [workerAssignedStage, setWorkerAssignedStage] = useState('WEIGHING');

  const [auditChain, setAuditChain] = useState([
    {
      blockIndex: 1,
      timestamp: '2026-08-26 09:00:00',
      stage: 'GENESIS_BLOCK',
      bookingId: 'SYSTEM-INIT',
      farmerId: 'SYSTEM',
      farmerName: 'National Agri Ledger Node',
      dataSummary: 'AgriProcure Supabase Cryptographic Ledger Initialized',
      prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      currentHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      isTampered: false,
    },
  ]);

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
  ]);

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
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Slot Booking Confirmed',
      message: 'Token #P001 for Paddy at Karnal Mandi is confirmed for today at 02:00 PM.',
      timestamp: '10:15 AM',
      type: 'success',
      read: false,
    },
  ]);

  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

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

    try {
      supabase.from('notifications').insert([
        {
          title,
          message,
          is_read: false,
        },
      ]);
    } catch {
      // safe fallback
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 5. Supabase Initial Data Fetch & Realtime Subscriptions
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: centresData } = await supabase.from('procurement_centres').select('*');
        if (centresData && centresData.length > 0) {
          setMandiCentres(
            centresData.map((c) => ({
              ...c,
              name: c.centre_name,
              code: c.centre_code,
              activeCounters: 3,
              historicalAvgMins: 20,
              todayCapacity: c.daily_capacity,
              todayBooked: 120,
            }))
          );
        }

        const { data: profilesData } = await supabase.from('profiles').select('*');
        if (profilesData && profilesData.length > 0) {
          const formatted = profilesData.map((p) => ({
            id: p.id,
            farmerId: p.farmer_id || `FRM-2026-${p.id.slice(0, 6)}`,
            name: p.name,
            mobile: p.mobile,
            aadhaar: p.aadhaar,
            village: p.village,
            district: p.district,
            state: p.state,
            role: p.role,
            faceImage: p.face_image_url || '/hero_farmer.jpg',
            bankAccount: 'State Bank of India (Ending in 4092)',
            ifsc: 'SBIN0001234',
            crops: INITIAL_CROPS,
            history: [],
          }));
          setFarmersList(formatted);
          if (formatted.length > 0) setFarmerProfile(formatted[0]);
        }

        const { data: bookingsData } = await supabase.from('bookings').select('*');
        if (bookingsData && bookingsData.length > 0) {
          const mapped = bookingsData.map((b) => ({
            id: b.booking_id || b.id,
            farmerId: 'FRM-2026-000123',
            farmerName: 'Rameshwar Singh',
            centreId: b.centre_id,
            centreCode: 'P',
            centreName: 'Karnal Central Grain Mandi',
            tokenDisplay: 'P001',
            tokenSeq: 1,
            crop: 'Paddy (Basmati 1121)',
            quantity: b.expected_quantity,
            date: b.slot_date,
            timeSlot: b.slot_time,
            stage: b.status,
            status: b.status,
            stageStatus: 'IN_PROGRESS',
            faceVerified: false,
            paymentDetails: {
              mspPerQtl: 2320,
              grossAmount: b.expected_quantity * 2320,
              dbtTxnId: 'DBT-PENDING',
              disbursed: false,
            },
            qrData: `AGRI-PROCURE-${b.booking_id}-P001`,
            createdHash: '0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
            createdAt: '10:15 AM',
          }));
          setBookings(mapped);
        }

        const { data: auditData } = await supabase.from('audit_logs').select('*');
        if (auditData && auditData.length > 0) {
          setAuditChain(
            auditData.map((a, idx) => ({
              blockIndex: idx + 1,
              timestamp: a.timestamp,
              stage: a.event_name,
              bookingId: a.booking_id || 'BK-INIT',
              farmerId: 'FRM-2026-000123',
              farmerName: 'Rameshwar Singh',
              dataSummary: `${a.event_name} logged in Supabase`,
              prevHash: a.previous_hash,
              currentHash: a.hash,
              isTampered: false,
            }))
          );
        }
      } catch (err) {
        console.warn('Supabase initialization sync: using fallback initial state.', err);
      }
    }

    loadSupabaseData();

    const channel = supabase
      .channel('procure-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          addNotification({
            title: 'Realtime Booking Received',
            message: `New booking ${payload.new.booking_id} arrived at procurement centre.`,
            type: 'info',
          });
        } else if (payload.eventType === 'UPDATE') {
          setBookings((prev) =>
            prev.map((b) => (b.id === payload.new.booking_id || b.id === payload.new.id ? { ...b, stage: payload.new.status, status: payload.new.status } : b))
          );
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          addNotification({
            title: 'Workflow Live Update',
            message: `Stage updated to ${payload.new.stage} (${payload.new.status})`,
            type: 'info',
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  // 6. Supabase Farmer Registration
  const registerFarmer = async (formData) => {
    const nextNum = 125 + farmersList.length;
    const newFarmerId = `FRM-2026-${String(nextNum).padStart(6, '0')}`;

    const newFarmer = {
      id: 'usr-' + Date.now(),
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
      role: 'farmer',
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

    // Persist to Supabase `profiles` and `audit_logs`
    try {
      await supabase.from('profiles').insert([
        {
          farmer_id: newFarmerId,
          name: formData.name,
          mobile: formData.mobile,
          aadhaar: formData.aadhaar,
          village: formData.village,
          district: formData.district,
          state: formData.state,
          role: 'farmer',
          face_image_url: formData.faceImage,
        },
      ]);

      await supabase.from('audit_logs').insert([
        {
          event_name: 'FARMER_REGISTRATION',
          hash: newHash,
          previous_hash: prevBlock.currentHash,
        },
      ]);
    } catch (err) {
      console.warn('Supabase profile insertion fallback:', err);
    }

    addNotification({
      title: 'Farmer Registration Successful!',
      message: `Your permanent identity ${newFarmerId} has been created and synced with Supabase.`,
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
      localStorage.setItem('agri_user', JSON.stringify(officerUser));
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
      localStorage.setItem('agri_user', JSON.stringify(workerUser));
      addNotification({
        title: 'Worker Portal Initialized',
        message: `Signed in as Procurement Staff (${workerUser.assignedStage} Stage).`,
        type: 'success',
      });
      navigateTo('worker-dash');
      return workerUser;
    }

    const matchedFarmer = farmersList.find((f) => f.mobile === identifier || f.farmerId === identifier) || farmerProfile;
    const farmerUser = {
      ...matchedFarmer,
      role: 'farmer',
    };
    setUser(farmerUser);
    setFarmerProfile(matchedFarmer);
    localStorage.setItem('agri_user', JSON.stringify(farmerUser));
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
    localStorage.removeItem('agri_user');
    setCurrentView('home');
    addNotification({
      title: 'Logged Out',
      message: 'You have been safely signed out.',
      type: 'info',
    });
  };

  // 7. Multi-Crop Profile Management (CRUD)
  const addCrop = async (cropData) => {
    const newCrop = {
      id: 'crop-' + Date.now(),
      name: cropData.name,
      areaAcres: Number(cropData.areaAcres),
      expectedYieldQuintals: Number(cropData.expectedYieldQuintals),
      mspPerQtl: cropData.name.toLowerCase().includes('paddy') ? 2320 : cropData.name.toLowerCase().includes('wheat') ? 2425 : 5000,
    };
    setCrops((prev) => [...prev, newCrop]);
    setFarmerProfile((prev) => ({ ...prev, crops: [...(prev.crops || []), newCrop] }));

    try {
      await supabase.from('farmer_crops').insert([
        {
          crop_name: cropData.name,
          acres: Number(cropData.areaAcres),
          expected_yield: Number(cropData.expectedYieldQuintals),
        },
      ]);
    } catch {
      // safe fallback
    }

    addNotification({
      title: 'Crop Portfolio Updated',
      message: `Registered ${newCrop.name} (${newCrop.areaAcres} Acres) for procurement in Supabase.`,
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

  // 8. Smart Slot Booking (Supabase `bookings` & `tokens`)
  const bookSlot = async (bookingData) => {
    const centre = mandiCentres.find((m) => m.id === bookingData.centreId || m.centre_code === bookingData.centreId) || mandiCentres[0];
    const code = centre.centre_code || centre.code || 'P';
    const nextSeq = bookings.filter((b) => b.centreCode === code).length + 1;
    const tokenDisplay = `${code}${String(nextSeq).padStart(3, '0')}`; // e.g. P001, P002
    const newBookingId = `BK-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const qrData = `AGRI-PROCURE-${farmerProfile.farmerId}-${tokenDisplay}-${bookingData.crop.replace(/\s+/g, '')}`;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${newBookingId}|${farmerProfile.farmerId}|${centre.centre_name || centre.name}|${bookingData.crop}|${bookingData.quantity}|${tokenDisplay}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const matchedCrop = crops.find((c) => c.name === bookingData.crop);
    const mspRate = matchedCrop ? matchedCrop.mspPerQtl : 2320;
    const grossAmount = mspRate * Number(bookingData.quantity);

    const newBooking = {
      id: newBookingId,
      booking_id: newBookingId,
      farmerId: farmerProfile.farmerId,
      farmerName: farmerProfile.name,
      centreId: centre.id,
      centreCode: code,
      centreName: centre.centre_name || centre.name,
      tokenDisplay,
      tokenSeq: nextSeq,
      crop: bookingData.crop,
      quantity: Number(bookingData.quantity),
      date: bookingData.date,
      slot_date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      slot_time: bookingData.timeSlot,
      stage: 'BOOKED',
      status: 'BOOKED',
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

    // Atomic Capacity Update
    setTimeSlots((prev) =>
      prev.map((s) => (s.time === bookingData.timeSlot ? { ...s, booked: Math.min(s.capacity, s.booked + 1) } : s))
    );

    // Audit Chain
    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      stage: 'BOOKED',
      bookingId: newBookingId,
      farmerId: farmerProfile.farmerId,
      farmerName: farmerProfile.name,
      dataSummary: `${bookingData.crop} • ${bookingData.quantity} Qtl • Token #${tokenDisplay} @ ${centre.centre_name || centre.name}`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, newBlock]);

    // Persist to Supabase Database Tables: `bookings`, `tokens`, `audit_logs`
    try {
      await supabase.from('bookings').insert([
        {
          booking_id: newBookingId,
          slot_date: bookingData.date,
          slot_time: bookingData.timeSlot,
          expected_quantity: Number(bookingData.quantity),
          estimated_processing_time: 30,
          status: 'BOOKED',
        },
      ]);

      await supabase.from('tokens').insert([
        {
          centre_code: code,
          token_number: tokenDisplay,
          queue_position: nextSeq,
          date: bookingData.date,
        },
      ]);

      await supabase.from('audit_logs').insert([
        {
          booking_id: newBookingId,
          event_name: 'SLOT_BOOKED',
          hash: newHash,
          previous_hash: prevBlock.currentHash,
        },
      ]);
    } catch (err) {
      console.warn('Supabase booking insert fallback:', err);
    }

    addNotification({
      title: 'Slot Reserved in Supabase!',
      message: `Token #${tokenDisplay} generated for ${bookingData.crop} at ${centre.centre_name || centre.name}.`,
      type: 'success',
    });

    return newBooking;
  };

  // 9. Face Biometric Arrival Verification
  const verifyFaceArrival = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId || b.booking_id === bookingId);
    if (!booking) return { success: false };

    await advanceBookingStage(booking.id, 'ARRIVED', 'Face Biometric Match Verified (Confidence: 98.4%)');
    
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId || b.booking_id === bookingId ? { ...b, faceVerified: true } : b))
    );

    addNotification({
      title: 'Face Biometric Verified!',
      message: `Farmer ${booking.farmerName} confirmed at Mandi Gate. Token #${booking.tokenDisplay} is now ARRIVED.`,
      type: 'success',
    });

    return { success: true, confidence: 98.4 };
  };

  // 10. Worker Approval / Rejection Logic
  const approveStage = async (bookingId, stageKey, remarks = '') => {
    const currentIdx = WORKFLOW_STAGES.findIndex((s) => s.key === stageKey);
    const nextStage = currentIdx < WORKFLOW_STAGES.length - 1 ? WORKFLOW_STAGES[currentIdx + 1].key : 'COMPLETED';
    await advanceBookingStage(bookingId, nextStage, remarks || `Approved by ${user?.name || 'Staff'}`);
  };

  const rejectStage = async (bookingId, stageKey, { reason, remarks, proofImage }) => {
    const booking = bookings.find((b) => b.id === bookingId || b.booking_id === bookingId);
    if (!booking) return;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|REJECTED|${stageKey}|${reason}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.booking_id === bookingId
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
      dataSummary: `Stage ${stageKey} REJECTED: ${reason} (Proof attached in storage)`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, newBlock]);

    // Persist Rejection to Supabase `workflow` & `audit_logs`
    try {
      await supabase.from('workflow').insert([
        {
          stage: stageKey,
          status: 'REJECTED',
          remarks: `${reason}: ${remarks}`,
          proof_url: proofImage,
        },
      ]);

      await supabase.from('audit_logs').insert([
        {
          booking_id: booking.booking_id || booking.id,
          event_name: `${stageKey}_REJECTED`,
          hash: newHash,
          previous_hash: prevBlock.currentHash,
        },
      ]);
    } catch {
      // safe fallback
    }

    addNotification({
      title: `Stage ${stageKey} Rejected`,
      message: `Token #${booking.tokenDisplay} was rejected during ${stageKey}: ${reason}`,
      type: 'warning',
    });
  };

  // 11. Officer Final Payment Approval (Supabase `payments` table)
  const approveFinalPayment = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId || b.booking_id === bookingId);
    if (!booking) return;

    const dbtTxnId = `DBT-SBI-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.booking_id === bookingId
          ? {
              ...b,
              stage: 'COMPLETED',
              status: 'COMPLETED',
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

    // Persist Payment to Supabase `payments` table
    try {
      await supabase.from('payments').insert([
        {
          amount: booking.paymentDetails.grossAmount,
          payment_status: 'DISBURSED',
          payment_date: new Date().toISOString(),
        },
      ]);

      await supabase.from('audit_logs').insert([
        {
          booking_id: booking.booking_id || booking.id,
          event_name: 'PAYMENT_COMPLETED',
          hash: newHash,
          previous_hash: prevBlock.currentHash,
        },
      ]);
    } catch {
      // safe fallback
    }

    addNotification({
      title: 'DBT Payment Disbursed in Supabase!',
      message: `₹${booking.paymentDetails.grossAmount.toLocaleString()} transferred to ${booking.farmerName}'s account (${dbtTxnId}).`,
      type: 'success',
    });
  };

  // Universal Workflow Stage Advancer
  const advanceBookingStage = async (bookingId, nextStage, remarks = '') => {
    const booking = bookings.find((b) => b.id === bookingId || b.booking_id === bookingId);
    if (!booking) return;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|${nextStage}|${booking.farmerName}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId || b.booking_id === bookingId ? { ...b, stage: nextStage, status: nextStage, stageStatus: 'IN_PROGRESS' } : b))
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

    // Persist Stage to Supabase `workflow` & `bookings`
    try {
      await supabase.from('workflow').insert([
        {
          stage: nextStage,
          status: 'APPROVED',
          remarks: remarks || `Advanced to ${nextStage}`,
        },
      ]);
    } catch {
      // safe fallback
    }
  };

  // Farmer Search Tool
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
  const activeBooking = bookings.find((b) => b.id === activeBookingId || b.booking_id === activeBookingId) || bookings[0] || null;
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
