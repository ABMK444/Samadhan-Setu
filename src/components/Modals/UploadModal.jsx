import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, MapPin, AlertTriangle, CheckCircle2, Image as ImageIcon, Map } from "lucide-react";
import AnimatedButton from "../AnimatedButton";
import MapLocationPicker from "../MapLocationPicker";
import { useToast } from "../ToastContext";
import { useApp } from "../../context/AppContext";

export default function UploadModal({ isOpen, onClose, role = "Citizen" }) {
  const { addToast } = useToast();
  const { addProblem } = useApp();

  const [formData, setFormData] = useState({
    title: "",
    category: "Infrastructure",
    otherCategoryText: "",
    district: "Ranchi",
    address: "Kanke Road, Ranchi",
    lat: 23.4021,
    lng: 85.3214,
    priority: "Medium",
    description: "",
    peopleAffected: "500+",
  });

  const [showMapPicker, setShowMapPicker] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast({
        title: "Missing Title",
        message: "Please provide a clear title for the problem.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    const finalCategory =
      formData.category === "Other" && formData.otherCategoryText.trim()
        ? `Other (${formData.otherCategoryText.trim()})`
        : formData.category;

    setTimeout(() => {
      const created = addProblem({
        title: formData.title,
        category: finalCategory,
        district: formData.district,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
        priority: formData.priority,
        description: formData.description || "Field problem reported for university/industry intervention.",
        peopleImpacted: formData.peopleAffected,
        photoAttached: !!fileSelected,
        reportedByRole: role,
      });

      setIsSubmitting(false);
      addToast({
        title: "Problem Registered on Civic Grid! 🚀",
        message: `"${formData.title}" is now visible in Explore Problems & measured in statistics.`,
        type: "success",
      });

      // Reset form
      setFormData({
        title: "",
        category: "Infrastructure",
        otherCategoryText: "",
        district: "Ranchi",
        address: "Kanke Road, Ranchi",
        lat: 23.4021,
        lng: 85.3214,
        priority: "Medium",
        description: "",
        peopleAffected: "500+",
      });
      setFileSelected(null);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 text-slate-800 dark:text-slate-100 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  {role === "University" ? "Upload Research Update" : "Register Problem on Grid"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select location via Google Maps and log problem for live measurement
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Broken transformer causing water pump shutdown"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Category selection (Including Other) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Infrastructure">Roads & Infrastructure</option>
                  <option value="Water">Water & Sanitation</option>
                  <option value="Electricity">Electricity & Energy</option>
                  <option value="Healthcare">Public Health & Sanitation</option>
                  <option value="Education">Education & School Labs</option>
                  <option value="Agriculture">Agriculture & Irrigation</option>
                  <option value="Other">Other (Custom Problem)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Estimated People Affected
                </label>
                <select
                  value={formData.peopleAffected}
                  onChange={(e) => setFormData({ ...formData, peopleAffected: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="100+">Under 250 Citizens</option>
                  <option value="500+">250 - 1,000 Citizens</option>
                  <option value="2,500+">1,000 - 5,000 Citizens</option>
                  <option value="10,000+">Entire Panchayat / Ward (5,000+)</option>
                </select>
              </div>
            </div>

            {/* If Category is Other: Show custom category input */}
            {formData.category === "Other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20"
              >
                <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                  Specify Custom Problem Category *
                </label>
                <input
                  type="text"
                  value={formData.otherCategoryText}
                  onChange={(e) => setFormData({ ...formData, otherCategoryText: e.target.value })}
                  placeholder="e.g. Tribal artisan handicraft supply chain disruption"
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </motion.div>
            )}

            {/* Google Maps Location Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Google Maps Location & GPS Pin *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(!showMapPicker)}
                  className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 underline flex items-center gap-1 cursor-pointer"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>{showMapPicker ? "Hide Map" : "Open Google Map"}</span>
                </button>
              </div>

              {/* Map Location Picker Embed */}
              <MapLocationPicker
                selectedLocation={{
                  address: formData.address,
                  lat: formData.lat,
                  lng: formData.lng,
                  district: formData.district,
                }}
                onSelectLocation={(loc) => {
                  setFormData((prev) => ({
                    ...prev,
                    address: loc.address,
                    lat: loc.lat,
                    lng: loc.lng,
                    district: loc.district,
                  }));
                }}
                compact={!showMapPicker}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Description & Needed Action
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Give details about ground challenges and what kind of technical or CSR help is needed..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Attach Site Photo (Optional)
              </label>
              <div
                onClick={() => setFileSelected(fileSelected ? null : "ground-site-inspection.jpg")}
                className={`border-2 border-dashed rounded-2xl p-3.5 text-center cursor-pointer transition-colors ${
                  fileSelected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500"
                }`}
              >
                {fileSelected ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Attached: {fileSelected}</span>
                    <span className="text-slate-400 underline ml-1">(click to remove)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span>Click to attach photo proof (GPS tagged)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <AnimatedButton variant="outline" onClick={onClose} showPopup={false}>
                Cancel
              </AnimatedButton>
              <AnimatedButton
                type="submit"
                variant="emerald"
                disabled={isSubmitting}
                triggerConfetti={true}
                popupText="🎉 Registered!"
              >
                {isSubmitting ? "Registering..." : "Publish Problem"}
              </AnimatedButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
