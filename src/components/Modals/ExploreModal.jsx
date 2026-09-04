import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, ThumbsUp, MapPin, Tag, ExternalLink, Users, ArrowRight } from "lucide-react";
import AnimatedButton from "../AnimatedButton";
import { useToast } from "../ToastContext";

const SAMPLE_PROBLEMS = [
  {
    id: 1,
    title: "Solar Water Pump Failure in Khunti Village",
    category: "Water",
    district: "Khunti",
    status: "In Progress",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    votes: 38,
    solvedBy: "BIT Mesra Engineering Team",
    desc: "Over 400 households facing drinking water disruption due to invertor controller breakdown.",
  },
  {
    id: 2,
    title: "Pothole clusters along National Highway 33 (Ranchi bypass)",
    category: "Infrastructure",
    district: "Ranchi",
    status: "Reported",
    statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    votes: 72,
    solvedBy: "Awaiting University Partner",
    desc: "Severe road deterioration after monsoon rains causing frequent traffic bottlenecks and hazards.",
  },
  {
    id: 3,
    title: "Primary Health Centre Telemedicine Setup in Hazaribagh",
    category: "Healthcare",
    district: "Hazaribagh",
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    votes: 94,
    solvedBy: "IIT (ISM) Dhanbad & Tata Steel CSR",
    desc: "Installed IoT health diagnostic kiosk serving 12 remote tribal panchayats.",
  },
  {
    id: 4,
    title: "Organic Fertilizer distribution and soil testing for paddy farmers",
    category: "Agriculture",
    district: "Bokaro",
    status: "In Progress",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    votes: 45,
    solvedBy: "Birsa Agricultural University",
    desc: "Soil acidity management pilot underway to enhance yield by 22% this season.",
  },
];

export default function ExploreModal({ isOpen, onClose, role = "Citizen" }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [problems, setProblems] = useState(SAMPLE_PROBLEMS);

  if (!isOpen) return null;

  const categories = ["All", "Water", "Infrastructure", "Healthcare", "Agriculture"];

  const filtered = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleVote = (id) => {
    setProblems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
    addToast({
      title: "Upvoted! 👍",
      message: "Your endorsement helps prioritize this issue with government stakeholders.",
      type: "sparkle",
    });
  };

  const handleAdopt = (item) => {
    addToast({
      title: "Problem Added to Portfolio! 🎓",
      message: `Your institution is now collaborating on "${item.title}".`,
      type: "success",
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Top Bar */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>Explore Jharkhand Problems</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                  {filtered.length} issues
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Discover reported challenges and join hands with universities & industry to solve them.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-4 sm:px-6 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by issue or district..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCat === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Cards List */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-indigo-400/40 dark:hover:border-indigo-500/40 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {item.district}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-indigo-500 font-medium">{item.category}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Lead: {item.solvedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <AnimatedButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(item.id)}
                    popupText="+1 Upvoted!"
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{item.votes}</span>
                  </AnimatedButton>

                  {role === "University" ? (
                    <AnimatedButton
                      size="sm"
                      variant="violet"
                      onClick={() => handleAdopt(item)}
                      popupText="🎓 Adopted!"
                    >
                      Adopt Issue
                    </AnimatedButton>
                  ) : (
                    <AnimatedButton
                      size="sm"
                      variant="primary"
                      onClick={() => handleAdopt(item)}
                      popupText="✨ Joined!"
                    >
                      Details <ArrowRight className="w-3 h-3 ml-1" />
                    </AnimatedButton>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
