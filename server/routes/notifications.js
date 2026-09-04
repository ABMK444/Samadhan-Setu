import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

function getRelativeTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// GET /api/notifications
router.get("/", authMiddleware, (req, res) => {
  try {
    const notifs = db.find(
      "notifications",
      (n) => n.user_id === req.user.id || !n.user_id
    );

    const sorted = [...notifs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      notifications: sorted.map((n) => ({
        id: "notif-" + n.id,
        dbId: n.id,
        title: n.title,
        message: n.message,
        type: n.type || "info",
        unread: !n.is_read,
        time: getRelativeTime(n.created_at),
        createdAt: n.created_at,
      })),
    });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", authMiddleware, (req, res) => {
  try {
    const rawId = req.params.id;
    const numId = parseInt(rawId.replace("notif-", ""));

    db.update("notifications", (n) => n.id === numId, (n) => ({
      ...n,
      is_read: 1,
    }));

    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
});

export default router;
