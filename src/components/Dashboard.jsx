import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  UploadCloud,
  FileText,
  Clock,
  MessageSquare,
  User,
  Settings as SettingsIcon,
  LogOut,
  MapPin,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Hourglass,
  Users,
  Check,
  Building,
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  Send,
} from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import UploadModal from "./Modals/UploadModal";
import NotificationsPopup from "./Modals/NotificationsPopup";
import NotificationDetailModal from "./Modals/NotificationDetailModal";
import ExploreView from "./Pages/ExploreView";
import MyUpdatesView from "./Pages/MyUpdatesView";
import HistoryView from "./Pages/HistoryView";
import MessagesView from "./Pages/MessagesView";
import ProfileView from "./Pages/ProfileView";
import SettingsView from "./Pages/SettingsView";
import { useApp } from "../context/AppContext";
import { useToast } from "./ToastContext";

export default function Dashboard({
  role = "Citizen",
  onRoleChange,
  onLogout,
  theme = "light",
  onToggleTheme,
}) {
  const {
    problems,
    history,
    updates,
    notifications,
    chatThreads,
    selectedNotification,
    setSelectedNotification,
  } = useApp();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("Jharkhand");
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Total unread/active messages count across all threads
  const totalChatCount = chatThreads.reduce((acc, t) => acc + (t.messages ? t.messages.length : 0), 0);

  // Real Dynamic Measured Statistics
  const reportedCount = problems.filter((p) => p.status === "Reported").length;
  const inProgressCount = problems.filter((p) => p.status === "In Progress").length;
  const completedCount = problems.filter((p) => p.status === "Completed").length;
  const totalMeasured = reportedCount + inProgressCount + completedCount;

  const peopleImpactedEstimate =
    problems.reduce((acc, p) => {
      if (p.peopleImpacted === "10,000+") return acc + 10000;
      if (p.peopleImpacted === "2,500+") return acc + 2500;
      if (p.peopleImpacted === "500+") return acc + 500;
      return acc + 100;
    }, 0) + (history ? history.length * 1200 : 0);

  const formattedImpact =
    peopleImpactedEstimate >= 1000
      ? `${(peopleImpactedEstimate / 1000).toFixed(1)}K+`
      : `${peopleImpactedEstimate}`;

  const districts = [
    "Jharkhand (All)",
    "Ranchi",
    "Dhanbad",
    "Jamshedpur",
    "Bokaro",
    "Hazaribagh",
    "Deoghar",
    "Giridih",
    "Khunti",
  ];

  // Sidebar navigation links: "Settings" replaces "Help & Support"
  const sidebarLinks = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Explore Problems", icon: Search },
    { name: "Upload Problem", icon: UploadCloud, action: () => setIsUploadOpen(true) },
    { name: "My Updates", icon: FileText },
    { name: "History", icon: Clock },
    { name: "Messages", icon: MessageSquare, badge: totalChatCount },
    { name: "Profile", icon: User },
    { name: "Settings", icon: SettingsIcon },
  ];

  // Dynamic Donut Chart calculations
  const circumference = 238.7;
  const reportedRatio = totalMeasured > 0 ? reportedCount / totalMeasured : 0;
  const inProgressRatio = totalMeasured > 0 ? inProgressCount / totalMeasured : 0;
  const completedRatio = totalMeasured > 0 ? completedCount / totalMeasured : 0;

  const reportedStroke = reportedRatio * circumference;
  const inProgressStroke = inProgressRatio * circumference;
  const completedStroke = completedRatio * circumference;

  return (
    <div
      className={`min-h-screen w-full flex flex-col md:flex-row transition-colors duration-500 ${
        theme === "dark" ? "bg-[#090d16] text-slate-100" : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      {/* 1. Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:flex w-64 shrink-0 flex-col justify-between p-5 border-r transition-colors ${
          theme === "dark" ? "bg-[#0f1422] border-slate-800/80" : "bg-white border-slate-200/80"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Samadhan<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Setu</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.name);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Logout */}
        <div className="mt-6 space-y-3">
          <div
            className={`relative overflow-hidden p-3.5 rounded-2xl border transition-colors ${
              theme === "dark"
                ? "bg-gradient-to-br from-purple-950/70 via-indigo-950 to-slate-900 text-white border-purple-500/20 shadow-lg"
                : "bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/80 text-slate-800 border-indigo-100/90 shadow-sm"
            }`}
          >
            <h4
              className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${
                theme === "dark" ? "text-purple-200" : "text-indigo-700 font-extrabold"
              }`}
            >
              Be the change
            </h4>
            <p
              className={`text-[10px] leading-tight ${
                theme === "dark" ? "text-purple-300/90" : "text-slate-600 font-medium"
              }`}
            >
              You wish to see in Jharkhand.
            </p>
          </div>

          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={onLogout}
            popupText="👋 Logged out"
            className="w-full justify-start text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 !px-3"
            icon={LogOut}
          >
            Logout
          </AnimatedButton>
        </div>
      </aside>

      {/* Mobile Drawer Navigation (Slide-out menu for mobile devices) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-72 h-full bg-white dark:bg-[#0f1422] p-5 flex flex-col justify-between shadow-2xl z-10"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold text-base">SamadhanSetu</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {sidebarLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (item.action) {
                            item.action();
                          } else {
                            setActiveTab(item.name);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-full text-rose-500"
                  icon={LogOut}
                >
                  Logout
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header
          className={`px-4 sm:px-6 py-3.5 flex items-center justify-between border-b transition-colors ${
            theme === "dark" ? "bg-[#0f1422]/90 border-slate-800" : "bg-white/90 border-slate-200"
          } backdrop-blur-md sticky top-0 z-30`}
        >
          {/* Mobile Hamburger Button + District Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="truncate max-w-[100px] sm:max-w-none">{selectedDistrict}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {isDistrictDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-50 text-xs"
                  >
                    {districts.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setSelectedDistrict(d);
                          setIsDistrictDropdownOpen(false);
                          addToast({
                            title: "Region Filtered",
                            message: `Displaying grid for ${d}`,
                            type: "info",
                          });
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between"
                      >
                        <span>{d}</span>
                        {selectedDistrict === d && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              <NotificationsPopup
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                onClearAll={() => {
                  setIsNotifOpen(false);
                  addToast({ title: "Cleared", message: "Notifications cleared.", type: "success" });
                }}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Role Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                  {role[0]}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
                  {role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {isRoleMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Mode
                    </div>
                    {["Citizen", "University", "Industry"].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          onRoleChange(r);
                          setIsRoleMenuOpen(false);
                          addToast({
                            title: `Role Switched to ${r}`,
                            message: `Perspective updated.`,
                            type: "sparkle",
                          });
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between ${
                          role === r ? "font-bold text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <span>{r}</span>
                        {role === r && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Router based on activeTab */}
        <main className="p-4 sm:p-6 md:p-8 flex-1">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* Personalized Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>Hello, {role}! 👋</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Together we can build a better Jharkhand
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <AnimatedButton
                    size="sm"
                    variant={role === "Citizen" ? "emerald" : "violet"}
                    onClick={() => setIsUploadOpen(true)}
                    popupText="📝 Register"
                    icon={UploadCloud}
                  >
                    {role === "University" ? "Upload Update" : "Upload Problem"}
                  </AnimatedButton>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  whileHover={{ y: -3 }}
                  className={`p-6 rounded-3xl relative overflow-hidden transition-all shadow-md flex items-center justify-between gap-4 ${
                    theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100 shadow-slate-200/50"
                  }`}
                >
                  <div className="space-y-2.5 max-w-[280px]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Explore Problems
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Find problems in your area with Google Map coordinates and support local resolutions.
                    </p>
                    <AnimatedButton
                      size="sm"
                      variant="violet"
                      onClick={() => setActiveTab("Explore Problems")}
                      popupText="🔍 Opening Explore..."
                    >
                      Explore Now →
                    </AnimatedButton>
                  </div>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Search className="w-8 h-8 text-indigo-500" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className={`p-6 rounded-3xl relative overflow-hidden transition-all shadow-md flex items-center justify-between gap-4 ${
                    theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100 shadow-slate-200/50"
                  }`}
                >
                  <div className="space-y-2.5 max-w-[280px]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {role === "University" ? "Upload Update" : "Upload Problem"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Drop pin on Google Map, select category (including Other) and measure civic progress.
                    </p>
                    <AnimatedButton
                      size="sm"
                      variant={role === "Citizen" ? "emerald" : "violet"}
                      onClick={() => setIsUploadOpen(true)}
                      popupText="📍 Map Pinning..."
                    >
                      Upload Now →
                    </AnimatedButton>
                  </div>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <UploadCloud className="w-8 h-8 text-emerald-500" />
                  </div>
                </motion.div>
              </div>

              {/* Real Measured Statistics Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Live Measured Civic Statistics
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 ${
                      theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {reportedCount}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Problems Reported
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 ${
                      theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <Hourglass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {inProgressCount}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        In Progress
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 ${
                      theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {completedCount + (history ? history.length : 0)}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Completed
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 ${
                      theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {formattedImpact}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        People Impacted
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* 1. Live Activity Feed */}
                <div
                  className={`p-5 rounded-3xl shadow-sm ${
                    theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Recent Activity
                    </h4>
                    <button
                      onClick={() => setActiveTab("Explore Problems")}
                      className="text-xs font-semibold text-indigo-500 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {problems.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No problems uploaded yet. Register an issue to populate this activity stream.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {problems.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedNotification({
                              title: p.title,
                              message: `Location: ${p.address || p.district} • Status: ${p.status}`,
                              time: p.createdAt,
                              problemData: p,
                            });
                          }}
                          className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                        >
                          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                            <UploadCloud className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {p.title}
                            </p>
                            <div className="text-[10px] text-slate-400">
                              {p.district} • {p.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Measured Donut Chart */}
                <div
                  className={`p-5 rounded-3xl shadow-sm flex flex-col justify-between ${
                    theme === "dark" ? "bg-[#111726]/90 border border-slate-800" : "bg-white border border-slate-100"
                  }`}
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Measured Problem Status
                  </h4>

                  <div className="flex items-center justify-center my-3 relative">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="currentColor"
                        strokeWidth="11"
                        className="text-slate-100 dark:text-slate-800/80 fill-none"
                      />
                      {totalMeasured > 0 ? (
                        <>
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            stroke="#3b82f6"
                            strokeWidth="11"
                            strokeDasharray={`${reportedStroke} ${circumference}`}
                            strokeDashoffset="0"
                            className="fill-none transition-all duration-500"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            stroke="#14b8a6"
                            strokeWidth="11"
                            strokeDasharray={`${inProgressStroke} ${circumference}`}
                            strokeDashoffset={`-${reportedStroke}`}
                            className="fill-none transition-all duration-500"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            stroke="#10b981"
                            strokeWidth="11"
                            strokeDasharray={`${completedStroke} ${circumference}`}
                            strokeDashoffset={`-${reportedStroke + inProgressStroke}`}
                            className="fill-none transition-all duration-500"
                          />
                        </>
                      ) : null}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {totalMeasured}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Measured
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-blue-500 font-bold">Reported</div>
                      <div className="font-extrabold">{reportedCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-teal-500 font-bold">In Progress</div>
                      <div className="font-extrabold">{inProgressCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-500 font-bold">Completed</div>
                      <div className="font-extrabold">{completedCount}</div>
                    </div>
                  </div>
                </div>

                {/* 3. Impact Wave Curve */}
                <div
                  className={`p-5 rounded-3xl shadow-sm flex flex-col justify-between transition-colors ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-[#111726] to-indigo-950/40 border border-slate-800 text-white"
                      : "bg-white border border-slate-200/80 text-slate-800 shadow-sm"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Live Impact Metric</h4>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {formattedImpact}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Measured civic beneficiaries</div>
                  </div>

                  <div className="my-3 h-20 relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80">
                      <defs>
                        <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={theme === "dark" ? "0.5" : "0.2"} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 65 Q 30 30 65 50 T 130 35 T 200 20 L 200 80 L 0 80 Z" fill="url(#waveGrad2)" />
                      <path d="M 0 65 Q 30 30 65 50 T 130 35 T 200 20" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                      <circle cx="65" cy="50" r="3.5" fill="#8b5cf6" stroke={theme === "dark" ? "#fff" : "#4f46e5"} strokeWidth="2" />
                      <circle cx="130" cy="35" r="3.5" fill="#6366f1" stroke={theme === "dark" ? "#fff" : "#4f46e5"} strokeWidth="2" />
                      <circle cx="200" cy="20" r="4.5" fill="#f43f5e" stroke={theme === "dark" ? "#fff" : "#e11d48"} strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="text-[10px] text-slate-400 flex justify-between border-t border-slate-100 dark:border-white/10 pt-2">
                    <span>Initial</span>
                    <span>Midway</span>
                    <span>Current</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLORE PROBLEMS */}
          {activeTab === "Explore Problems" && (
            <ExploreView
              onOpenUpload={() => setIsUploadOpen(true)}
              role={role}
              onNavigateMessages={() => setActiveTab("Messages")}
            />
          )}

          {/* TAB 3: MY UPDATES */}
          {activeTab === "My Updates" && (
            <MyUpdatesView onOpenUpload={() => setIsUploadOpen(true)} role={role} />
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === "History" && <HistoryView />}

          {/* TAB 5: MESSAGES */}
          {activeTab === "Messages" && (
            <MessagesView
              currentRole={role}
              onNavigateExplore={() => setActiveTab("Explore Problems")}
            />
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === "Profile" && <ProfileView initialRole={role} />}

          {/* TAB 7: SETTINGS (Replaces Help & Support) */}
          {activeTab === "Settings" && (
            <SettingsView theme={theme} onToggleTheme={onToggleTheme} />
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        role={role}
      />

      {/* Notification Inspector Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onNavigateExplore={() => {
          setSelectedNotification(null);
          setActiveTab("Explore Problems");
        }}
      />
    </div>
  );
}
