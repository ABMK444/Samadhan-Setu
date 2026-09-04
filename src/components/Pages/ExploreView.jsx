import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  ThumbsUp,
  Tag,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Inbox,
  CheckCircle2,
  Hourglass,
  Layers,
  Map,
} from "lucide-react";
import AnimatedButton from "../AnimatedButton";
import MapLocationPicker from "../MapLocationPicker";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ToastContext";

export default function ExploreView({ onOpenUpload, role = "Citizen", onNavigateMessages }) {
  const { problems, updateProblemProgress, startChatWithUploader } = useApp();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [showMapFilter, setShowMapFilter] = useState(false);

  const categories = [
    "All",
    "Infrastructure",
    "Water",
    "Electricity",
    "Healthcare",
    "Education",
    "Agriculture",
    "Other",
  ];

  const districts = [
    "All",
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Hazaribagh",
    "Deoghar",
    "Khunti",
  ];

  const filteredProblems = problems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Other"
        ? item.category.startsWith("Other")
        : item.category === selectedCategory);

    const matchesDistrict =
      selectedDistrict === "All" || item.district.includes(selectedDistrict);

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const handleUpvote = (id) => {
    addToast({
      title: "Upvoted on Grid! 👍",
      message: "Priority score increased for local municipal review.",
      type: "sparkle",
    });
  };

  const handleAdopt = (problem) => {
    updateProblemProgress(
      problem.id,
      25,
      `${role} initiated field diagnostic survey and allocated initial resources.`,
      `${role} Research Team`
    );
    addToast({
      title: "Problem Adopted! 🎓",
      message: `Work has started on "${problem.title}". Status changed to In Progress.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Explore Registered Problems</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/20">
              {problems.length} on Grid
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time civic challenges across Jharkhand. Filter by category, location or Google Map.
          </p>
        </div>

        <AnimatedButton
          variant="emerald"
          size="sm"
          onClick={onOpenUpload}
          popupText="📝 Register Problem"
          icon={UploadCloud}
        >
          Upload Problem
        </AnimatedButton>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problems by keywords, landmark or district..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Districts" : d}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowMapFilter(!showMapFilter)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showMapFilter
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{showMapFilter ? "Hide Map" : "Google Map Pin"}</span>
            </button>
          </div>
        </div>

        {/* Categories Bar (Includes "Other") */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Google Map Pin View Toggle */}
        {showMapFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2"
          >
            <MapLocationPicker
              compact={true}
              onSelectLocation={(loc) => {
                setSelectedDistrict(loc.district);
                setSearchTerm(loc.address);
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Problems Display List */}
      {problems.length === 0 ? (
        /* Zero Initial Problems Empty State */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f1422]/50 text-center flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
            <Inbox className="w-8 h-8 opacity-60" />
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Problems Registered Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              The civic grid starts with 0 registered problems. Use the button below to register a local issue with Google Maps pin, or submit an "Other" category challenge!
            </p>
          </div>
          <AnimatedButton
            variant="emerald"
            onClick={onOpenUpload}
            popupText="🚀 Let's Report!"
            icon={UploadCloud}
          >
            Register First Problem
          </AnimatedButton>
        </motion.div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          No problems match your current search and filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProblems.map((prob) => (
            <motion.div
              key={prob.id}
              layout
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      prob.status === "Completed"
                        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                        : prob.status === "In Progress"
                        ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                        : "text-blue-500 bg-blue-500/10 border-blue-500/20"
                    }`}
                  >
                    {prob.status}
                  </span>

                  <span className="text-[11px] font-medium text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                    {prob.category}
                  </span>

                  <span className="text-[10px] text-slate-400 ml-auto">
                    {prob.createdAt}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {prob.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {prob.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{prob.address || prob.district}</span>
                </div>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <span>Work Progress</span>
                    <span>{prob.progress || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${prob.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 flex-wrap gap-2">
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpvote(prob.id)}
                  popupText="+1 Upvoted!"
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Support ({prob.votes || 1})</span>
                </AnimatedButton>

                <div className="flex items-center gap-1.5 ml-auto">
                  <AnimatedButton
                    variant="glass"
                    size="sm"
                    onClick={() => {
                      startChatWithUploader(prob, role);
                      if (onNavigateMessages) onNavigateMessages();
                      addToast({
                        title: "Chat Opened! 💬",
                        message: `Connecting to ${prob.uploaderName || "Uploader"}...`,
                        type: "sparkle",
                      });
                    }}
                    popupText="💬 Chat"
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                  >
                    <span>Message Uploader</span>
                  </AnimatedButton>

                  {prob.status !== "Completed" && (
                    <AnimatedButton
                      variant={role === "University" ? "violet" : "primary"}
                      size="sm"
                      onClick={() => handleAdopt(prob)}
                      popupText="🎓 Working on it!"
                    >
                      {role === "University" ? "Adopt Issue" : "Start Solution"}
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
