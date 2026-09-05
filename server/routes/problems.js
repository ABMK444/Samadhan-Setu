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
// POST /api/problems/:id/complete — Mark problem as complete
router.post("/:id/complete", async (req, res) => {
  try {
    const rawId = req.params.id;
    const dbId = parseInt(rawId.replace("prob-", ""), 10);

    if (isNaN(dbId)) {
      return res.status(400).json({
        error: "Invalid problem ID."
      });
    }

    const {
      orgType,
      orgName,
      partnerIndustry,
      summary,
      peopleImpacted,
      team
    } = req.body;

    // Find the problem in Supabase
    const { data: problem, error: findError } = await supabase
      .from("problems")
      .select("*")
      .eq("problem_id", dbId)
      .single();

    if (findError || !problem) {
      console.error("Find problem error:", findError);

      return res.status(404).json({
        error: "Problem not found."
      });
    }

    // Mark problem as completed in Supabase
    const { data: updatedProblem, error: updateError } = await supabase
      .from("problems")
      .update({
        status: "Completed",
        updated_at: new Date().toISOString()
      })
      .eq("problem_id", dbId)
      .select()
      .single();

    if (updateError) {
      console.error("Complete problem update error:", updateError);

      return res.status(500).json({
        error: updateError.message
      });
    }

    // Return the completed problem
    res.json({
      success: true,
      problem: {
        id: "prob-" + updatedProblem.problem_id,
        dbId: updatedProblem.problem_id,
        title: updatedProblem.problem_title,
        description: updatedProblem.description,
        category: updatedProblem.ai_category,
        subCategory: updatedProblem.sub_category,
        location: updatedProblem.location,
        severity: updatedProblem.severity,
        status: updatedProblem.status,
        createdAt: updatedProblem.date_submitted,
        updatedAt: updatedProblem.updated_at
      }
    });

  } catch (err) {
    console.error("Complete problem error:", err);

    res.status(500).json({
      error: "Failed to complete problem."
    });
  }
});

export default router;
