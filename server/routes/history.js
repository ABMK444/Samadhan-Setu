import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /api/history — Get all completed problem records
router.get("/", (req, res) => {
  try {
    const history = db.get("history");
    const sorted = [...history].sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

    const result = sorted.map((h) => ({
      id: "hist-" + h.id,
      dbId: h.id,
      title: h.title,
      district: h.district,
      category: h.category,
      organizationType: h.organization_type,
      organizationName: h.organization_name,
      partnerIndustry: h.partner_industry,
      summary: h.summary,
      peopleImpacted: h.people_impacted,
      completedAt: new Date(h.completed_at).toLocaleString(),
      team: (h.team || []).map((t) => ({
        name: t.name,
        age: t.age,
        role: t.role,
        course: t.course,
        work: t.work,
        hoursLogged: t.hours_logged || t.hoursLogged || 40,
      })),
      timeline: (h.timeline || []).map((tl) => ({
        time: tl.time,
        note: tl.note,
      })),
    }));

    res.json({ history: result });
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

export default router;
