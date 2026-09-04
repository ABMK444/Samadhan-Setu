import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Award,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
} from "lucide-react";
import AnimatedButton from "../AnimatedButton";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ToastContext";

export default function ProfileView({ initialRole = "Citizen" }) {
  const { userProfiles, setUserProfiles } = useApp();
  const { addToast } = useToast();

  const [activeProfileTab, setActiveProfileTab] = useState(initialRole);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfiles[initialRole]);

  const handleTabChange = (role) => {
    setActiveProfileTab(role);
    setFormData(userProfiles[role]);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfiles((prev) => ({
      ...prev,
      [activeProfileTab]: formData,
    }));
    setIsEditing(false);
    addToast({
      title: "Profile Updated! 👤",
      message: `Changes saved for ${formData.name}`,
      type: "success",
    });
  };

  const current = isEditing ? formData : userProfiles[activeProfileTab];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Civic Identity & Institutional Profiles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between and review registered Citizen, University, and Industry partner credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <AnimatedButton
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              popupText="✏️ Edit Mode"
              icon={Edit3}
            >
              Edit Details
            </AnimatedButton>
          ) : (
            <AnimatedButton
              size="sm"
              variant="emerald"
              onClick={handleSave}
              popupText="💾 Saved!"
              icon={Save}
            >
              Save Profile
            </AnimatedButton>
          )}
        </div>
      </div>

      {/* Role Profile Switcher Tabs */}
      <div className="flex p-1 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
        {[
          { id: "Citizen", label: "Citizen Profile", icon: User },
          { id: "University", label: "University Profile", icon: GraduationCap },
          { id: "Industry", label: "Industry Profile", icon: Building },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeProfileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id}</span>
            </button>
          );
        })}
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm space-y-6">
        {/* Banner with Avatar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-500/20">
            {activeProfileTab === "Citizen" ? (
              <User className="w-10 h-10" />
            ) : activeProfileTab === "University" ? (
              <GraduationCap className="w-10 h-10" />
            ) : (
              <Building className="w-10 h-10" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {current.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                {current.role || activeProfileTab}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{current.district}</span>
            </p>
          </div>
        </div>

        {/* Profile Attributes Form/Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Full Name / Entity Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {activeProfileTab === "Citizen" ? "Full Citizen Name" : "Institution / Company Name"}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
              />
            ) : (
              <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                {current.name}
              </div>
            )}
          </div>

          {/* District / Address */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Base Location / District
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
              />
            ) : (
              <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                {current.district}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Contact Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
              />
            ) : (
              <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>{current.phone}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
              />
            ) : (
              <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>{current.email}</span>
              </div>
            )}
          </div>

          {/* Role specific extra fields */}
          {activeProfileTab === "Citizen" && (
            <>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Residential Street Address
                </label>
                <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  {current.address}
                </div>
              </div>
            </>
          )}

          {activeProfileTab === "University" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Faculty / R&D Dean
                </label>
                <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  {current.facultyLead}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Technical Departments Involved
                </label>
                <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  {current.department}
                </div>
              </div>
            </>
          )}

          {activeProfileTab === "Industry" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  CSR Registration No.
                </label>
                <div className="font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  {current.csrReg}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Capital Allocated for Jharkhand
                </label>
                <div className="font-semibold text-emerald-500 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  {current.budgetAllocated}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
