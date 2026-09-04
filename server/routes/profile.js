import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/profile
router.get("/", authMiddleware, (req, res) => {
  try {
    const user = db.findOne("users", (u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const userProblems = db.find("problems", (p) => p.uploader_id === user.id);
    const completedProblems = db.find("history", (h) => h.completed_by_id === user.id);

    res.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgName: user.org_name,
        district: user.district,
        phone: user.phone,
        address: user.address,
        badge: user.badge || (user.role === "Citizen" ? "Panchayat Volunteer" : `${user.role} Partner`),
        impactPoints: user.impact_points || 120,
        reportsSubmitted: userProblems.length,
        activeProjects: user.active_projects || 0,
        completedProjects: completedProblems.length,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// PATCH /api/profile
router.patch("/", authMiddleware, (req, res) => {
  try {
    const { name, phone, district, address, orgName, badge } = req.body;
    const user = db.findOne("users", (u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const updated = db.update("users", (u) => u.id === user.id, (u) => ({
      ...u,
      name: name !== undefined ? name : u.name,
      phone: phone !== undefined ? phone : u.phone,
      district: district !== undefined ? district : u.district,
      address: address !== undefined ? address : u.address,
      org_name: orgName !== undefined ? orgName : u.org_name,
      badge: badge !== undefined ? badge : u.badge,
    }));

    res.json({
      profile: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        orgName: updated.org_name,
        district: updated.district,
        phone: updated.phone,
        address: updated.address,
        badge: updated.badge,
        impactPoints: updated.impact_points,
        reportsSubmitted: updated.reports_submitted,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

export default router;
