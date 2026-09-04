import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function NotificationDrawer() {
  const {
    notifications,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    markAllNotificationsRead,
  } = useApp();

  if (!notificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-[#050805]/80 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-[#071008] text-[#E8E7DE] border-l border-[#1A2E1E] shadow-2xl flex flex-col font-mono"
        >
          {/* Header */}
          <div className="p-5 bg-[#0A180D] border-b border-[#1A2E1E] flex items-center justify-between text-[#F2F0E8]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-normal text-[#F2F0E8] tracking-wide">
                  Live Procurement Telemetry
                </h3>
                <p className="text-[11px] font-mono text-[#A6ADA3]">
                  Real-time Mandi & Queue Stream
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationDrawerOpen(false)}
              className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-5 py-2.5 bg-[#050805] border-b border-[#1A2E1E] flex items-center justify-between text-xs font-mono">
            <span className="text-[#A6ADA3]">
              {notifications.filter((n) => !n.read).length} UNREAD ALERTS
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="text-[#79C267] hover:underline flex items-center gap-1 uppercase tracking-wider text-[10px]"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark read</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#071008]">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-[#A6ADA3]">
                <Bell className="w-8 h-8 mx-auto text-[#1A2E1E] mb-2" />
                <p className="text-xs font-mono">No alerts recorded</p>
              </div>
            ) : (
              notifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    className={`p-4 border transition-all ${
                      notif.read
                        ? "bg-[#050805] border-[#1A2E1E] text-[#A6ADA3]"
                        : "bg-[#0A180D] border-[#79C267]/40 text-[#F2F0E8]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 border flex items-center justify-center shrink-0 mt-0.5 ${
                          notif.type === "success"
                            ? "bg-[#164A29]/40 border-[#79C267]/40 text-[#79C267]"
                            : notif.type === "warning"
                              ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                              : notif.type === "recommendation"
                                ? "bg-[#164A29]/40 border-[#79C267]/40 text-[#79C267]"
                                : "bg-[#050805] border-[#1A2E1E] text-[#A6ADA3]"
                        }`}
                      >
                        {notif.type === "success" && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {notif.type === "warning" && (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        {notif.type === "recommendation" && (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {notif.type === "info" && <Info className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-mono font-bold text-[#F2F0E8] truncate">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] font-mono text-[#A6ADA3]">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#A6ADA3] mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 bg-[#0A180D] border-t border-[#1A2E1E] text-center font-mono">
            <p className="text-[11px] text-[#A6ADA3]">
              Procure Intelligence • Multi-channel Telemetry Active
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
