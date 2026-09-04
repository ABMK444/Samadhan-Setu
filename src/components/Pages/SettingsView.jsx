import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  BookOpen,
  RotateCcw,
  Sparkles,
  Smartphone,
  Monitor,
  Trash2,
  Check,
  RefreshCw,
  Sliders,
} from "lucide-react";
import AnimatedButton from "../AnimatedButton";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ToastContext";

export default function SettingsView({ theme, onToggleTheme }) {
  const { settings, setSettings, resetDemoData, addProblem } = useApp();
  const { addToast } = useToast();

  const handleToggleSound = () => {
    const updated = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: updated }));
    addToast({
      title: updated ? "Sound Effects Enabled 🔊" : "Sound Effects Muted 🔇",
      message: updated ? "Interactive audio flutter will play on transitions." : "Audio muted.",
      type: "info",
    });
  };

  const handleToggleBookAnim = () => {
    const updated = !settings.bookAnimation;
    setSettings((prev) => ({ ...prev, bookAnimation: updated }));
    addToast({
      title: updated ? "Apple Book 3D Animation Active 📖" : "Fast Transitions Active ⚡",
      message: updated ? "3D map/book unfolding is enabled." : "Direct view transitions enabled.",
      type: "sparkle",
    });
  };

  const handleSpeedChange = (speed) => {
    setSettings((prev) => ({ ...prev, animationSpeed: speed }));
    addToast({
      title: `Animation Speed: ${speed.toUpperCase()}`,
      message: `Set to ${speed} transition curve.`,
      type: "info",
    });
  };

  const handleResetData = () => {
    resetDemoData();
    addToast({
      title: "Demo State Reset! 🔄",
      message: "Problems cleared to zero initial state. All counters set to 0.",
      type: "warning",
    });
  };

  const handleSeedSample = () => {
    addProblem({
      title: "Solar Street Light Installation near Kanke Dam",
      category: "Electricity",
      district: "Ranchi",
      address: "Kanke Dam Road, Ward 4, Ranchi",
      lat: 23.4021,
      lng: 85.3214,
      priority: "Medium",
      description: "Sample test problem registered to verify Explore page and live statistics.",
      peopleAffected: "1,500+",
      reportedByRole: "Citizen",
    });
    addToast({
      title: "Sample Problem Seeded! 🌿",
      message: "Check Explore page or Dashboard overview to see updated statistics.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Platform Settings & Experience Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure appearance theme, Apple Book 3D animation parameters, audio feedback, and data reset options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Theme Appearance */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Display Theme
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose light or dark visual aesthetic
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => theme === "dark" && onToggleTheme()}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                theme === "light"
                  ? "border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/30"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sun className="w-5 h-5 text-amber-500" />
                {theme === "light" && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Light Mode</div>
              <div className="text-[11px] text-slate-500">Bright clean layout</div>
            </button>

            <button
              onClick={() => theme === "light" && onToggleTheme()}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-indigo-600 bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/30"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                {theme === "dark" && <Check className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Dark Mode</div>
              <div className="text-[11px] text-slate-400">Deep midnight UI</div>
            </button>
          </div>
        </div>

        {/* 2. Sound & Audio Haptics */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Audio & Sound Effects
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synthesized paper flutter and interactive button clicks
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Interactive Audio Feedback
              </div>
              <div className="text-[11px] text-slate-400">
                Web Audio API synthesized paper flutter upon unfold
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                settings.soundEnabled
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {settings.soundEnabled ? "Enabled" : "Muted"}
            </button>
          </div>
        </div>

        {/* 3. Apple Book 3D Animation Controls */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Apple Book 3D Unfold
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Control perspective unfolding animation and speed
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                3D Opening Unfold Animation
              </div>
              <button
                onClick={handleToggleBookAnim}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.bookAnimation
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {settings.bookAnimation ? "Active" : "Disabled"}
              </button>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Unfold Speed
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["smooth", "fast", "instant"].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer capitalize ${
                      settings.animationSpeed === spd
                        ? "border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Demo Data Controls */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Demo State Actions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reset live measurements or populate a test problem
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={handleSeedSample}
              popupText="🌱 Seeded!"
              className="w-full justify-start text-xs font-semibold"
              icon={Sparkles}
            >
              Seed 1 Sample Problem for Testing
            </AnimatedButton>

            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={handleResetData}
              popupText="🔄 Reset to 0"
              className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold border-rose-200 dark:border-rose-900/40"
              icon={Trash2}
            >
              Reset to 0 Initial Problems & Clear Stats
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
