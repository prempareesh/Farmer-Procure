import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { generateSHA256 } from "../utils/crypto";
import { translations } from "../i18n/translations";

const AppContext = createContext();

const INITIAL_CROPS = [
  {
    id: "c1",
    name: "Paddy (Basmati 1121)",
    areaAcres: 4.5,
    expectedYieldQuintals: 90,
    mspPerQtl: 2320,
  },
  {
    id: "c2",
    name: "Wheat (Sharbati HD-2967)",
    areaAcres: 6.0,
    expectedYieldQuintals: 135,
    mspPerQtl: 2425,
  },
  {
    id: "c3",
    name: "Mustard (Pusa Mustard 30)",
    areaAcres: 2.0,
    expectedYieldQuintals: 30,
    mspPerQtl: 5650,
  },
  {
    id: "c4",
    name: "Soya (JS-335)",
    areaAcres: 3.5,
    expectedYieldQuintals: 45,
    mspPerQtl: 4892,
  },
];

const INITIAL_CENTRES = [
  {
    id: "mandi-1",
    centre_code: "P",
    centre_name: "Karnal Central Grain Mandi (HR)",
    state: "Haryana",
    district: "Karnal",
    village: "Taraori",
    daily_capacity: 200,
    activeCounters: 4,
    historicalAvgMins: 18,
    todayCapacity: 200,
    todayBooked: 142,
  },
  {
    id: "mandi-2",
    centre_code: "Q",
    centre_name: "Ludhiana Main Grain Market (PB)",
    state: "Punjab",
    district: "Ludhiana",
    village: "Samana",
    daily_capacity: 250,
    activeCounters: 3,
    historicalAvgMins: 28,
    todayCapacity: 250,
    todayBooked: 228,
  },
  {
    id: "mandi-3",
    centre_code: "D",
    centre_name: "Nalgonda Paddy Procurement Hub (TS)",
    state: "Telangana",
    district: "Nalgonda",
    village: "Miryalaguda",
    daily_capacity: 150,
    activeCounters: 2,
    historicalAvgMins: 12,
    todayCapacity: 150,
    todayBooked: 65,
  },
  {
    id: "mandi-4",
    centre_code: "F",
    centre_name: "Kota Agricultural Mandi (RJ)",
    state: "Rajasthan",
    district: "Kota",
    village: "Borkheda",
    daily_capacity: 180,
    activeCounters: 3,
    historicalAvgMins: 22,
    todayCapacity: 180,
    todayBooked: 110,
  },
];

const INITIAL_TIME_SLOTS = [
  {
    time: "08:00 AM - 09:00 AM",
    capacity: 20,
    booked: 18,
    expectedWaitMins: 15,
    isRecommended: false,
  },
  {
    time: "09:00 AM - 10:00 AM",
    capacity: 20,
    booked: 20,
    expectedWaitMins: 45,
    isRecommended: false,
  }, // FULL
  {
    time: "10:00 AM - 11:00 AM",
    capacity: 20,
    booked: 19,
    expectedWaitMins: 40,
    isRecommended: false,
  },
  {
    time: "11:00 AM - 12:00 PM",
    capacity: 20,
    booked: 20,
    expectedWaitMins: 60,
    isRecommended: false,
  }, // FULL
  {
    time: "01:00 PM - 02:00 PM",
    capacity: 20,
    booked: 12,
    expectedWaitMins: 20,
    isRecommended: false,
  },
  {
    time: "02:00 PM - 03:00 PM",
    capacity: 20,
    booked: 8,
    expectedWaitMins: 10,
    isRecommended: true,
  }, // Recommended
  {
    time: "03:00 PM - 04:00 PM",
    capacity: 20,
    booked: 6,
    expectedWaitMins: 8,
    isRecommended: true,
  }, // Recommended
  {
    time: "04:00 PM - 05:00 PM",
    capacity: 20,
    booked: 14,
    expectedWaitMins: 16,
    isRecommended: false,
  },
];

export const WORKFLOW_STAGES = [
  {
    key: "BOOKED",
    label: "Booked",
    desc: "Slot confirmed & digital pass issued",
  },
  {
    key: "ARRIVED",
    label: "Arrived",
    desc: "Mandi Gate arrival token check-in confirmed",
  },
  {
    key: "QUALITY_CHECK",
    label: "Quality Check",
    desc: "Moisture (<17%) & foreign matter tested",
  },
  {
    key: "WEIGHING",
    label: "Weighing",
    desc: "Digital weighbridge loaded & gross tare recorded",
  },
  {
    key: "PROCUREMENT",
    label: "Procurement",
    desc: "Official MSP purchase voucher logged",
  },
  {
    key: "PAYMENT",
    label: "Payment",
    desc: "Direct DBT bank disbursement initiated",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    desc: "Procurement cycle completed with SHA-256 seal",
  },
];

export function AppProvider({ children }) {
  const activeChannelRef = useRef(null);

  // 1. Language State
  const [currentLang, setCurrentLangState] = useState(
    () => localStorage.getItem("agri_lang") || "en",
  );
  const [languageModalOpen, setLanguageModalOpen] = useState(
    () => !localStorage.getItem("agri_lang_chosen"),
  );

  const setCurrentLang = (lang) => {
    setCurrentLangState(lang);
    try {
      localStorage.setItem("agri_lang", lang);
      localStorage.setItem("agri_lang_chosen", "true");
    } catch {
      // storage fallback
    }
  };

  const t = (key) => {
    return translations[currentLang]?.[key] || translations["en"]?.[key] || key;
  };

  // 2. Navigation State
  const [currentView, setCurrentView] = useState("home");
  const [initialWorkflowStep, setInitialWorkflowStep] = useState(0);
  const [authRedirectView, setAuthRedirectView] = useState(null);

  // 3. User Authentication State (3 Roles: 'farmer' | 'worker' | 'officer')
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("agri_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Primary State Lists
  const [farmersList, setFarmersList] = useState([
    {
      id: "usr-001",
      farmerId: "FRM-2026-000123",
      name: "Rameshwar Singh",
      mobile: "9876543210",
      aadhaar: "XXXX-XXXX-8912",
      village: "Taraori",
      district: "Karnal",
      state: "Haryana",
      address: "Plot #42, Main GT Road, Taraori Tehsil",
      faceImage: "/hero_farmer.jpg",
      bankAccount: "State Bank of India (Ending in 4092)",
      ifsc: "SBIN0001234",
      role: "farmer",
      crops: INITIAL_CROPS,
      history: [
        {
          season: "Rabi 2025",
          crop: "Wheat",
          quantity: 120,
          mspPaid: "₹2,73,000",
          status: "COMPLETED",
          dbtRef: "DBT-2025-88124",
        },
        {
          season: "Kharif 2025",
          crop: "Paddy",
          quantity: 85,
          mspPaid: "₹1,87,000",
          status: "COMPLETED",
          dbtRef: "DBT-2025-44912",
        },
      ],
    },
  ]);

  const [farmerProfile, setFarmerProfile] = useState(farmersList[0]);
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [mandiCentres, setMandiCentres] = useState(INITIAL_CENTRES);
  const [selectedMandiId, setSelectedMandiId] = useState("mandi-1");
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIME_SLOTS);

  const [bookings, setBookings] = useState([]);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [servingToken, setServingToken] = useState(1);
  const [autoQueueTicker, setAutoQueueTicker] = useState(true);
  const [workerAssignedStage, setWorkerAssignedStage] = useState("ALL");

  const [auditChain, setAuditChain] = useState([
    {
      blockIndex: 1,
      timestamp: "2026-08-26 09:00:00",
      stage: "GENESIS_BLOCK",
      bookingId: "SYSTEM-INIT",
      farmerId: "SYSTEM",
      farmerName: "National Agri Ledger Node",
      dataSummary: "AgriProcure Supabase Cryptographic Ledger Initialized",
      prevHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      currentHash:
        "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      isTampered: false,
    },
  ]);

  const [bottlenecks, setBottlenecks] = useState([
    {
      id: "bn-1",
      centreId: "mandi-1",
      centreName: "Karnal Central Grain Mandi",
      stage: "Weighing Bridge #2",
      expectedMins: 5,
      currentMins: 11,
      severity: "HIGH",
      recommendation: "Add One More Weighing Operator at Counter #2",
      resolved: false,
    },
  ]);

  const [fraudAlerts, setFraudAlerts] = useState([
    {
      id: "fa-1",
      farmerId: "FRM-2026-000998",
      farmerName: "Harpreet Singh (Anomaly Flag)",
      aadhaar: "XXXX-XXXX-4412",
      issueType: "Duplicate Booking Detected",
      description:
        "Attempted 2 concurrent slot reservations for same crop at 2 different Mandis on same day.",
      severity: "CRITICAL",
      status: "Needs Review",
      timestamp: "10:48 AM",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Slot Booking Confirmed",
      message:
        "Token #P001 for Paddy at Karnal Mandi is confirmed for today at 02:00 PM.",
      timestamp: "10:15 AM",
      type: "success",
      read: false,
    },
  ]);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Network Connectivity State (USP 3: Offline-First Operation)
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addNotification({
        title: "Network Connection Restored",
        message: "Reconnected to Internet. Synchronizing pending offline data...",
        type: "success",
      });
      syncPendingOfflineBookings();
    };

    const handleOffline = () => {
      setIsOffline(true);
      addNotification({
        title: "Offline Mode Active",
        message: "Showing last synchronized information.",
        type: "warning",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync Offline Bookings to Supabase upon Reconnect
  const syncPendingOfflineBookings = async () => {
    try {
      const savedPending = JSON.parse(
        localStorage.getItem("agri_pending_offline_bookings") || "[]",
      );
      if (!savedPending || savedPending.length === 0) return;

      for (const pending of savedPending) {
        const newBookingId = `BK-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
        const prefix = pending.centreCode === "P" ? "PS" : `${pending.centreCode}S`;
        const nextSeq = bookings.filter((b) => b.centreCode === pending.centreCode).length + 1;
        const tokenDisplay = `${prefix}-${String(nextSeq).padStart(3, "0")}`;

        const confirmedBooking = {
          ...pending,
          id: newBookingId,
          booking_id: newBookingId,
          tokenDisplay,
          tokenSeq: nextSeq,
          status: "BOOKED",
          stage: "BOOKED",
          isOfflinePending: false,
        };

        setBookings((prev) =>
          prev.map((b) =>
            b.id === pending.id || b.clientReqId === pending.clientReqId
              ? confirmedBooking
              : b,
          ),
        );
        setActiveBookingId(newBookingId);

        try {
          await supabase.from("bookings").insert([
            {
              booking_id: newBookingId,
              slot_date: pending.date,
              slot_time: pending.timeSlot,
              expected_quantity: Number(pending.quantity),
              status: "BOOKED",
            },
          ]);
        } catch {
          // Safe DB fallback
        }

        if (activeChannelRef.current) {
          try {
            activeChannelRef.current.send({
              type: "broadcast",
              event: "new-booking",
              payload: confirmedBooking,
            });
          } catch {
            // Safe broadcast fallback
          }
        }

        addNotification({
          title: "Offline Booking Confirmed!",
          message: `Token #${tokenDisplay} generated on server for ${pending.crop}.`,
          type: "success",
        });
      }

      localStorage.removeItem("agri_pending_offline_bookings");
    } catch (err) {
      console.warn("Offline sync error:", err);
    }
  };

  // Notification Helper
  const addNotification = ({ title, message, type = "info" }) => {
    const newNotif = {
      id: "n-" + Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (!isDemoMode) {
      try {
        supabase.from("notifications").insert([
          {
            title,
            message,
            is_read: false,
          },
        ]);
      } catch {
        // safe fallback
      }
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 5. Supabase Network Reachability Check & Realtime Subscriptions
  useEffect(() => {
    let activeChannel = null;

    async function initializeSystem() {
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        setIsDemoMode(false);
        try {
          await loadSupabaseData();
          activeChannel = subscribeRealtime();
        } catch (err) {
          console.warn("Supabase initialization sync warning:", err);
        }
      }
    }

    async function loadSupabaseData() {
      try {
        const { data: centresData } = await supabase
          .from("procurement_centres")
          .select("*");
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
            })),
          );
        }

        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*");
        if (profilesData && profilesData.length > 0) {
          const formatted = profilesData.map((p) => ({
            id: p.id,
            farmerId: p.farmer_id || `FRM-2026-${p.id.slice(0, 6)}`,
            name: p.name,
            mobile: p.mobile,
            aadhaar: p.aadhaar || "XXXX-XXXX-1234",
            village: p.village || "Taraori",
            district: p.district || "Karnal",
            state: p.state || "Haryana",
            role: p.role || "farmer",
            faceImage: p.face_image_url || "/hero_farmer.jpg",
            bankAccount: "State Bank of India (Ending in 4092)",
            ifsc: "SBIN0001234",
            crops: INITIAL_CROPS,
            history: [],
          }));
          setFarmersList((prev) => {
            const existingIds = new Set(prev.map((f) => f.farmerId));
            const newItems = formatted.filter(
              (f) => !existingIds.has(f.farmerId),
            );
            return [...prev, ...newItems];
          });
        }

        // Fetch bookings with profiles join
        const { data: bookingsData } = await supabase.from("bookings").select(`
            *,
            profiles ( id, farmer_id, name, mobile, village, district, state ),
            procurement_centres ( id, centre_code, centre_name )
          `);

        if (bookingsData && bookingsData.length > 0) {
          const mapped = bookingsData.map((b) => {
            const p = b.profiles || {};
            const c = b.procurement_centres || {};
            const fId = p.farmer_id || "FRM-2026-000123";
            const fName = p.name || "Rameshwar Singh";
            const code = c.centre_code || "P";
            const cName = c.centre_name || "Karnal Central Grain Mandi";
            const tSeq = 1;
            const tDisp = `${code}${String(tSeq).padStart(3, "0")}`;

            return {
              id: b.booking_id || b.id,
              booking_id: b.booking_id || b.id,
              farmerId: fId,
              farmerName: fName,
              farmerMobile: p.mobile,
              centreId: b.centre_id,
              centreCode: code,
              centreName: cName,
              tokenDisplay: tDisp,
              tokenSeq: tSeq,
              crop: "Paddy (Basmati 1121)",
              quantity: Number(b.expected_quantity || 25),
              date: b.slot_date,
              slot_date: b.slot_date,
              timeSlot: b.slot_time,
              slot_time: b.slot_time,
              stage: b.status || "BOOKED",
              status: b.status || "BOOKED",
              stageStatus: "IN_PROGRESS",
              faceVerified: false,
              paymentDetails: {
                mspPerQtl: 2320,
                grossAmount: Number(b.expected_quantity || 25) * 2320,
                dbtTxnId: "DBT-PENDING",
                disbursed: b.status === "COMPLETED",
              },
              qrData: `AGRI-PROCURE-${b.booking_id || b.id}-${tDisp}`,
              createdAt: new Date(
                b.created_at || Date.now(),
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          });

          setBookings((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = mapped.filter((item) => !existingIds.has(item.id));
            return [...newItems, ...prev];
          });
        }

        const { data: auditData } = await supabase
          .from("audit_logs")
          .select("*");
        if (auditData && auditData.length > 0) {
          setAuditChain(
            auditData.map((a, idx) => ({
              blockIndex: idx + 1,
              timestamp: a.timestamp,
              stage: a.event_name,
              bookingId: a.booking_id || "BK-INIT",
              farmerId: "FRM-2026-000123",
              farmerName: "Rameshwar Singh",
              dataSummary: `${a.event_name} logged in Supabase`,
              prevHash: a.previous_hash,
              currentHash: a.hash,
              isTampered: false,
            })),
          );
        }
      } catch (err) {
        console.warn("Supabase initialization sync log:", err);
      }
    }

    function subscribeRealtime() {
      return supabase
        .channel("procure-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookings" },
          async (payload) => {
            if (payload.eventType === "INSERT") {
              const newDb = payload.new;
              const bId = newDb.booking_id || newDb.id;

              let fId = "FRM-2026-000123";
              let fName = "Rameshwar Singh";

              if (newDb.profile_id) {
                try {
                  const { data: p } = await supabase
                    .from("profiles")
                    .select("farmer_id, name")
                    .eq("id", newDb.profile_id)
                    .maybeSingle();
                  if (p) {
                    fId = p.farmer_id || fId;
                    fName = p.name || fName;
                  }
                } catch {
                  // Safe fallback
                }
              }

              let cCode = "P";
              let cName = "Karnal Central Grain Mandi";

              if (newDb.centre_id) {
                try {
                  const { data: c } = await supabase
                    .from("procurement_centres")
                    .select("centre_code, centre_name")
                    .eq("id", newDb.centre_id)
                    .maybeSingle();
                  if (c) {
                    cCode = c.centre_code || "P";
                    cName = c.centre_name || cName;
                  }
                } catch {
                  // Safe fallback
                }
              }

              const newBookingRecord = {
                id: bId,
                booking_id: bId,
                farmerId: fId,
                farmerName: fName,
                centreId: newDb.centre_id,
                centreCode: cCode,
                centreName: cName,
                tokenDisplay: `${cCode}001`,
                tokenSeq: 1,
                crop: "Paddy (Basmati 1121)",
                quantity: Number(newDb.expected_quantity || 25),
                date: newDb.slot_date,
                slot_date: newDb.slot_date,
                timeSlot: newDb.slot_time,
                slot_time: newDb.slot_time,
                stage: newDb.status || "BOOKED",
                status: newDb.status || "BOOKED",
                stageStatus: "IN_PROGRESS",
                faceVerified: false,
                paymentDetails: {
                  mspPerQtl: 2320,
                  grossAmount: Number(newDb.expected_quantity || 25) * 2320,
                  dbtTxnId: "DBT-PENDING",
                  disbursed: false,
                },
                qrData: `AGRI-PROCURE-${bId}-${cCode}001`,
                createdAt: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };

              setBookings((prev) => {
                const exists = prev.some(
                  (item) => item.id === bId || item.booking_id === bId,
                );
                if (exists) {
                  return prev.map((item) =>
                    item.id === bId || item.booking_id === bId
                      ? { ...item, ...newBookingRecord }
                      : item,
                  );
                }
                return [newBookingRecord, ...prev];
              });

              addNotification({
                title: "Realtime Booking Received",
                message: `New booking ${bId} (${fName}) arrived at ${cName}.`,
                type: "info",
              });
            } else if (payload.eventType === "UPDATE") {
              const updatedStatus = payload.new.status;
              const updatedId = payload.new.booking_id || payload.new.id;

              setBookings((prev) =>
                prev.map((b) =>
                  b.id === updatedId ||
                  b.booking_id === updatedId ||
                  b.id === payload.new.id ||
                  b.booking_id === payload.new.booking_id
                    ? {
                        ...b,
                        stage: updatedStatus,
                        status: updatedStatus,
                      }
                    : b,
                ),
              );
            }
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "workflow" },
          (payload) => {
            if (
              payload.eventType === "UPDATE" ||
              payload.eventType === "INSERT"
            ) {
              addNotification({
                title: "Workflow Live Update",
                message: `Stage updated to ${payload.new.stage} (${payload.new.status})`,
                type: "info",
              });
            }
          },
        )
        .on("broadcast", { event: "new-booking" }, (payload) => {
          const newBooking = payload.payload;
          if (newBooking) {
            const bId = newBooking.id || newBooking.booking_id;
            setBookings((prev) => {
              const exists = prev.some(
                (item) => item.id === bId || item.booking_id === bId,
              );
              if (exists) {
                return prev.map((item) =>
                  item.id === bId || item.booking_id === bId
                    ? { ...item, ...newBooking }
                    : item,
                );
              }
              return [newBooking, ...prev];
            });
            addNotification({
              title: "Realtime Booking Received",
              message: `New booking ${bId} (${newBooking.farmerName || "Farmer"}) arrived at ${newBooking.centreName || "Procurement Centre"}.`,
              type: "info",
            });
          }
        })
        .on("broadcast", { event: "stage-updated" }, (payload) => {
          const { bookingId, nextStage, remarks, extraData } =
            payload.payload || {};
          if (bookingId && nextStage) {
            const timeStr = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            setBookings((prev) =>
              prev.map((b) => {
                if (b.id === bookingId || b.booking_id === bookingId) {
                  const updatedHistory = [
                    ...(b.stageHistory || [
                      {
                        stage: "BOOKED",
                        label: "Booked",
                        time: b.createdAt || "02:00 PM",
                      },
                    ]),
                    { stage: nextStage, label: nextStage, time: timeStr },
                  ];
                  return {
                    ...b,
                    stage: nextStage,
                    status: nextStage,
                    stageHistory: updatedHistory,
                    ...(extraData || {}),
                  };
                }
                return b;
              }),
            );
            addNotification({
              title: `Workflow Live Update: ${nextStage}`,
              message: `Booking ${bookingId} stage updated to ${nextStage}.`,
              type: "info",
            });
          }
        })
        .subscribe((status) => {
          if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT" ||
            status === "CLOSED"
          ) {
            // Silently handled in DEMO MODE
          }
        });

      activeChannelRef.current = channel;
      return channel;
    }

    initializeSystem();

    return () => {
      if (activeChannel) {
        try {
          supabase.removeChannel(activeChannel);
        } catch {
          // Safe channel removal fallback
        }
      }
    };
  }, []);

  // Navigation Guard Helper
  const navigateTo = (view, options = {}) => {
    const activeUser =
      options?.overrideUser !== undefined ? options.overrideUser : user;
    const protectedViews = [
      "farmer-dash",
      "worker-dash",
      "officer-dash",
      "book-slot",
      "profile",
      "queue",
      "audit",
      "qr-scanner",
    ];
    if (protectedViews.includes(view) && !activeUser) {
      setAuthRedirectView(view);
      setCurrentView("auth");
      addNotification({
        title: "Sign-in Required",
        message: "Please log in to your account to access this portal.",
        type: "info",
      });
      return;
    }

    if (view === "how-it-works" && typeof options?.step === "number") {
      const stepIdx =
        options.step >= 1 && options.step <= 6
          ? options.step - 1
          : options.step;
      setInitialWorkflowStep(stepIdx);
    } else if (view === "how-it-works") {
      setInitialWorkflowStep(0);
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 6. Supabase Farmer Registration & Authentication
  const registerFarmer = async (formData) => {
    // A. Pre-check if mobile already exists in memory
    const existingInState = farmersList.find(
      (f) => f.mobile === formData.mobile,
    );
    if (existingInState) {
      return {
        success: false,
        error:
          "An account with this mobile number already exists. Please sign in.",
      };
    }

    // B. Pre-check if mobile exists in Supabase profiles
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("farmer_id, mobile")
        .eq("mobile", formData.mobile)
        .maybeSingle();

      if (existingProfile) {
        return {
          success: false,
          error:
            "An account with this mobile number already exists. Please sign in.",
        };
      }
    } catch {
      // Safe fallback
    }

    // C. Unique Farmer ID Generation
    const nextNum = 1000 + farmersList.length + Math.floor(Math.random() * 900);
    const newFarmerId = `FRM-2026-${String(nextNum).padStart(6, "0")}`;

    // D. Persist to Supabase `profiles` and handle potential 409 Conflict
    let dbProfileId = null;
    try {
      const { data: insertedProfiles, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            farmer_id: newFarmerId,
            name: formData.name,
            mobile: formData.mobile,
            aadhaar: formData.aadhaar,
            village: formData.village || "Taraori",
            district: formData.district || "Karnal",
            state: formData.state || "Haryana",
            role: "farmer",
            face_image_url: formData.faceImage || "/hero_farmer.jpg",
          },
        ])
        .select();

      if (profileError) {
        if (
          profileError.code === "23505" ||
          profileError.status === 409 ||
          profileError.message?.toLowerCase().includes("unique") ||
          profileError.message?.toLowerCase().includes("duplicate")
        ) {
          return {
            success: false,
            error:
              "An account with this mobile number or Farmer ID already exists. Please sign in.",
          };
        }
      } else if (insertedProfiles && insertedProfiles.length > 0) {
        dbProfileId = insertedProfiles[0].id;
      }
    } catch {
      // Fallback
    }

    // E. Construct Farmer Object with Password & State Update
    const newFarmer = {
      id: dbProfileId || "usr-" + Date.now(),
      farmerId: newFarmerId,
      name: formData.name,
      mobile: formData.mobile,
      aadhaar: `XXXX-XXXX-${formData.aadhaar ? formData.aadhaar.slice(-4) : "1234"}`,
      village: formData.village || "Taraori",
      district: formData.district || "Karnal",
      state: formData.state || "Haryana",
      address:
        formData.address ||
        `${formData.village || "Taraori"}, ${formData.district || "Karnal"}`,
      faceImage: formData.faceImage || "/hero_farmer.jpg",
      bankAccount: "State Bank of India (Ending in 7712)",
      ifsc: "SBIN0005432",
      role: "farmer",
      password: formData.password || "1234",
      crops: INITIAL_CROPS,
      history: [],
    };

    setFarmersList((prev) => [newFarmer, ...prev]);

    // F. Cryptographic Registration Hash
    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${newFarmerId}|${newFarmer.name}|${newFarmer.aadhaar}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const regBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      stage: "FARMER_REGISTRATION",
      bookingId: "REG-INIT",
      farmerId: newFarmerId,
      farmerName: newFarmer.name,
      dataSummary: `New Farmer Registered • Permanent ID ${newFarmerId} • Biometric Face Enrolled`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };
    setAuditChain((prev) => [...prev, regBlock]);

    try {
      await supabase.from("audit_logs").insert([
        {
          event_name: "FARMER_REGISTRATION",
          hash: newHash,
          previous_hash: prevBlock.currentHash,
        },
      ]);
    } catch {
      // Safe fallback
    }

    addNotification({
      title: "Farmer Registration Successful!",
      message: `Your permanent identity ${newFarmerId} has been created.`,
      type: "success",
    });

    return { success: true, farmerId: newFarmerId, farmer: newFarmer };
  };

  const loginUser = async (identifier, password, role = "farmer") => {
    const rawId = String(identifier || "").trim();
    const cleanId = rawId.toUpperCase();
    const cleanPass = String(password || "").trim();

    // 1. Mandi Staff / Worker Authentication
    if (
      role === "worker" ||
      role === "staff" ||
      cleanId === "STAFF" ||
      cleanId === "STAFF1" ||
      rawId.toLowerCase() === "staff" ||
      rawId.toLowerCase() === "staff1" ||
      cleanId.startsWith("WRK") ||
      cleanId.startsWith("STAFF")
    ) {
      if (
        cleanPass !== "staff1" &&
        cleanPass !== "Staff123" &&
        cleanPass !== "1234"
      ) {
        return {
          success: false,
          error:
            "Incorrect password for Mandi Staff account. Please try again.",
        };
      }
      const workerUser = {
        id: "WRK-HR-108",
        name: "Sukhvinder Singh",
        role: "worker",
        assignedStage: workerAssignedStage || "ALL",
        mandiId: "mandi-1",
        mandiName: "Karnal Central Grain Mandi",
      };
      setUser(workerUser);
      localStorage.setItem("agri_user", JSON.stringify(workerUser));
      addNotification({
        title: "Worker Portal Initialized",
        message: "Signed in as Procurement Staff.",
        type: "success",
      });
      navigateTo("worker-dash", { overrideUser: workerUser });
      return { success: true, user: workerUser };
    }

    // 2. Command Officer Authentication
    if (
      role === "officer" ||
      cleanId === "OFFICER" ||
      cleanId === "OFFICER1" ||
      rawId.toLowerCase() === "officer" ||
      rawId.toLowerCase() === "officer1" ||
      cleanId.startsWith("OFFICER")
    ) {
      if (
        cleanPass !== "officer1" &&
        cleanPass !== "Officer123" &&
        cleanPass !== "1234"
      ) {
        return {
          success: false,
          error:
            "Incorrect password for Command Officer account. Please try again.",
        };
      }
      const officerUser = {
        id: "OFFICER-HR-402",
        name: "Devendra Sharma",
        role: "officer",
        designation: "Chief Procurement Officer",
        zone: "North Zone (Haryana & Punjab)",
      };
      setUser(officerUser);
      localStorage.setItem("agri_user", JSON.stringify(officerUser));
      addNotification({
        title: "Officer Access Granted",
        message: "Signed in to Mandi Higher Authority & Command Tower.",
        type: "success",
      });
      navigateTo("officer-dash", { overrideUser: officerUser });
      return { success: true, user: officerUser };
    }

    // 3. Farmer Authentication
    let matchedFarmer = farmersList.find(
      (f) =>
        f.mobile === rawId ||
        (f.farmerId && f.farmerId.toUpperCase() === cleanId) ||
        (cleanId === "FRM-2026-000123" && f.farmerId === "FRM-2026-000123"),
    );

    // If not in memory, query Supabase profiles table directly using robust queries
    if (!matchedFarmer) {
      try {
        // Query A: By mobile number
        const { data: byMobile } = await supabase
          .from("profiles")
          .select("*")
          .eq("mobile", rawId)
          .maybeSingle();

        let dbProfile = byMobile;

        // Query B: By exact farmer_id
        if (!dbProfile) {
          const { data: byFarmerId } = await supabase
            .from("profiles")
            .select("*")
            .eq("farmer_id", cleanId)
            .maybeSingle();
          dbProfile = byFarmerId;
        }

        // Query C: By case-insensitive farmer_id
        if (!dbProfile) {
          const { data: byIlike } = await supabase
            .from("profiles")
            .select("*")
            .ilike("farmer_id", cleanId)
            .maybeSingle();
          dbProfile = byIlike;
        }

        if (dbProfile) {
          matchedFarmer = {
            id: dbProfile.id,
            farmerId:
              dbProfile.farmer_id || `FRM-2026-${dbProfile.id.slice(0, 6)}`,
            name: dbProfile.name,
            mobile: dbProfile.mobile,
            aadhaar: dbProfile.aadhaar || "XXXX-XXXX-1234",
            village: dbProfile.village || "Taraori",
            district: dbProfile.district || "Karnal",
            state: dbProfile.state || "Haryana",
            role: dbProfile.role || "farmer",
            password: cleanPass || "1234",
            faceImage: dbProfile.face_image_url || "/hero_farmer.jpg",
            bankAccount: "State Bank of India (Ending in 4092)",
            ifsc: "SBIN0001234",
            crops: INITIAL_CROPS,
            history: [],
          };
          setFarmersList((prev) => [matchedFarmer, ...prev]);
        }
      } catch (err) {
        console.warn("Supabase farmer login lookup error:", err);
      }
    }

    const activeFarmer =
      matchedFarmer ||
      (cleanId === "FRM-2026-000123" ||
      rawId === "9876543210" ||
      (farmerProfile &&
        (farmerProfile.mobile === rawId ||
          farmerProfile.farmerId?.toUpperCase() === cleanId))
        ? farmerProfile
        : null);

    if (!activeFarmer) {
      return {
        success: false,
        error:
          "Farmer account not found. Please check your Farmer ID or Mobile, or register.",
      };
    }

    if (
      cleanPass !== "1234" &&
      activeFarmer.password &&
      cleanPass !== activeFarmer.password
    ) {
      return {
        success: false,
        error: "Incorrect password. Please try again.",
      };
    }

    const farmerUser = {
      ...activeFarmer,
      role: "farmer",
    };
    setUser(farmerUser);
    setFarmerProfile(activeFarmer);
    localStorage.setItem("agri_user", JSON.stringify(farmerUser));
    addNotification({
      title: "Farmer Sign-In Successful",
      message: `Welcome back, ${farmerUser.name}! (ID: ${farmerUser.farmerId})`,
      type: "success",
    });
    const targetDash = authRedirectView || "farmer-dash";
    setAuthRedirectView(null);
    navigateTo(targetDash, { overrideUser: farmerUser });
    return { success: true, user: farmerUser };
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("agri_user");
    setCurrentView("home");
    addNotification({
      title: "Logged Out",
      message: "You have been safely signed out.",
      type: "info",
    });
  };

  const updateFarmerProfile = async (updatedData) => {
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const cleanName = String(updatedData.name || "").trim();
    const cleanMobile = String(updatedData.mobile || "").trim();
    const cleanAddress = String(updatedData.address || "").trim();
    const cleanEmail = String(updatedData.email || "").trim();

    if (!cleanName) {
      return { success: false, error: "Full Name is required." };
    }
    if (!cleanMobile || !/^\d{10}$/.test(cleanMobile)) {
      return {
        success: false,
        error: "Please enter a valid 10-digit mobile number.",
      };
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    // 1. Mobile uniqueness pre-check in Supabase profiles (exclude current user)
    try {
      const { data: existingMobileOwner } = await supabase
        .from("profiles")
        .select("id, farmer_id")
        .eq("mobile", cleanMobile)
        .neq("id", user.id)
        .maybeSingle();

      if (existingMobileOwner) {
        return {
          success: false,
          error:
            "This mobile number is already associated with another Farmer account.",
        };
      }
    } catch (err) {
      console.warn("Mobile uniqueness check error:", err);
    }

    // 2. Mobile uniqueness pre-check in memory farmersList (exclude current user)
    const inMemoryDuplicate = farmersList.find(
      (f) =>
        f.mobile === cleanMobile &&
        f.farmerId !== farmerProfile.farmerId &&
        f.id !== user.id,
    );
    if (inMemoryDuplicate) {
      return {
        success: false,
        error:
          "This mobile number is already associated with another Farmer account.",
      };
    }

    // 3. Save updates directly to Supabase DB `profiles` table
    try {
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          name: cleanName,
          mobile: cleanMobile,
          address: cleanAddress,
          email: cleanEmail,
        })
        .eq("id", user.id);

      if (updateErr) {
        if (
          updateErr.code === "23505" ||
          updateErr.status === 409 ||
          updateErr.message?.toLowerCase().includes("unique") ||
          updateErr.message?.toLowerCase().includes("duplicate")
        ) {
          return {
            success: false,
            error:
              "This mobile number is already associated with another Farmer account.",
          };
        }
        return {
          success: false,
          error: "Unable to update your profile. Please try again.",
        };
      }
    } catch (err) {
      console.warn("Database profile update error:", err);
      return {
        success: false,
        error: "Unable to connect. Please try again.",
      };
    }

    // 4. Update React Context State
    const updatedFarmer = {
      ...farmerProfile,
      name: cleanName,
      mobile: cleanMobile,
      address: cleanAddress,
      email: cleanEmail,
    };

    const updatedUser = {
      ...user,
      name: cleanName,
      mobile: cleanMobile,
      address: cleanAddress,
      email: cleanEmail,
    };

    setFarmerProfile(updatedFarmer);
    setUser(updatedUser);
    localStorage.setItem("agri_user", JSON.stringify(updatedUser));

    setFarmersList((prev) =>
      prev.map((f) =>
        f.farmerId === farmerProfile.farmerId || f.id === user.id
          ? updatedFarmer
          : f,
      ),
    );

    // 5. Update active bookings state to reflect updated farmer name & mobile
    setBookings((prev) =>
      prev.map((b) =>
        b.farmerId === farmerProfile.farmerId ||
        (b.profiles && b.profiles.id === user.id)
          ? { ...b, farmerName: cleanName, farmerMobile: cleanMobile }
          : b,
      ),
    );

    addNotification({
      title: "Profile Updated",
      message: "Your profile information has been saved successfully.",
      type: "success",
    });

    return { success: true, farmer: updatedFarmer };
  };

  // 7. Multi-Crop Profile Management (CRUD)
  const addCrop = async (cropData) => {
    const newCrop = {
      id: "crop-" + Date.now(),
      name: cropData.name,
      areaAcres: Number(cropData.areaAcres),
      expectedYieldQuintals: Number(cropData.expectedYieldQuintals),
      mspPerQtl: cropData.name.toLowerCase().includes("paddy")
        ? 2320
        : cropData.name.toLowerCase().includes("wheat")
          ? 2425
          : 5000,
    };
    setCrops((prev) => [...prev, newCrop]);
    setFarmerProfile((prev) => ({
      ...prev,
      crops: [...(prev.crops || []), newCrop],
    }));

    try {
      await supabase.from("farmer_crops").insert([
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
      title: "Crop Portfolio Updated",
      message: `Registered ${newCrop.name} (${newCrop.areaAcres} Acres) for procurement in Supabase.`,
      type: "success",
    });
  };

  const updateCrop = (id, updatedData) => {
    setCrops((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updatedData,
              areaAcres: Number(updatedData.areaAcres),
              expectedYieldQuintals: Number(updatedData.expectedYieldQuintals),
            }
          : c,
      ),
    );
  };

  const deleteCrop = (id) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  // 8. Smart Slot Booking (Supabase `bookings` & `tokens`)
  const bookSlot = async (bookingData) => {
    const centre =
      mandiCentres.find(
        (m) =>
          m.id === bookingData.centreId ||
          m.centre_code === bookingData.centreId,
      ) || mandiCentres[0];
    const code = centre.centre_code || centre.code || "P";
    const prefix = code === "P" ? "PS" : `${code}S`;

    // USP 4 & High Demand Resilience: Strict Capacity Enforcement
    const slotObj = timeSlots.find((s) => s.time === bookingData.timeSlot) || {
      capacity: 20,
    };
    const activeSlotBookings = bookings.filter(
      (b) =>
        (b.centreId === bookingData.centreId || b.centreCode === code) &&
        (b.date === bookingData.date || b.slot_date === bookingData.date) &&
        (b.timeSlot === bookingData.timeSlot ||
          b.slot_time === bookingData.timeSlot) &&
        b.stage !== "COMPLETED" &&
        b.status !== "COMPLETED",
    ).length;

    if (activeSlotBookings >= slotObj.capacity) {
      throw new Error("Slot full. Please choose another slot.");
    }

    const nextSeq =
      bookings.filter((b) => b.centreCode === code || b.centreId === centre.id)
        .length + 1;
    const tokenDisplay = `${prefix}-${String(nextSeq).padStart(3, "0")}`; // e.g. PS-001, PS-002
    const newBookingId = `BK-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const qrData = `AGRI-PROCURE-${farmerProfile.farmerId}-${tokenDisplay}-${bookingData.crop.replace(/\s+/g, "")}`;

    const matchedCrop = crops.find((c) => c.name === bookingData.crop);
    const mspRate = matchedCrop ? matchedCrop.mspPerQtl : 2320;
    const grossAmount = mspRate * Number(bookingData.quantity);

    // USP 3: Offline-First Booking Queue handling
    if (!navigator.onLine) {
      const clientReqId = `OFFLINE-REQ-${Date.now()}`;
      const offlineBooking = {
        id: clientReqId,
        booking_id: clientReqId,
        farmerId: farmerProfile.farmerId,
        farmerName: farmerProfile.name,
        centreId: centre.id,
        centreCode: code,
        centreName: centre.centre_name || centre.name,
        tokenDisplay: `${prefix}-PENDING`,
        tokenSeq: nextSeq,
        crop: bookingData.crop,
        quantity: Number(bookingData.quantity),
        date: bookingData.date,
        slot_date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        slot_time: bookingData.timeSlot,
        stage: "BOOKED",
        status: "PENDING_SYNC",
        isOfflinePending: true,
        clientReqId,
        paymentDetails: {
          mspPerQtl: mspRate,
          grossAmount,
          dbtTxnId: "DBT-PENDING",
          disbursed: false,
        },
        qrData,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setBookings((prev) => [offlineBooking, ...prev]);
      setActiveBookingId(clientReqId);

      try {
        const existingPending = JSON.parse(
          localStorage.getItem("agri_pending_offline_bookings") || "[]",
        );
        localStorage.setItem(
          "agri_pending_offline_bookings",
          JSON.stringify([...existingPending, offlineBooking]),
        );
      } catch {
        // storage fallback
      }

      addNotification({
        title: "Offline Booking Saved",
        message:
          "Status: PENDING SYNC. Request saved on device and will be submitted automatically when connection is restored.",
        type: "warning",
      });

      return offlineBooking;
    }

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${newBookingId}|${farmerProfile.farmerId}|${centre.centre_name || centre.name}|${bookingData.crop}|${bookingData.quantity}|${tokenDisplay}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

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
      stage: "BOOKED",
      status: "BOOKED",
      stageStatus: "CONFIRMED",
      faceVerified: false,
      rejectionDetails: null,
      paymentDetails: {
        mspPerQtl: mspRate,
        grossAmount,
        dbtTxnId: "DBT-PENDING",
        disbursed: false,
      },
      qrData,
      createdHash: newHash,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingId(newBookingId);

    // Atomic Capacity Update
    setTimeSlots((prev) =>
      prev.map((s) =>
        s.time === bookingData.timeSlot
          ? { ...s, booked: Math.min(s.capacity, s.booked + 1) }
          : s,
      ),
    );

    // Audit Chain
    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      stage: "BOOKED",
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
      let profileUuid = null;
      let centreUuid = null;

      // Get profile UUID from Supabase profiles
      const { data: prof } = await supabase
        .from("profiles")
        .select("id")
        .eq("farmer_id", farmerProfile.farmerId)
        .maybeSingle();

      if (prof) {
        profileUuid = prof.id;
      } else {
        // Create profile if missing in Supabase DB
        const { data: newProf } = await supabase
          .from("profiles")
          .insert([
            {
              farmer_id: farmerProfile.farmerId,
              name: farmerProfile.name,
              mobile: farmerProfile.mobile,
              village: farmerProfile.village || "Taraori",
              district: farmerProfile.district || "Karnal",
              state: farmerProfile.state || "Haryana",
              role: "farmer",
            },
          ])
          .select()
          .single();
        if (newProf) profileUuid = newProf.id;
      }

      // Get centre UUID from Supabase procurement_centres
      const { data: cent } = await supabase
        .from("procurement_centres")
        .select("id")
        .eq("centre_code", code)
        .maybeSingle();

      if (cent) {
        centreUuid = cent.id;
      }

      if (profileUuid && centreUuid) {
        const { data: insertedDb, error: bErr } = await supabase
          .from("bookings")
          .insert([
            {
              booking_id: newBookingId,
              profile_id: profileUuid,
              centre_id: centreUuid,
              slot_date: bookingData.date,
              slot_time: bookingData.timeSlot,
              expected_quantity: Number(bookingData.quantity),
              estimated_processing_time: 30,
              status: "BOOKED",
            },
          ])
          .select()
          .single();

        if (insertedDb) {
          await supabase.from("tokens").insert([
            {
              booking_id: insertedDb.id,
              centre_code: code,
              token_number: tokenDisplay,
              queue_position: nextSeq,
              date: bookingData.date,
            },
          ]);

          await supabase.from("audit_logs").insert([
            {
              booking_id: insertedDb.id,
              event_name: "SLOT_BOOKED",
              hash: newHash,
              previous_hash: prevBlock.currentHash,
            },
          ]);
        } else if (bErr) {
          console.warn("Supabase booking insert notice:", bErr.message);
        }
      }
    } catch (err) {
      console.warn("Supabase booking insert fallback:", err);
    }

    addNotification({
      title: "Slot Reserved!",
      message: `Token #${tokenDisplay} generated for ${bookingData.crop} at ${centre.centre_name || centre.name}.`,
      type: "success",
    });

    // Multi-Device WebSocket Realtime Broadcast
    try {
      if (activeChannelRef.current) {
        activeChannelRef.current.send({
          type: "broadcast",
          event: "new-booking",
          payload: newBooking,
        });
      }
    } catch {
      // Safe broadcast fallback
    }

    return newBooking;
  };

  // Feedback State & Anonymous Submission
  const [feedbackList, setFeedbackList] = useState([
    {
      id: "FB-2026-00418",
      bookingId: "BK-2026-000142",
      centreName: "Karnal Central Grain Mandi",
      date: "03 Sep 2026",
      rating: 2,
      category: "WEIGHING DELAY",
      feedbackText: "Waiting at the weighing stage was longer than expected.",
      stage: "WEIGHING",
      anonymousRef: "FB-2026-00418",
    },
    {
      id: "FB-2026-00419",
      bookingId: "BK-2026-000144",
      centreName: "Karnal Central Grain Mandi",
      date: "03 Sep 2026",
      rating: 5,
      category: "PROCUREMENT",
      feedbackText: "Process was clear and easy. Very helpful staff.",
      stage: "PROCUREMENT",
      anonymousRef: "FB-2026-00419",
    },
  ]);

  const submitAnonymousFeedback = (data) => {
    const nextNum = 420 + feedbackList.length;
    const anonId = `FB-2026-00${nextNum}`;
    const newFeedback = {
      id: anonId,
      bookingId: data.bookingId || "BK-2026-000147",
      centreName: data.centreName || "Karnal Central Grain Mandi",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      rating: Number(data.rating) || 4,
      category: data.category || "GENERAL",
      feedbackText: data.feedbackText || "",
      stage: data.stage || "PROCUREMENT",
      anonymousRef: anonId,
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);

    addNotification({
      title: "Feedback Submitted",
      message: "Your feedback has been anonymously sent to the Command Tower.",
      type: "success",
    });
    return newFeedback;
  };

  // Universal Workflow Stage Advancer (Role-permission Enforced)
  const advanceBookingStage = async (
    bookingId,
    nextStage,
    remarks = "",
    extraData = {},
  ) => {
    // Role Authorization Guard: Farmers cannot mutate workflow beyond arrival check-in
    if (user && user.role === "farmer" && nextStage !== "ARRIVED") {
      console.warn(
        `[Security Authorization] Farmer (${user.name}) attempted unauthorized workflow mutation to ${nextStage}`,
      );
      addNotification({
        title: "Permission Denied",
        message:
          "Farmers are not permitted to modify procurement workflow stages. Stage processing is managed by Mandi Staff.",
        type: "warning",
      });
      return;
    }

    const booking = bookings.find(
      (b) => b.id === bookingId || b.booking_id === bookingId,
    );
    if (!booking) return;

    const prevBlock = auditChain[auditChain.length - 1] || {
      blockIndex: 0,
      currentHash:
        "0x3c9e1d7b0e885e4f2c118f2a4b127f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e",
    };
    const rawData = `${bookingId}|${nextStage}|${booking.farmerName}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const stageObj = WORKFLOW_STAGES.find((s) => s.key === nextStage);
    const stageLabel = stageObj ? stageObj.label : nextStage;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId || b.booking_id === bookingId) {
          const updatedHistory = [
            ...(b.stageHistory || [
              {
                stage: "BOOKED",
                label: "Booked",
                time: b.createdAt || "02:00 PM",
              },
            ]),
            { stage: nextStage, label: stageLabel, time: timeStr },
          ];

          const weighedQuantity =
            extraData.weighedQuantity ||
            b.weighedQuantity ||
            (b.quantity ? Number(b.quantity) + 0.18 : 25.18);
          const mspRate = b.paymentDetails?.mspPerQtl || 2320;
          const grossAmount =
            extraData.grossAmount || Math.round(weighedQuantity * mspRate);

          return {
            ...b,
            stage: nextStage,
            status: nextStage,
            stageStatus: "IN_PROGRESS",
            weighedQuantity,
            stageHistory: updatedHistory,
            paymentDetails: {
              ...b.paymentDetails,
              grossAmount,
              disbursed:
                nextStage === "COMPLETED" ? true : b.paymentDetails?.disbursed,
              disbursedAt:
                nextStage === "COMPLETED"
                  ? new Date().toLocaleDateString() + " " + timeStr
                  : b.paymentDetails?.disbursedAt,
            },
          };
        }
        return b;
      }),
    );

    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      stage: nextStage,
      bookingId: booking.id,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      dataSummary: `Stage transitioned to ${nextStage} for Token #${booking.tokenDisplay} ${remarks ? `(${remarks})` : ""}`,
      prevHash: prevBlock.currentHash,
      currentHash: newHash,
      isTampered: false,
    };

    setAuditChain((prev) => [...prev, newBlock]);

    try {
      const bIdMatch = booking.booking_id || booking.id;
      const dbIdMatch = booking.db_id || booking.id;
      await supabase
        .from("bookings")
        .update({ status: nextStage })
        .or(`booking_id.eq.${bIdMatch},id.eq.${dbIdMatch}`);

      await supabase.from("workflow").insert([
        {
          stage: nextStage,
          status: "APPROVED",
          remarks: remarks || `Advanced to ${nextStage}`,
        },
      ]);
    } catch {
      // safe fallback
    }

    // Multi-Device WebSocket Realtime Broadcast for Stage Update
    try {
      if (activeChannelRef.current) {
        activeChannelRef.current.send({
          type: "broadcast",
          event: "stage-updated",
          payload: {
            bookingId: booking.id || booking.booking_id,
            nextStage,
            remarks,
            extraData,
          },
        });
      }
    } catch {
      // Safe broadcast fallback
    }
  };

  // 9. Mandi Gate Arrival Verification
  const verifyGateArrival = async (bookingId) => {
    const booking = bookings.find(
      (b) => b.id === bookingId || b.booking_id === bookingId,
    );
    if (!booking) return { success: false };

    await advanceBookingStage(
      booking.id,
      "ARRIVED",
      "Mandi Gate Token Arrival Confirmed",
    );

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.booking_id === bookingId
          ? { ...b, faceVerified: true }
          : b,
      ),
    );

    addNotification({
      title: "Gate Arrival Confirmed!",
      message: `Farmer ${booking.farmerName} confirmed at Mandi Gate. Token #${booking.tokenDisplay} is now ARRIVED.`,
      type: "success",
    });

    return { success: true };
  };

  const verifyFaceArrival = verifyGateArrival;

  // 10. Worker Approval / Rejection Logic
  const approveStage = async (bookingId, stageKey, remarks = "") => {
    const currentIdx = WORKFLOW_STAGES.findIndex((s) => s.key === stageKey);
    const nextStage =
      currentIdx < WORKFLOW_STAGES.length - 1
        ? WORKFLOW_STAGES[currentIdx + 1].key
        : "COMPLETED";
    await advanceBookingStage(
      bookingId,
      nextStage,
      remarks || `Approved by ${user?.name || "Staff"}`,
    );
  };

  const rejectStage = async (
    bookingId,
    stageKey,
    { reason, remarks, proofImage },
  ) => {
    const booking = bookings.find(
      (b) => b.id === bookingId || b.booking_id === bookingId,
    );
    if (!booking) return;

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|REJECTED|${stageKey}|${reason}|${Date.now()}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.booking_id === bookingId
          ? {
              ...b,
              stageStatus: "REJECTED",
              rejectionDetails: {
                rejectedAtStage: stageKey,
                reason,
                remarks,
                proofImage: proofImage || "Proof attached (Moisture meter log)",
                rejectedBy: user?.name || "Worker Staff",
                rejectedAt: new Date().toLocaleTimeString(),
              },
            }
          : b,
      ),
    );

    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
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
      await supabase.from("workflow").insert([
        {
          stage: stageKey,
          status: "REJECTED",
          remarks: `${reason}: ${remarks}`,
          proof_url: proofImage,
        },
      ]);

      await supabase.from("audit_logs").insert([
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
      type: "warning",
    });
  };

  // 11. Officer Final Payment Approval (Supabase `payments` table)
  const approveFinalPayment = async (bookingId) => {
    const booking = bookings.find(
      (b) => b.id === bookingId || b.booking_id === bookingId,
    );
    if (!booking) return;

    const dbtTxnId = `DBT-SBI-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.booking_id === bookingId
          ? {
              ...b,
              stage: "COMPLETED",
              status: "COMPLETED",
              stageStatus: "COMPLETED",
              paymentDetails: {
                ...b.paymentDetails,
                dbtTxnId,
                disbursed: true,
                disbursedAt:
                  new Date().toLocaleDateString() +
                  " " +
                  new Date().toLocaleTimeString(),
              },
            }
          : b,
      ),
    );

    const prevBlock = auditChain[auditChain.length - 1];
    const rawData = `${bookingId}|COMPLETED|${dbtTxnId}|${booking.paymentDetails.grossAmount}`;
    const newHash = await generateSHA256(prevBlock.currentHash + rawData);

    const newBlock = {
      blockIndex: auditChain.length + 1,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      stage: "PAYMENT_COMPLETED",
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
      await supabase.from("payments").insert([
        {
          amount: booking.paymentDetails.grossAmount,
          payment_status: "DISBURSED",
          payment_date: new Date().toISOString(),
        },
      ]);

      await supabase.from("audit_logs").insert([
        {
          booking_id: booking.booking_id || booking.id,
          event_name: "PAYMENT_COMPLETED",
          hash: newHash,
          previous_hash: prevBlock.currentHash,
        },
      ]);
    } catch {
      // safe fallback
    }

    addNotification({
      title: "DBT Payment Disbursed in Supabase!",
      message: `₹${booking.paymentDetails.grossAmount.toLocaleString()} transferred to ${booking.farmerName}'s account (${dbtTxnId}).`,
      type: "success",
    });
  };

  // Farmer Search Tool (Searches local state + Supabase Database)
  const searchFarmerById = async (query) => {
    if (!query) return null;
    const cleanQ = query.trim().toUpperCase();

    const memoryMatch = farmersList.find(
      (f) =>
        f.farmerId.toUpperCase() === cleanQ ||
        f.mobile.includes(cleanQ) ||
        f.name.toUpperCase().includes(cleanQ),
    );
    if (memoryMatch) return memoryMatch;

    // Database lookup for farmer profile
    try {
      let p = null;
      const { data: byId } = await supabase
        .from("profiles")
        .select("*")
        .eq("farmer_id", cleanQ)
        .maybeSingle();
      p = byId;

      if (!p) {
        const { data: byMob } = await supabase
          .from("profiles")
          .select("*")
          .eq("mobile", query.trim())
          .maybeSingle();
        p = byMob;
      }

      if (!p) {
        const { data: byName } = await supabase
          .from("profiles")
          .select("*")
          .ilike("name", `%${query.trim()}%`)
          .maybeSingle();
        p = byName;
      }

      if (p) {
        const foundFarmer = {
          id: p.id,
          farmerId: p.farmer_id || cleanQ,
          name: p.name,
          mobile: p.mobile,
          aadhaar: p.aadhaar || "XXXX-XXXX-1234",
          village: p.village || "Taraori",
          district: p.district || "Karnal",
          state: p.state || "Haryana",
          role: p.role || "farmer",
          crops: INITIAL_CROPS,
          history: [],
        };
        setFarmersList((prev) => [foundFarmer, ...prev]);
        return foundFarmer;
      }
    } catch {
      // Safe fallback
    }

    return null;
  };

  // Bottleneck & Fraud Handlers
  const resolveBottleneck = (id) => {
    setBottlenecks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, resolved: true, currentMins: b.expectedMins } : b,
      ),
    );
    addNotification({
      title: "Bottleneck Resolved",
      message: "Operational intervention applied. Processing time normalized.",
      type: "success",
    });
  };

  const resolveFraudAlert = (id, resolution) => {
    setFraudAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: resolution } : a)),
    );
    addNotification({
      title: "Anomaly Reviewed",
      message: `Alert #${id} marked as ${resolution}.`,
      type: "info",
    });
  };

  // Tamper Simulators
  const simulateTamper = () => {
    if (auditChain.length < 2) return;
    setAuditChain((prev) => {
      const copy = [...prev];
      copy[1] = {
        ...copy[1],
        currentHash:
          "0xDEADBEEF000000000000000000000000000000000000000000000000DEADBEEF",
        isTampered: true,
      };
      return copy;
    });
    addNotification({
      title: "Tamper Simulation Activated",
      message: "Block #2 modified. Ledger integrity test will fail.",
      type: "warning",
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
        const validH = await generateSHA256(
          prevH + b.bookingId + b.stage + b.dataSummary,
        );
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
      title: "Consensus Repaired",
      message: "SHA-256 chain re-verified and valid.",
      type: "success",
    });
  };

  // USP 1: Dynamic Active Queue & Position Metrics Engine
  const calculateQueueMetrics = (targetBooking) => {
    if (
      !targetBooking ||
      targetBooking.stage === "COMPLETED" ||
      targetBooking.status === "COMPLETED"
    ) {
      return { position: 0, farmersAhead: 0, waitMins: 0, activeQueueCount: 0 };
    }

    const targetCentreId = targetBooking.centreId;
    const targetCentreCode = targetBooking.centreCode;

    // Filter active bookings for same procurement centre where stage !== "COMPLETED"
    const eligibleActive = bookings.filter((b) => {
      const isSameCentre =
        (targetCentreId && b.centreId === targetCentreId) ||
        (targetCentreCode && b.centreCode === targetCentreCode);
      const isActive = b.stage !== "COMPLETED" && b.status !== "COMPLETED";
      return isSameCentre && isActive;
    });

    // Chronological order by token sequence / creation
    const sorted = [...eligibleActive].sort(
      (a, b) => (a.tokenSeq || 0) - (b.tokenSeq || 0),
    );

    const targetIdx = sorted.findIndex(
      (b) =>
        b.id === targetBooking.id || b.booking_id === targetBooking.booking_id,
    );

    const position = targetIdx >= 0 ? targetIdx + 1 : 1;
    const farmersAhead = Math.max(0, position - 1);
    const waitMins = Math.max(4, Math.round(farmersAhead * 2));

    return {
      position,
      farmersAhead,
      waitMins,
      activeQueueCount: sorted.length,
    };
  };

  // Active Metrics Calculations
  const activeBooking =
    bookings.find(
      (b) => b.id === activeBookingId || b.booking_id === activeBookingId,
    ) ||
    bookings[0] ||
    null;
  const peopleAhead = activeBooking
    ? Math.max(0, activeBooking.tokenSeq - servingToken)
    : 0;
  const estimatedWaitMins = Math.max(4, Math.round(peopleAhead * 1.8));

  // Dynamic Congestion Intelligence derived from real centre intake
  const activeIntakeCount = bookings.filter(
    (b) => b.stage !== "COMPLETED" && b.status !== "COMPLETED",
  ).length;
  const congestionRisk =
    activeIntakeCount >= 15 ? "HIGH" : activeIntakeCount >= 8 ? "MEDIUM" : "LOW";

  const xaiFactors = [
    {
      factor: "Queue Length Surge",
      impact: "+35%",
      positive: false,
      desc: `${activeIntakeCount} active bookings currently in Mandi intake lane`,
    },
    {
      factor: "Average Crop Load (45 Qtl)",
      impact: "+20%",
      positive: false,
      desc: "Heavy grain bulk unloading required",
    },
    {
      factor: "Weighbridge Counter Efficiency",
      impact: "-25%",
      positive: true,
      desc: "4/4 Weighbridges operating with digital sensor",
    },
    {
      factor: "Moisture Testing Latency",
      impact: "+15%",
      positive: false,
      desc: "Moisture lab averaging 4.2 mins per test",
    },
    {
      factor: "Staggered Arrival Adherence",
      impact: "-18%",
      positive: true,
      desc: "82% farmers arriving in allocated slot window",
    },
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
        initialWorkflowStep,
        setInitialWorkflowStep,

        // Auth & 3 Roles
        user,
        farmerProfile,
        setFarmerProfile,
        farmersList,
        registerFarmer,
        loginUser,
        logoutUser,
        updateFarmerProfile,

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

        // Bookings & Offline Network State
        bookings,
        activeBookingId,
        setActiveBookingId,
        activeBooking,
        bookSlot,
        advanceBookingStage,
        verifyGateArrival,
        verifyFaceArrival,
        isDemoMode,
        isOffline,
        syncPendingOfflineBookings,

        // Worker & Officer Operations
        workerAssignedStage,
        setWorkerAssignedStage,
        approveStage,
        rejectStage,
        approveFinalPayment,
        searchFarmerById,

        // Feedback
        feedbackList,
        submitAnonymousFeedback,

        // Queue Engine
        servingToken,
        setServingToken,
        autoQueueTicker,
        setAutoQueueTicker,
        peopleAhead,
        estimatedWaitMins,
        calculateQueueMetrics,

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
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
