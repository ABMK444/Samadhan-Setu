import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, MapPin, Clock, Tag, ExternalLink, CheckCircle2, ArrowRight } from "lucide-react";
import AnimatedButton from "../AnimatedButton";

export default function NotificationDetailModal({ notification, onClose, onNavigateExplore }) {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-800 dark:text-slate-100 z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                  Notification Alert
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                  {notification.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Info */}
          <div className="py-5 space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {notification.message}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Triggered: {notification.time || "Just now"}</span>
              </div>
            </div>

            {notification.problemData && (
              <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2 text-xs">
                <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category: {notification.problemData.category}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    Location: {notification.problemData.address || notification.problemData.district}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 pt-1">
                  {notification.problemData.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <AnimatedButton variant="outline" size="sm" onClick={onClose} showPopup={false}>
              Dismiss
            </AnimatedButton>
            {onNavigateExplore && (
              <AnimatedButton
                variant="violet"
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigateExplore();
                }}
                popupText="Opening Explore..."
              >
                <span>View in Explore</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </AnimatedButton>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
