import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";
import { supabase } from "../supabase.js";

const router = Router();

// GET /api/problems — List all problems
router.get("/", async (req, res) => {
  try {
    const { data: problems, error } = await supabase
      .from("problems")
      .select("*")
      .order("date_submitted", { ascending: false });

    if (error) {
      console.error("Get problems error:", error);

      return res.status(500).json({
        error: error.message
      });
    }

    const result = problems.map((p) => ({
      id: "prob-" + p.problem_id,
      dbId: p.problem_id,

      title: p.problem_title,
      description: p.description,

      category: p.ai_category,
      subCategory: p.sub_category,

      location: p.location,

      uploaderId: p.user_id,

      severity: p.severity,
      status: p.status,

      createdAt: new Date(p.date_submitted).toLocaleString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    res.json({
      problems: result
    });

  } catch (err) {
    console.error("Get problems error:", err);

    res.status(500).json({
      error: "Failed to fetch problems."
    });
  }
});

// POST /api/problems — Upload new problem
// POST /api/problems — Upload new problem
router.post("/", async (req, res) =>  {
  try {
    const {
      title,
      description,
      category,
      district,
      address,
      locationLat,
      locationLng,
      images,
      severity,
      subCategory
    } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Problem title is required."
      });
    }

    // Build location string
    let location = "";

    if (district) {
      location += district;
    }

    if (address) {
      location += location ? `, ${address}` : address;
    }

    if (locationLat != null && locationLng != null) {
      location += location
        ? ` (${locationLat}, ${locationLng})`
        : `(${locationLat}, ${locationLng})`;
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("problems")
      .insert({
        problem_title: title.trim(),
        description: description || "",
        images: images || null,
        location: location || null,
        user_id: null,
        date_submitted: new Date().toISOString(),
        ai_category: category || "Other",
        sub_category: subCategory || null,
        severity: severity || null,
        status: "Reported"
      })
      .select()
      .single();

    // Supabase error
    if (error) {
      console.error("Supabase error while creating problem:", error);

      return res.status(500).json({
        error: error.message
      });
    }

    // Return the newly-created problem
    res.status(201).json({
      success: true,
      problem: {
        id: "prob-" + data.problem_id,
        dbId: data.problem_id,
        title: data.problem_title,
        description: data.description,
        category: data.ai_category,
        subCategory: data.sub_category,
        location: data.location,
        uploaderId: data.user_id,
        severity: data.severity,
        status: data.status,
        images: data.images,
        createdAt: data.date_submitted
      }
    });

  } catch (err) {
    console.error("Create problem error:", err);

    res.status(500).json({
      error: "Failed to create problem."
    });
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
