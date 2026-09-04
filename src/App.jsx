import React, { useState, useEffect } from "react";
import WelcomePage from "./components/WelcomePage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import AppleBookViewport from "./components/AppleBookViewport";
import { ToastProvider } from "./components/ToastContext";
import { AppProvider } from "./context/AppContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState("welcome"); // "welcome" | "auth" | "dashboard"
  const [currentRole, setCurrentRole] = useState("Citizen"); // "Citizen" | "University" | "Industry"
  const [theme, setTheme] = useState("dark"); // default to dark matching screenshot

  // Sync dark theme class on document element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSelectRole = (role) => {
    setCurrentRole(role);
    setCurrentPage("auth");
  };

  const handleDirectDashboard = (role) => {
    if (role) setCurrentRole(role);
    setCurrentPage("dashboard");
  };

  const handleLoginSuccess = (role) => {
    if (role) setCurrentRole(role);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentPage("welcome");
  };

  return (
    <AppProvider>
      <ToastProvider>
        <div className={`min-h-screen w-full ${theme === "dark" ? "dark bg-[#090d16]" : "bg-slate-50"}`}>
          <AppleBookViewport pageKey={currentPage} role={currentRole} theme={theme}>
            {currentPage === "welcome" && (
              <WelcomePage
                onSelectRole={handleSelectRole}
                onDirectDashboard={handleDirectDashboard}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )}

            {currentPage === "auth" && (
              <AuthPage
                initialRole={currentRole}
                onLoginSuccess={handleLoginSuccess}
                onBackToWelcome={() => setCurrentPage("welcome")}
                theme={theme}
              />
            )}

            {currentPage === "dashboard" && (
              <Dashboard
                role={currentRole}
                onRoleChange={setCurrentRole}
                onLogout={handleLogout}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )}
          </AppleBookViewport>
        </div>
      </ToastProvider>
    </AppProvider>
  );
}


