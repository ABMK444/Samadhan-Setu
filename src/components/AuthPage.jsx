import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Phone,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import { useToast } from "./ToastContext";
import { useApp } from "../context/AppContext";

export default function AuthPage({
  initialRole = "Citizen",
  onLoginSuccess,
  onBackToWelcome,
  theme,
}) {
  const { addToast } = useToast();
  const { login, register } = useApp();
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [userInput, setUserInput] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real Database Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const displayName = fullName.trim() || userInput.trim() || selectedRole;
    // Ensure valid email format from user input
    const emailVal = userInput.includes("@")
      ? userInput.trim()
      : `${userInput.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "user"}@samadhansetu.in`;
    const pwdVal = password || "123456";

    try {
      if (authMode === "register") {
        const user = await register({
          name: displayName,
          email: emailVal,
          password: pwdVal,
          role: selectedRole,
          orgName: orgName.trim(),
          phone: userInput.match(/^\+?[0-9]{10,12}$/) ? userInput : "",
        });
        addToast({
          title: "Account Created & Saved in Database! 🎉",
          message: `Welcome, ${user.name}! Your account is securely stored.`,
          type: "success",
        });
        onLoginSuccess(user.role, user.name);
      } else {
        // Login
        try {
          const user = await login(emailVal, pwdVal);
          addToast({
            title: `Welcome back, ${user.name}! 👋`,
            message: `Authenticated from database as ${user.role}.`,
            type: "success",
          });
          onLoginSuccess(user.role, user.name);
        } catch (loginErr) {
          // If user doesn't exist, auto-create account for seamless demo experience
          if (loginErr.message.includes("No account found") || loginErr.message.includes("register first")) {
            const user = await register({
              name: displayName,
              email: emailVal,
              password: pwdVal,
              role: selectedRole,
              orgName: orgName.trim(),
            });
            addToast({
              title: "New Account Activated & Saved! 🚀",
              message: `Registered and logged in as ${user.name}.`,
              type: "sparkle",
            });
            onLoginSuccess(user.role, user.name);
          } else {
            throw loginErr;
          }
        }
      }
    } catch (err) {
      addToast({
        title: "Authentication Error",
        message: err.message || "Failed to authenticate with database.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    const randomNum = Math.floor(Math.random() * 1000);
    const socialEmail = `${selectedRole.toLowerCase()}${randomNum}@${provider.toLowerCase()}.com`;
    const socialName = `${provider} ${selectedRole} User`;
    try {
      const user = await register({
        name: socialName,
        email: socialEmail,
        password: "social_auth_secure_token",
        role: selectedRole,
      });
      addToast({
        title: `${provider} Database Auth`,
        message: `Signed in as ${user.name} and saved to database.`,
        type: "sparkle",
      });
      onLoginSuccess(selectedRole, user.name);
    } catch {
      onLoginSuccess(selectedRole, socialName);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0a0f1d] text-white"
          : "bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 text-slate-900"
      }`}
    >
      {/* Top Controls */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between">
        <button
          onClick={onBackToWelcome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-500 transition-colors p-2 rounded-xl hover:bg-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roles</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Free-Form Auth</span>
        </div>
      </div>

      {/* Main Glass / Dark Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border ${
          theme === "dark"
            ? "bg-[#111726]/95 border-slate-800/80 shadow-black/60"
            : "bg-white/95 border-slate-100 shadow-indigo-100/50"
        }`}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 flex items-center justify-center gap-2">
            <span>{authMode === "login" ? "Welcome Back!" : "Join SamadhanSetu"}</span>
            <span>{authMode === "login" ? "👋" : "🚀"}</span>
          </h2>
          <p className="text-xs text-slate-400">
            Fill in any demo credentials to proceed immediately
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 mb-5 relative">
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 cursor-pointer ${
              authMode === "login"
                ? "text-white shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {authMode === "login" && (
              <motion.div
                layoutId="auth-tab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10">Login</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode("register")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 cursor-pointer ${
              authMode === "register"
                ? "text-white shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {authMode === "register" && (
              <motion.div
                layoutId="auth-tab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10">Register</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              I am a
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Citizen">Citizen (Local Resident / Community)</option>
                <option value="University">University (College / Research Faculty)</option>
                <option value="Industry">Industry (CSR / Corporate Partner)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Registration Extra Fields */}
          {authMode === "register" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter any name (e.g. Anubhav Kumar)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {selectedRole !== "Citizen" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {selectedRole === "University" ? "College / University Name" : "Company / Industry Name"}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder={
                        selectedRole === "University" ? "e.g. BIT Mesra" : "e.g. Tata Steel"
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Input (Mobile or Email or Username) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Mobile Number or Email
            </label>
            <div className="relative flex items-center">
              <div className="flex items-center gap-1 pl-3 pr-2 py-2.5 border-r border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 absolute left-0">
                <span>+91</span>
              </div>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter any mobile number or text"
                className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <span className="text-[10px] text-indigo-400">Any password accepted</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type any password"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <AnimatedButton
              type="submit"
              variant="violet"
              disabled={isSubmitting}
              triggerConfetti={true}
              popupText={authMode === "login" ? "🚀 Logging in..." : "🎉 Registered!"}
              className="w-full py-3 font-bold text-sm shadow-xl shadow-purple-500/25"
            >
              {isSubmitting ? "Opening Dashboard..." : authMode === "login" ? "Login" : "Register"}
            </AnimatedButton>
          </div>
        </form>

        {/* Social Logins */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative px-3 text-[11px] font-semibold text-slate-400 bg-white dark:bg-[#111726]">
            or continue with
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <AnimatedButton
            variant="outline"
            size="sm"
            popupText="Google Auth"
            onClick={() => handleSocialLogin("Google")}
            className="w-12 h-12 !p-0 rounded-2xl flex items-center justify-center"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
            </svg>
          </AnimatedButton>

          <AnimatedButton
            variant="outline"
            size="sm"
            popupText="Microsoft 365"
            onClick={() => handleSocialLogin("Microsoft")}
            className="w-12 h-12 !p-0 rounded-2xl flex items-center justify-center"
          >
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
              <div className="bg-[#F25022]" />
              <div className="bg-[#7FBA00]" />
              <div className="bg-[#00A4EF]" />
              <div className="bg-[#FFB900]" />
            </div>
          </AnimatedButton>

          <AnimatedButton
            variant="outline"
            size="sm"
            popupText="Twitter / X"
            onClick={() => handleSocialLogin("Twitter")}
            className="w-12 h-12 !p-0 rounded-2xl flex items-center justify-center"
          >
            <svg className="w-4 h-4 fill-current text-slate-700 dark:text-slate-200" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </AnimatedButton>
        </div>

        {/* Bottom Toggle Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {authMode === "login" ? (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className="font-bold text-indigo-400 hover:text-indigo-300 underline ml-1 cursor-pointer"
              >
                Register Now
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="font-bold text-indigo-400 hover:text-indigo-300 underline ml-1 cursor-pointer"
              >
                Login
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
