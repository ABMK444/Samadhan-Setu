import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE, getToken, setToken, clearToken } from "../api/client";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [problems, setProblems] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_problems");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_history_v2");
    return saved ? JSON.parse(saved) : [];
  });

  const [updates, setUpdates] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_updates");
    return saved ? JSON.parse(saved) : [];
  });

  const [chatThreads, setChatThreads] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_threads");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeThreadId, setActiveThreadId] = useState(null);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_notifications");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "notif-init-1",
            title: "Connected to SamadhanSetu Real Database 🚀",
            message: "All registrations, problems, messages, and history are permanently stored.",
            time: "Just now",
            unread: true,
            type: "info",
          },
        ];
  });

  const [selectedNotification, setSelectedNotification] = useState(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_settings");
    return saved
      ? JSON.parse(saved)
      : {
          theme: "dark",
          soundEnabled: true,
          bookAnimation: true,
          animationSpeed: "normal",
          autoNotify: true,
        };
  });

  const [userProfiles, setUserProfiles] = useState(() => {
    const saved = localStorage.getItem("samadhansetu_profiles");
    return saved
      ? JSON.parse(saved)
      : {
          Citizen: {
            name: "Rajesh Kumar Mahto",
            role: "Citizen Activist",
            district: "Ranchi, Jharkhand",
            phone: "+91 98351 44210",
            email: "rajesh.mahto@gmail.com",
            address: "Near Kanke Dam Road, Ranchi - 834006",
            badge: "Panchayat Volunteer",
            reportsSubmitted: 0,
            impactPoints: 120,
          },
          University: {
            name: "Birla Institute of Technology (BIT) Mesra",
            role: "University Technical Partner",
            district: "Ranchi, Jharkhand",
            phone: "+91 651 2275444",
            email: "csr.solutions@bitmesra.ac.in",
            facultyLead: "Dr. Arvind Shrivastava (Dean of R&D)",
            department: "Civil, Electronics & Rural Tech Department",
            activeStudents: 140,
            activeProjects: 0,
          },
          Industry: {
            name: "Tata Steel CSR Initiatives",
            role: "Industry Corporate Sponsor",
            district: "Jamshedpur / Ranchi",
            phone: "+91 657 6644222",
            email: "csr.jharkhand@tatasteel.com",
            csrReg: "CSR-JH-2024-889",
            budgetAllocated: "₹1.50 Crore",
            focusSector: "Drinking Water, Solar Microgrids & Skill Development",
          },
        };
  });

  // Fetch initial data from Database Backend
  const refreshFromDb = useCallback(async () => {
    try {
      // 1. Fetch problems
      const probRes = await fetch(`${API_BASE}/problems`);
      if (probRes.ok) {
        const data = await probRes.json();
        if (data.problems) {
          setProblems(data.problems);
          localStorage.setItem("samadhansetu_problems", JSON.stringify(data.problems));
        }
      }

      // 2. Fetch history
      const histRes = await fetch(`${API_BASE}/history`);
      if (histRes.ok) {
        const data = await histRes.json();
        if (data.history) {
          setHistory(data.history);
          localStorage.setItem("samadhansetu_history_v2", JSON.stringify(data.history));
        }
      }

      // 3. If logged in, fetch user, threads and notifications
      const token = getToken();
      if (token) {
        const authHeaders = { Authorization: `Bearer ${token}` };

        // Fetch user
        const meRes = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders });
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
          localStorage.setItem("samadhansetu_user", JSON.stringify(meData.user));
        }

        // Fetch chat threads
        const threadsRes = await fetch(`${API_BASE}/messages/threads`, { headers: authHeaders });
        if (threadsRes.ok) {
          const tData = await threadsRes.json();
          if (tData.threads) {
            setChatThreads(tData.threads);
            localStorage.setItem("samadhansetu_threads", JSON.stringify(tData.threads));
          }
        }

        // Fetch notifications
        const notifRes = await fetch(`${API_BASE}/notifications`, { headers: authHeaders });
        if (notifRes.ok) {
          const nData = await notifRes.json();
          if (nData.notifications && nData.notifications.length > 0) {
            setNotifications(nData.notifications);
            localStorage.setItem("samadhansetu_notifications", JSON.stringify(nData.notifications));
          }
        }
      }
    } catch (err) {
      console.warn("Backend not reachable yet, using local state:", err);
    }
  }, []);

  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb]);

  // Sync state to localStorage for offline cache
  useEffect(() => {
    localStorage.setItem("samadhansetu_problems", JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem("samadhansetu_history_v2", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("samadhansetu_updates", JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem("samadhansetu_threads", JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem("samadhansetu_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("samadhansetu_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("samadhansetu_profiles", JSON.stringify(userProfiles));
  }, [userProfiles]);

  // Actions
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
    setToken(data.token);
    setCurrentUser(data.user);
    localStorage.setItem("samadhansetu_user", JSON.stringify(data.user));
    await refreshFromDb();
    return data.user;
  };

  const register = async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }
    setToken(data.token);
    setCurrentUser(data.user);
    localStorage.setItem("samadhansetu_user", JSON.stringify(data.user));
    await refreshFromDb();
    return data.user;
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
    localStorage.removeItem("samadhansetu_user");
  };

  const addProblem = async (problemData) => {
    const token = getToken();
    let createdProb = null;

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/problems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(problemData),
        });
        if (res.ok) {
          const data = await res.json();
          createdProb = data.problem;
        }
      } catch (e) {
        console.warn("Error calling backend to add problem:", e);
      }
    }

    if (!createdProb) {
      createdProb = {
        id: "prob-" + Date.now(),
        ...problemData,
        uploaderName: currentUser?.name || problemData.uploaderName || "Citizen Rajesh Kumar",
        uploaderRole: currentUser?.role || problemData.reportedByRole || "Citizen",
        status: "Reported",
        progress: 0,
        createdAt: new Date().toLocaleString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatesList: [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            percentage: 0,
            text: "Problem registered and pinned on Jharkhand civic grid.",
          },
        ],
        votes: 1,
      };
    }

    setProblems((prev) => [createdProb, ...prev]);

    const newNotif = {
      id: "notif-" + Date.now(),
      title: `New Problem Reported: ${problemData.title}`,
      message: `Location: ${problemData.district} (${problemData.address || "Pinned on Map"}) • Category: ${problemData.category}`,
      time: "Just now",
      unread: true,
      type: "problem",
      problemData: createdProb,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return createdProb;
  };

  const startChatWithUploader = async (problem, requesterRole) => {
    const token = getToken();
    if (token && problem.dbId) {
      try {
        const res = await fetch(`${API_BASE}/messages/threads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ problemDbId: problem.dbId }),
        });
        if (res.ok) {
          const data = await res.json();
          setChatThreads((prev) => {
            const exists = prev.some((t) => t.id === data.thread.id);
            return exists ? prev : [data.thread, ...prev];
          });
          setActiveThreadId(data.thread.id);
          return data.thread.id;
        }
      } catch (e) {
        console.warn("Backend chat thread error:", e);
      }
    }

    const existing = chatThreads.find((t) => t.problemId === problem.id);
    if (existing) {
      setActiveThreadId(existing.id);
      return existing.id;
    }

    const newThread = {
      id: "thread-" + Date.now(),
      problemId: problem.id,
      problemTitle: problem.title,
      uploaderName: problem.uploaderName || "Citizen Uploader",
      uploaderRole: problem.uploaderRole || "Citizen",
      district: problem.district,
      messages: [
        {
          id: 1,
          sender: `${requesterRole} Representative`,
          role: requesterRole,
          text: `Hello ${problem.uploaderName || "Citizen"}! We saw your report about "${problem.title}". Our team wants to look into this issue and clarify some site details.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: true,
        },
      ],
    };

    setChatThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    return newThread.id;
  };

  const sendChatMessage = async (threadId, text, senderRole) => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/messages/threads/${threadId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        });
      } catch (e) {
        console.warn("Error sending chat to backend:", e);
      }
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          return {
            ...th,
            messages: [
              ...th.messages,
              {
                id: Date.now(),
                sender: currentUser?.name || (senderRole === th.uploaderRole ? th.uploaderName : `${senderRole} Partner`),
                role: senderRole,
                text,
                time: timeStr,
                isMe: true,
              },
            ],
          };
        }
        return th;
      })
    );
  };

  const updateProblemProgress = async (problemId, percentage, note, workerName = "University Lead") => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/problems/${problemId}/progress`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ percentage, note, workerName }),
        });
      } catch (e) {
        console.warn("Error updating progress in backend:", e);
      }
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const isCompleted = percentage >= 100;

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          const newStatus = isCompleted ? "Completed" : percentage > 0 ? "In Progress" : "Reported";
          const newUpdates = [
            ...(p.updatesList || []),
            { timestamp: timeStr, percentage, text: note, author: workerName },
          ];
          return {
            ...p,
            progress: percentage,
            status: newStatus,
            updatesList: newUpdates,
          };
        }
        return p;
      })
    );

    setUpdates((prev) => [
      {
        id: "upd-" + Date.now(),
        problemId,
        percentage,
        note,
        time: timeStr,
        workerName,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: "notif-" + Date.now(),
        title: isCompleted ? "Problem Marked as 100% Completed! 🎉" : `Progress Update: ${percentage}%`,
        message: `${note} (${workerName})`,
        time: "Just now",
        unread: true,
        type: isCompleted ? "completed" : "update",
      },
      ...prev,
    ]);
  };

  const markProblemCompleted = async (problemId, completionDetails) => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/problems/${problemId}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(completionDetails),
        });
      } catch (e) {
        console.warn("Error completing problem in backend:", e);
      }
    }

    const prob = problems.find((p) => p.id === problemId);
    if (!prob) return;

    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, status: "Completed", progress: 100 } : p))
    );

    const newHistoryItem = {
      id: "hist-" + Date.now(),
      title: prob.title,
      district: prob.district + (prob.address ? ` (${prob.address})` : ""),
      category: prob.category,
      organizationType: completionDetails.orgType || "University",
      organizationName: completionDetails.orgName || "BIT Mesra Technical Team",
      partnerIndustry: completionDetails.partnerIndustry || "Jharkhand CSR Consortium",
      completedAt: new Date().toLocaleString(),
      peopleImpacted: completionDetails.peopleImpacted || 500,
      summary: completionDetails.summary || prob.description || "Issue fully resolved on ground.",
      team: completionDetails.team || [
        {
          name: completionDetails.studentName || "Aman Verma",
          age: 22,
          role: "Student Project Lead",
          course: "B.Tech Civil & Environmental Eng. (4th Year)",
          work: "Technical verification, on-site installation and pipeline testing.",
          hoursLogged: 45,
        },
        {
          name: completionDetails.workerName || "Rameshwar Munda",
          age: 38,
          role: "Field Specialist Technician",
          course: "Jharkhand Technical Trade Certified",
          work: "Physical civil installation, pumping setup and structural safety check.",
          hoursLogged: 60,
        },
      ],
      timeline: prob.updatesList
        ? prob.updatesList.map((u) => ({ time: u.timestamp, note: u.text }))
        : [{ time: "Completion", note: "Final field audit passed and certified." }],
    };

    setHistory((prev) => [newHistoryItem, ...prev]);

    setNotifications((prev) => [
      {
        id: "notif-" + Date.now(),
        title: `Archived to History: ${prob.title}`,
        message: `Successfully resolved by ${newHistoryItem.organizationName}.`,
        time: "Just now",
        unread: true,
        type: "history",
      },
      ...prev,
    ]);
  };

  const resetDemoData = () => {
    setProblems([]);
    setHistory([]);
    setUpdates([]);
    setChatThreads([]);
    setNotifications([
      {
        id: "notif-reset",
        title: "Clean Slate",
        message: "Data reset to clean initial state.",
        time: "Just now",
        unread: true,
        type: "info",
      },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        problems,
        history,
        updates,
        chatThreads,
        activeThreadId,
        setActiveThreadId,
        startChatWithUploader,
        sendChatMessage,
        notifications,
        settings,
        userProfiles,
        selectedNotification,
        setSelectedNotification,
        addProblem,
        updateProblemProgress,
        markProblemCompleted,
        setSettings,
        setUserProfiles,
        resetDemoData,
        refreshFromDb,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
