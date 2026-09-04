import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/problems — List all problems
router.get("/", (req, res) => {
  try {
    const problems = db.get("problems");
    // Sort descending by created_at
    const sorted = [...problems].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const result = sorted.map((p) => ({
      id: "prob-" + p.id,
      dbId: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      district: p.district,
      address: p.address,
      locationLat: p.location_lat,
      locationLng: p.location_lng,
      uploaderId: p.uploader_id,
      uploaderName: p.uploader_name,
      uploaderRole: p.uploader_role,
      status: p.status,
      progress: p.progress,
      votes: p.votes,
      createdAt: new Date(p.created_at).toLocaleString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatesList: (p.updates_list || []).map((u) => ({
        timestamp: u.timestamp || new Date(u.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        percentage: u.percentage,
        text: u.note || u.text,
        author: u.worker_name || u.author,
      })),
    }));

    res.json({ problems: result });
  } catch (err) {
    console.error("Get problems error:", err);
    res.status(500).json({ error: "Failed to fetch problems." });
  }
});

// POST /api/problems — Upload new problem
router.post("/", authMiddleware, (req, res) => {
  try {
    const { title, description, category, district, address, locationLat, locationLng } = req.body;
    const user = db.findOne("users", (u) => u.id === req.user.id);

    if (!title) {
      return res.status(400).json({ error: "Problem title is required." });
    }

    const initialUpdate = {
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      percentage: 0,
      note: "Problem registered and pinned on Jharkhand civic grid.",
      worker_name: user ? user.name : "Citizen",
      created_at: new Date().toISOString(),
    };

    const newProblem = db.insert("problems", {
      title,
      description: description || "",
      category: category || "Other",
      district: district || "",
      address: address || "",
      location_lat: locationLat || null,
      location_lng: locationLng || null,
      uploader_id: user ? user.id : req.user.id,
      uploader_name: user ? user.name : req.user.name,
      uploader_role: user ? user.role : req.user.role,
      status: "Reported",
      progress: 0,
      votes: 1,
      updates_list: [initialUpdate],
    });

    if (user) {
      db.update("users", (u) => u.id === user.id, (u) => ({
        ...u,
        reports_submitted: (u.reports_submitted || 0) + 1,
        impact_points: (u.impact_points || 0) + 20,
      }));
    }

    db.insert("notifications", {
      user_id: user ? user.id : req.user.id,
      title: `New Problem Reported: ${title}`,
      message: `Location: ${district || "Jharkhand"} (${address || "Pinned on Map"}) • Category: ${category || "General"}`,
      type: "problem",
      is_read: 0,
    });

    res.status(201).json({
      problem: {
        id: "prob-" + newProblem.id,
        dbId: newProblem.id,
        title: newProblem.title,
        description: newProblem.description,
        category: newProblem.category,
        district: newProblem.district,
        address: newProblem.address,
        locationLat: newProblem.location_lat,
        locationLng: newProblem.location_lng,
        uploaderId: newProblem.uploader_id,
        uploaderName: newProblem.uploader_name,
        uploaderRole: newProblem.uploader_role,
        status: newProblem.status,
        progress: newProblem.progress,
        votes: newProblem.votes,
        createdAt: new Date(newProblem.created_at).toLocaleString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatesList: newProblem.updates_list.map((u) => ({
          timestamp: u.timestamp,
          percentage: u.percentage,
          text: u.note,
          author: u.worker_name,
        })),
      },
    });
  } catch (err) {
    console.error("Create problem error:", err);
    res.status(500).json({ error: "Failed to create problem." });
  }
});

// PATCH /api/problems/:id/progress — Update progress
router.patch("/:id/progress", authMiddleware, (req, res) => {
  try {
    const rawId = req.params.id;
    const dbId = parseInt(rawId.replace("prob-", ""));
    const { percentage, note, workerName } = req.body;

    const prob = db.findOne("problems", (p) => p.id === dbId);
    if (!prob) return res.status(404).json({ error: "Problem not found." });

    const isCompleted = percentage >= 100;
    const newStatus = isCompleted ? "Completed" : percentage > 0 ? "In Progress" : "Reported";
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newUpdate = {
      timestamp: timeStr,
      percentage,
      note: note || "",
      worker_name: workerName || req.user.name,
      created_at: new Date().toISOString(),
    };

    db.update("problems", (p) => p.id === dbId, (p) => ({
      ...p,
      progress: percentage,
      status: newStatus,
      updates_list: [...(p.updates_list || []), newUpdate],
    }));

    db.insert("notifications", {
      user_id: prob.uploader_id,
      title: isCompleted ? "Problem Marked as 100% Completed! 🎉" : `Progress Update: ${percentage}%`,
      message: `${note} (${workerName || req.user.name})`,
      type: isCompleted ? "completed" : "update",
      is_read: 0,
    });

    res.json({ success: true, status: newStatus, progress: percentage });
  } catch (err) {
    console.error("Update progress error:", err);
    res.status(500).json({ error: "Failed to update progress." });
  }
});

// POST /api/problems/:id/complete — Mark complete and archive to history
router.post("/:id/complete", authMiddleware, (req, res) => {
  try {
    const rawId = req.params.id;
    const dbId = parseInt(rawId.replace("prob-", ""));
    const { orgType, orgName, partnerIndustry, summary, peopleImpacted, team } = req.body;

    const prob = db.findOne("problems", (p) => p.id === dbId);
    if (!prob) return res.status(404).json({ error: "Problem not found." });

    db.update("problems", (p) => p.id === dbId, (p) => ({
      ...p,
      status: "Completed",
      progress: 100,
    }));

    const historyRecord = db.insert("history", {
      problem_id: dbId,
      title: prob.title,
      district: prob.district + (prob.address ? ` (${prob.address})` : ""),
      category: prob.category,
      organization_type: orgType || req.user.role || "University",
      organization_name: orgName || req.user.name || "BIT Mesra Technical Team",
      partner_industry: partnerIndustry || "Jharkhand CSR Consortium",
      summary: summary || prob.description || "Issue fully resolved on ground.",
      people_impacted: peopleImpacted || 500,
      completed_by_id: req.user.id,
      completed_at: new Date().toISOString(),
      team: team || [
        {
          name: req.body.studentName || "Aman Verma",
          age: 22,
          role: "Student Project Lead",
          course: "B.Tech Civil & Environmental Eng.",
          work: "Technical verification & on-site supervision",
          hours_logged: 45,
        },
        {
          name: req.body.workerName || "Rameshwar Munda",
          age: 38,
          role: "Field Specialist Technician",
          course: "Jharkhand Technical Trade Certified",
          work: "Civil execution & structural installation",
          hours_logged: 60,
        },
      ],
      timeline: (prob.updates_list || []).map((u) => ({
        time: u.timestamp,
        note: u.note,
      })),
    });

    db.insert("notifications", {
      user_id: prob.uploader_id,
      title: `Archived to History: ${prob.title}`,
      message: `Successfully resolved by ${orgName || req.user.name}.`,
      type: "history",
      is_read: 0,
    });

    res.json({ success: true, historyRecord });
  } catch (err) {
    console.error("Complete problem error:", err);
    res.status(500).json({ error: "Failed to complete problem." });
  }
});

export default router;
