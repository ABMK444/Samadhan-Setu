import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Building,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  UserCheck,
  FileCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HistoryView() {
  const { history } = useApp();
  const [expandedId, setExpandedId] = useState(history[0]?.id || null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Civic Resolution History & Personnel Dossier</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
            {history.length} Completed Projects
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Permanent public archive of verified solutions. Details include executing Universities, Industries, and every student & worker with name, age, course, tasks, and update timestamps.
        </p>
      </div>

      {/* Empty State or History Records List */}
      {history.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0f1422] text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <Award className="w-8 h-8 opacity-80" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Completed Problems in History Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Permanent public archive of verified civic solutions. Once a problem reaches <strong className="text-emerald-600 dark:text-emerald-400">100% completion</strong>, its complete personnel dossier—including executing Universities, Industries, and participating students & workers with names, ages, courses, tasks, and update timestamps—will automatically be documented here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
        {history.map((record) => {
          const isExpanded = expandedId === record.id;
          return (
            <div
              key={record.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm overflow-hidden transition-all"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(record.id)}
                className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>100% Solved & Verified</span>
                    </span>

                    <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      {record.category}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {record.district}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {record.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {record.summary}
                  </p>
                </div>

                {/* Organization and Expand Button */}
                <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 justify-end">
                      {record.organizationType === "University" ? (
                        <GraduationCap className="w-4 h-4 text-purple-500" />
                      ) : (
                        <Building className="w-4 h-4 text-amber-500" />
                      )}
                      <span>{record.organizationName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Partner: {record.partnerIndustry || record.partnerUniversity || "State Gov"}
                    </div>
                    <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">
                      Impact: {record.peopleImpacted}+ Citizens
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Detailed Personnel Dossier (Students & Workers Details) */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-6">
                  {/* Personnel Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-500" />
                      <span>Participating Students & Field Workers Dossier</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {record.team.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {member.name}
                              </span>
                              <span className="text-xs text-slate-400 ml-2">
                                (Age: {member.age})
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                              {member.role}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            📚 Course / Qualification:{" "}
                            <span className="text-indigo-600 dark:text-indigo-400 font-normal">
                              {member.course}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            🔨 Work Executed:{" "}
                            <span className="text-slate-800 dark:text-slate-200 font-medium">
                              {member.work}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>Field Hours Logged: {member.hoursLogged} hrs</span>
                            <span className="text-emerald-500 font-semibold">✓ Verified Contribution</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones and Exact Timestamps */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>Complete Update Log & Handover Timestamps</span>
                    </h4>

                    <div className="space-y-2">
                      {record.timeline.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs"
                        >
                          <span className="font-mono text-[11px] text-indigo-500 font-bold shrink-0">
                            {step.time}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {step.note}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
