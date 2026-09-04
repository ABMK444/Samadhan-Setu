import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/messages/threads — Get threads for current user
router.get("/threads", authMiddleware, (req, res) => {
  try {
    const threads = db.find(
      "chat_threads",
      (t) => t.starter_id === req.user.id || t.uploader_id === req.user.id
    );

    const sorted = [...threads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const result = sorted.map((t) => ({
      id: "thread-" + t.id,
      dbId: t.id,
      problemId: "prob-" + t.problem_id,
      problemTitle: t.problem_title,
      uploaderName: t.uploader_name,
      uploaderRole: t.uploader_role,
      district: t.district,
      messages: (t.messages || []).map((m) => ({
        id: m.id,
        sender: m.sender_name,
        role: m.sender_role,
        text: m.text,
        time: m.time || new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: m.sender_id === req.user.id,
      })),
    }));

    res.json({ threads: result });
  } catch (err) {
    console.error("Get threads error:", err);
    res.status(500).json({ error: "Failed to fetch threads." });
  }
});

// POST /api/messages/threads — Start new chat thread
router.post("/threads", authMiddleware, (req, res) => {
  try {
    const { problemDbId, initialMessage } = req.body;

    if (!problemDbId) {
      return res.status(400).json({ error: "Problem ID is required." });
    }

    const numId = typeof problemDbId === "string" ? parseInt(problemDbId.replace("prob-", "")) : problemDbId;
    const prob = db.findOne("problems", (p) => p.id === numId);
    if (!prob) return res.status(404).json({ error: "Problem not found." });

    // Check if thread exists
    const existing = db.findOne(
      "chat_threads",
      (t) => t.problem_id === numId && t.starter_id === req.user.id
    );

    if (existing) {
      return res.json({
        thread: {
          id: "thread-" + existing.id,
          dbId: existing.id,
          problemId: "prob-" + existing.problem_id,
          problemTitle: existing.problem_title,
          uploaderName: existing.uploader_name,
          uploaderRole: existing.uploader_role,
          district: existing.district,
          messages: (existing.messages || []).map((m) => ({
            id: m.id,
            sender: m.sender_name,
            role: m.sender_role,
            text: m.text,
            time: m.time || new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: m.sender_id === req.user.id,
          })),
        },
        isExisting: true,
      });
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgText = initialMessage || `Hello ${prob.uploader_name || "Citizen"}! We saw your report about "${prob.title}". Our team wants to look into this issue and coordinate a solution.`;

    const initialMsg = {
      id: 1,
      sender_id: req.user.id,
      sender_name: req.user.name,
      sender_role: req.user.role,
      text: msgText,
      time: timeStr,
      created_at: new Date().toISOString(),
    };

    const newThread = db.insert("chat_threads", {
      problem_id: numId,
      starter_id: req.user.id,
      uploader_id: prob.uploader_id,
      problem_title: prob.title,
      uploader_name: prob.uploader_name,
      uploader_role: prob.uploader_role,
      district: prob.district,
      messages: [initialMsg],
    });

    res.status(201).json({
      thread: {
        id: "thread-" + newThread.id,
        dbId: newThread.id,
        problemId: "prob-" + newThread.problem_id,
        problemTitle: newThread.problem_title,
        uploaderName: newThread.uploader_name,
        uploaderRole: newThread.uploader_role,
        district: newThread.district,
        messages: newThread.messages.map((m) => ({
          id: m.id,
          sender: m.sender_name,
          role: m.sender_role,
          text: m.text,
          time: m.time,
          isMe: m.sender_id === req.user.id,
        })),
      },
      isExisting: false,
    });
  } catch (err) {
    console.error("Create thread error:", err);
    res.status(500).json({ error: "Failed to create thread." });
  }
});

// POST /api/messages/threads/:id — Send message in thread
router.post("/threads/:id", authMiddleware, (req, res) => {
  try {
    const rawId = req.params.id;
    const numId = parseInt(rawId.replace("thread-", ""));
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Message text is required." });

    const thread = db.findOne("chat_threads", (t) => t.id === numId);
    if (!thread) return res.status(404).json({ error: "Thread not found." });

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = {
      id: Date.now(),
      sender_id: req.user.id,
      sender_name: req.user.name,
      sender_role: req.user.role,
      text,
      time: timeStr,
      created_at: new Date().toISOString(),
    };

    db.update("chat_threads", (t) => t.id === numId, (t) => ({
      ...t,
      messages: [...(t.messages || []), newMsg],
    }));

    res.status(201).json({
      success: true,
      message: {
        id: newMsg.id,
        sender: newMsg.sender_name,
        role: newMsg.sender_role,
        text: newMsg.text,
        time: newMsg.time,
        isMe: true,
      },
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

export default router;
