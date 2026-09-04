import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sparkles, AlertCircle, Award, CheckCircle2, ChevronRight, Inbox } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function NotificationsPopup({ isOpen, onClose, onClearAll }) {
  const { notifications, setSelectedNotification } = useApp();

  if (!isOpen) return null;

  const handleNotificationClick = (item) => {
    setSelectedNotification(item);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Civic Notifications
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {notifications.length}
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-indigo-500 hover:text-indigo-400 font-medium cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Inbox className="w-8 h-8 opacity-40" />
                <span>No new notifications</span>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group ${
                    item.unread ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="p-2 rounded-xl shrink-0 bg-indigo-500/10 text-indigo-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-500 transition-colors">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {item.time || "Now"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {item.message}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 text-center bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">Click any notification to inspect details</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
