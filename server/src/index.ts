import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import moduleRoutes from "./routes/modules.js";
import progressRoutes from "./routes/progress.js";
import adminRoutes from "./routes/admin.js";
import scenarioRoutes from "./routes/scenarios.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5174", "http://103.152.242.122:4173"], credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/scenarios", scenarioRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 DigiFin Quest API running on http://localhost:${PORT}`);
});
