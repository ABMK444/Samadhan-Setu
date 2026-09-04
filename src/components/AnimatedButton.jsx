import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function AnimatedButton({
  children,
  onClick,
  className = "",
  variant = "primary", // primary, emerald, violet, amber, outline, ghost, glass, dark
  popupText = "✨ Clicked!",
  showPopup = true,
  triggerConfetti = false,
  disabled = false,
  icon: Icon,
  size = "md", // sm, md, lg
  ...props
}) {
  const [popups, setPopups] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;

    if (showPopup) {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      const randomOffsetX = (Math.random() - 0.5) * 40;
      
      setPopups((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left + randomOffsetX, y: -15, text: popupText },
      ]);

      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    }

    if (triggerConfetti) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.75 },
          colors: ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
        });
      } catch (err) {
        // confetti fallback
      }
    }

    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-xl gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold rounded-2xl gap-2",
    lg: "px-7 py-3.5 text-base font-bold rounded-2xl gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30",
    emerald:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30",
    violet:
      "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30",
    amber:
      "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 border border-amber-300/30",
    outline:
      "border-2 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm backdrop-blur-md",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-300",
    glass:
      "bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-white/30 dark:border-white/10 backdrop-blur-xl shadow-lg",
    dark:
      "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 shadow-lg shadow-black/30",
  };

  return (
    <div className="relative inline-block">
      <motion.button
        type="button"
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        transition={{ type: "spring", stiffness: 450, damping: 20 }}
        onClick={handleClick}
        className={`relative inline-flex items-center justify-center select-none cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 active:shadow-inner ${
          sizeClasses[size] || sizeClasses.md
        } ${variantClasses[variant] || variantClasses.primary} ${
          disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
        } ${className}`}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />}
        <span className="relative z-10 flex items-center gap-1.5">{children}</span>
        
        {/* Subtle glossy sheen line */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none" />
      </motion.button>

      {/* Interactive Micro-Popup Bubbles */}
      <AnimatePresence>
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0, scale: 0.5, x: "-50%" }}
            animate={{ opacity: 1, y: -38, scale: 1.05, x: "-50%" }}
            exit={{ opacity: 0, y: -58, scale: 0.7, x: "-50%" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: `${p.x}px` }}
            className="absolute top-0 pointer-events-none z-50 whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-bold shadow-xl border bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-white/40 backdrop-blur-md flex items-center gap-1"
          >
            <span>{p.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
