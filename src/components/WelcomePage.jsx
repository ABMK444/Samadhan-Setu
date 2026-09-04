import React from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, Building2, Sun, Moon, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import AnimatedButton from "./AnimatedButton";

export default function WelcomePage({
  onSelectRole,
  onDirectDashboard,
  theme,
  onToggleTheme,
}) {
  const roles = [
    {
      id: "Citizen",
      title: "Citizen",
      desc: "Report issues in your area and make a difference.",
      icon: Users,
      iconBg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
      btnVariant: "emerald",
      badgeColor: "bg-emerald-500",
      accentGlow: "group-hover:shadow-emerald-500/20",
      cardBorder: "hover:border-emerald-400/50",
    },
    {
      id: "University",
      title: "University",
      desc: "Explore problems, build solutions and create impact.",
      icon: GraduationCap,
      iconBg: "bg-violet-500/10 text-violet-500 dark:bg-violet-500/20",
      btnVariant: "violet",
      badgeColor: "bg-purple-600",
      accentGlow: "group-hover:shadow-purple-500/20",
      cardBorder: "hover:border-purple-400/50",
    },
    {
      id: "Industry",
      title: "Industry",
      desc: "Collaborate, support and drive real change.",
      icon: Building2,
      iconBg: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
      btnVariant: "amber",
      badgeColor: "bg-amber-500",
      accentGlow: "group-hover:shadow-amber-500/20",
      cardBorder: "hover:border-amber-400/50",
    },
  ];

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#090d16] text-slate-100"
          : "bg-gradient-to-b from-slate-50 via-white to-sky-50/50 text-slate-800"
      }`}
    >
      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xl tracking-tight">
              <span>Samadhan</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                Setu
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wider font-medium">
              Connect • Collaborate • Create Impact
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm hover:scale-105 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
            title="Toggle Light / Dark mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Jharkhand Citizen & Innovation Platform</span>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2"
        >
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500">
            SamadhanSetu
          </span>
        </motion.h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium max-w-md mx-auto mb-10">
          Choose how you want to continue
        </p>

        {/* Three Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {roles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative flex flex-col items-center justify-between p-7 rounded-3xl transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-[#111726]/90 border border-slate-800/80 shadow-xl"
                    : "bg-white/95 border border-slate-100 shadow-xl shadow-slate-200/50"
                } ${item.cardBorder}`}
              >
                {/* Role Icon Circle */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110 ${item.iconBg}`}
                >
                  <Icon className="w-9 h-9" />
                </div>

                {/* Role Name */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                {/* Role Description */}
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 min-h-[40px]">
                  {item.desc}
                </p>

                {/* Animated Login / Register Button */}
                <div className="w-full">
                  <AnimatedButton
                    variant={item.btnVariant}
                    onClick={() => onSelectRole(item.id)}
                    className="w-full font-semibold py-3 text-sm shadow-md"
                    popupText={`🚀 Hello, ${item.title}!`}
                  >
                    Login / Register
                  </AnimatedButton>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick jump to dashboard preview link */}
        <div className="mt-8">
          <button
            onClick={() => onDirectDashboard("Citizen")}
            className="text-xs font-semibold text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Skip to Dashboard preview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* Bottom Scenic Landscape Illustration matching reference */}
      <footer className="w-full relative mt-10 overflow-hidden select-none">
        {/* Illustrated River and Bridge Canvas Simulation */}
        <div className="w-full h-32 relative flex items-end justify-center">
          {/* Layered bridge & mountains SVG */}
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60 Q 300 20 600 50 T 1200 40 L 1200 120 L 0 120 Z"
              fill={theme === "dark" ? "#0f172a" : "#d1fae5"}
              opacity={theme === "dark" ? "0.6" : "0.5"}
            />
            <path
              d="M0 80 Q 400 40 800 70 T 1200 65 L 1200 120 L 0 120 Z"
              fill={theme === "dark" ? "#1e293b" : "#99f6e4"}
              opacity={theme === "dark" ? "0.8" : "0.6"}
            />
            {/* Bridge arch silhouettes */}
            <path
              d="M 150 90 Q 200 75 250 90 M 250 90 Q 300 75 350 90 M 350 90 Q 400 75 450 90 M 450 90 Q 500 75 550 90 M 550 90 Q 600 75 650 90 M 650 90 Q 700 75 750 90 M 750 90 Q 800 75 850 90 M 850 90 Q 900 75 950 90 M 950 90 Q 1000 75 1050 90"
              stroke={theme === "dark" ? "#334155" : "#0d9488"}
              strokeWidth="3"
              fill="none"
            />
            <line
              x1="100"
              y1="90"
              x2="1100"
              y2="90"
              stroke={theme === "dark" ? "#475569" : "#0f766e"}
              strokeWidth="4"
            />
          </svg>

          {/* Tagline Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Together for a better Jharkhand</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}
