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
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col"
        >
          {/* Header */}
          <div className="p-5 bg-[#1B4318] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#F9A825]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Live Procurement Alerts</h3>
                <p className="text-xs text-[#A5D6A7]">
                  Real-time Mandi & Slot Updates
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-5 py-2.5 bg-[#FAF8F2] border-b border-[#E8E4D9] flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700">
              {notifications.filter((n) => !n.read).length} Unread Notifications
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F2]/40">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Bell className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      notif.read
                        ? "bg-white/80 border-gray-200"
                        : "bg-white border-[#A5D6A7] shadow-sm ring-1 ring-[#2E7D32]/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          notif.type === "success"
                            ? "bg-green-100 text-green-700"
                            : notif.type === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : notif.type === "recommendation"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {notif.type === "success" && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {notif.type === "warning" && (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        {notif.type === "recommendation" && (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {notif.type === "info" && <Info className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
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
          <div className="p-4 bg-white border-t border-gray-100 text-center">
            <p className="text-[11px] font-semibold text-gray-500">
              Procure Intelligence • Multi-channel SMS & WhatsApp Webhooks
              Active
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
