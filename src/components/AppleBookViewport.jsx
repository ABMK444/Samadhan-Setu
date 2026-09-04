import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Compass, RotateCcw, Volume2, VolumeX } from "lucide-react";
import AnimatedButton from "./AnimatedButton";

export default function AppleBookViewport({
  children,
  pageKey = "page",
  role = "Citizen",
  theme = "light",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger book opening animation on mount or when animationKey changes
  useEffect(() => {
    setIsOpen(false);
    const timer = setTimeout(() => {
      setIsOpen(true);
      playPageSound();
    }, 120);
    return () => clearTimeout(timer);
  }, [pageKey, animationKey]);

  // Audio flutter simulation using Web Audio API synthesis
  const playPageSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Gentle paper rustle / whoosh chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const handleReplay = () => {
    setAnimationKey((k) => k + 1);
  };

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-start book-viewport transition-colors duration-500 ${
        theme === "dark" ? "bg-[#090d16] text-white" : "bg-slate-100 text-slate-800"
      }`}
    >
      {/* Dynamic Background Glows matching selected Role */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-25 transition-colors duration-700 ${
            role === "Citizen"
              ? "bg-emerald-500"
              : role === "University"
              ? "bg-indigo-600"
              : "bg-amber-500"
          }`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-700 ${
            role === "Citizen"
              ? "bg-teal-400"
              : role === "University"
              ? "bg-purple-600"
              : "bg-orange-500"
          }`}
        />
      </div>

      {/* Floating Book Animation Quick Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className={`fixed top-3 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border shadow-xl text-xs ${
          theme === "dark"
            ? "bg-slate-900/90 text-white border-white/15 shadow-black/50"
            : "bg-white/95 text-slate-800 border-slate-200 shadow-slate-300/40"
        }`}
      >
        <span className="flex items-center gap-1 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Apple Book 3D View</span>
        </span>
        <div className="h-3 w-px bg-slate-300 dark:bg-white/20" />
        <button
          onClick={handleReplay}
          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Replay 3D Book Unfold Animation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay Unfold</span>
        </button>
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
          title={soundEnabled ? "Mute unfold sound" : "Enable unfold sound"}
        >
          {soundEnabled ? (
            <Volume2 className="w-3 h-3 text-emerald-500" />
          ) : (
            <VolumeX className="w-3 h-3 text-slate-400" />
          )}
        </button>
      </motion.div>

      {/* Main 3D Book / Map Stage */}
      <div className="relative w-full min-h-screen z-10 flex flex-col items-center justify-center p-0 sm:p-2 md:p-4">
        {/* The 3D Unfolding Leaf Shell */}
        <div className="relative w-full max-w-[1600px] min-h-[92vh] flex items-stretch justify-center">
          {/* Animated 3D Left Cover Fold */}
          <motion.div
            initial={{ rotateY: 0, opacity: 1 }}
            animate={isOpen ? { rotateY: -110, opacity: 0, pointerEvents: "none" } : { rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
            className={`absolute inset-y-0 left-0 w-1/2 rounded-l-3xl shadow-2xl book-leaf-left z-40 flex flex-col items-center justify-center border-r ${
              theme === "dark"
                ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white"
                : "bg-gradient-to-br from-slate-50 via-indigo-50 to-white border-indigo-200 text-slate-800"
            }`}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2 p-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 border border-white/20 text-white">
                <BookOpen className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold tracking-tight">SamadhanSetu</span>
              <span className="text-xs text-indigo-500 dark:text-indigo-300">Unfolding Apple Map Book...</span>
            </motion.div>
          </motion.div>

          {/* Animated 3D Right Cover Fold */}
          <motion.div
            initial={{ rotateY: 0, opacity: 1 }}
            animate={isOpen ? { rotateY: 110, opacity: 0, pointerEvents: "none" } : { rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
            className={`absolute inset-y-0 right-0 w-1/2 rounded-r-3xl shadow-2xl book-leaf-right z-40 flex flex-col items-center justify-center border-l ${
              theme === "dark"
                ? "bg-gradient-to-bl from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white"
                : "bg-gradient-to-bl from-slate-50 via-indigo-50 to-white border-indigo-200 text-slate-800"
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-indigo-500 dark:text-indigo-300 text-sm">
              <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
              <span>Connect • Collaborate • Create Impact</span>
            </div>
          </motion.div>


          {/* Dynamic Center Crease Shadow & Spine */}
          <motion.div
            initial={{ opacity: 0.8, scaleX: 1.5 }}
            animate={isOpen ? { opacity: 0.15, scaleX: 0.2 } : { opacity: 0.8, scaleX: 1.5 }}
            transition={{ duration: 1 }}
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-black/40 to-transparent pointer-events-none z-30"
          />

          {/* Unfolded Content Plane */}
          <motion.div
            key={pageKey + animationKey}
            initial={{
              scale: 0.94,
              rotateX: 8,
              opacity: 0,
              filter: "blur(4px)",
            }}
            animate={
              isOpen
                ? {
                    scale: 1,
                    rotateX: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                  }
                : {
                    scale: 0.94,
                    rotateX: 8,
                    opacity: 0,
                    filter: "blur(4px)",
                  }
            }
            transition={{
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            className="w-full h-full flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-200/20 dark:border-white/10 map-fold-sheet"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
