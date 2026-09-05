import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";

// Import database (initializes tables on import)
import "./db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import problemRoutes from "./routes/problems.js";
import messageRoutes from "./routes/messages.js";
import historyRoutes from "./routes/history.js";
import notificationRoutes from "./routes/notifications.js";
import profileRoutes from "./routes/profile.js";

const app = express();
const PORT = process.env.PORT || 3001;

// test

app.get("/api/test-supabase", async (req, res) => {
    const { data, error } = await supabase
        .from("problems")
        .select("*");

    if (error) {
        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});


// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173", "http://127.0.0.1:5173"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SamadhanSetu API is running 🚀" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 SamadhanSetu API Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});
