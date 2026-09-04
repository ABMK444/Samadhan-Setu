import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Hourglass,
  PlusCircle,
  TrendingUp,
  FileText,
  Calendar,
  User,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import AnimatedButton from "../AnimatedButton";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ToastContext";

export default function MyUpdatesView({ onOpenUpload, role = "Citizen" }) {
  const { problems, updateProblemProgress, markProblemCompleted } = useApp();
  const { addToast } = useToast();

  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [newProgress, setNewProgress] = useState(50);
  const [updateNote, setUpdateNote] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const activeProblems = problems.filter((p) => p.status !== "Completed");
  const completedProblems = problems.filter((p) => p.status === "Completed");

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!selectedProblemId) return;

    updateProblemProgress(
      selectedProblemId,
      Number(newProgress),
      updateNote.trim() || `Progress logged at ${newProgress}%`,
      `${role} Assigned Team`
    );

    if (Number(newProgress) >= 100) {
      markProblemCompleted(selectedProblemId, {
        orgType: role === "University" ? "University" : "Industry",
        orgName: role === "University" ? "BIT Mesra & Affiliated Colleges" : "Tata Steel & Partner Industries",
        peopleImpacted: 850,
        summary: updateNote || "Completed in full accordance with local civic guidelines.",
      });
      addToast({
        title: "100% Completed & Archived to History! 🎉",
        message: "Work verified and logged into permanent history records.",
        type: "success",
      });
    } else {
      addToast({
        title: "Milestone Updated! ⏱️",
        message: `Work progress is now recorded at ${newProgress}%.`,
        type: "info",
      });
    }

    setIsUpdateModalOpen(false);
    setUpdateNote("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>My Work Updates & Progress Tracker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time progress percentages and exact timestamps of civic work completed.
          </p>
        </div>

        {problems.length > 0 && (
          <AnimatedButton
            variant="violet"
            size="sm"
            onClick={() => {
              setSelectedProblemId(problems[0].id);
              setIsUpdateModalOpen(true);
            }}
            popupText="📝 Log Milestone"
            icon={PlusCircle}
          >
            Log New Milestone
          </AnimatedButton>
        )}
      </div>

      {/* Progress Cards */}
      {problems.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f1422]/50 text-center flex flex-col items-center space-y-4">
          <Clock className="w-12 h-12 text-slate-400 opacity-60" />
          <div className="max-w-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Active Work Streams Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Once problems are registered on the grid, you can log milestone updates here showing completion percentage and timestamp.
            </p>
          </div>
          <AnimatedButton variant="emerald" onClick={onOpenUpload} popupText="🚀 Report Now">
            Upload a Problem First
          </AnimatedButton>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((prob) => (
            <div
              key={prob.id}
              className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm space-y-4"
            >
              {/* Problem Title & Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        prob.status === "Completed"
                          ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                          : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                      }`}
                    >
                      {prob.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {prob.district}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {prob.title}
                  </h3>
                </div>

                {/* Progress Pill */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-emerald-500">
                      {prob.progress || 0}%
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Completed
                    </div>
                  </div>

                  {prob.status !== "Completed" && (
                    <AnimatedButton
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProblemId(prob.id);
                        setNewProgress(Math.min(100, (prob.progress || 0) + 25));
                        setIsUpdateModalOpen(true);
                      }}
                      popupText="📈 Update %"
                    >
                      Log Update
                    </AnimatedButton>
                  )}
                </div>
              </div>

              {/* Graphical Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prob.progress || 0}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      prob.progress >= 100
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0% (Registered)</span>
                  <span>25% (Diagnosed)</span>
                  <span>50% (Work in Progress)</span>
                  <span>75% (Field Verified)</span>
                  <span>100% (Completed)</span>
                </div>
              </div>

              {/* Chronological Milestone Timeline with Timestamps */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Update Milestones & Exact Timestamps</span>
                </h4>

                <div className="space-y-2.5">
                  {(prob.updatesList || []).map((u, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {u.percentage}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {u.text}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>Logged: {u.timestamp}</span>
                          {u.author && <span>• Author: {u.author}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to Log Progress Milestone */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 text-slate-800 dark:text-slate-100"
            >
              <h3 className="text-lg font-bold mb-1">Log Milestone Progress</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Enter current work percentage and description of tasks completed.
              </p>

              <form onSubmit={handleSaveProgress} className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Work Completed</span>
                    <span className="text-indigo-500">{newProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newProgress}
                    onChange={(e) => setNewProgress(e.target.value)}
                    className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    What work was completed?
                  </label>
                  <textarea
                    rows={3}
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    placeholder="e.g. Student survey team completed electrical circuit diagnostic and parts ordered."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUpdateModalOpen(false)}
                    showPopup={false}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    type="submit"
                    variant="violet"
                    size="sm"
                    popupText="✅ Progress Saved!"
                  >
                    Save Milestone
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
