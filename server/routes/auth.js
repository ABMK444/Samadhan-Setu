import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { generateToken, authMiddleware } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  try {
    const { name, email, password, role, orgName, district, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = db.findOne("users", (u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists. Please login." });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Insert user
    const newUser = db.insert("users", {
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: role || "Citizen",
      org_name: orgName || "",
      district: district || "",
      phone: phone || "",
      badge: role === "Citizen" ? "Panchayat Volunteer" : `${role} Partner`,
      address: "",
      impact_points: 100,
      reports_submitted: 0,
      active_projects: 0,
    });

    // Create welcome notification
    db.insert("notifications", {
      user_id: newUser.id,
      title: "Welcome to SamadhanSetu Jharkhand! 🎉",
      message: `Your ${newUser.role} account has been created. Start reporting problems or collaborating!`,
      type: "info",
      is_read: 0,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        orgName: newUser.org_name,
        district: newUser.district,
        phone: newUser.phone,
        badge: newUser.badge,
        impactPoints: newUser.impact_points,
        reportsSubmitted: newUser.reports_submitted,
        createdAt: newUser.created_at,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.findOne("users", (u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: "No account found with this email. Please register first." });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgName: user.org_name,
        district: user.district,
        phone: user.phone,
        badge: user.badge,
        impactPoints: user.impact_points,
        reportsSubmitted: user.reports_submitted,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, (req, res) => {
  try {
    const user = db.findOne("users", (u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgName: user.org_name,
        district: user.district,
        phone: user.phone,
        badge: user.badge,
        address: user.address,
        impactPoints: user.impact_points,
        reportsSubmitted: user.reports_submitted,
        activeProjects: user.active_projects,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
