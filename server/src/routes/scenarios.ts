import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// GET /api/scenarios — List all scenarios
router.get("/", authenticate, async (_req, res) => {
  try {
    const scenarios = await prisma.scenario.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ scenarios });
  } catch (err) {
    console.error("List scenarios error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// GET /api/scenarios/sim-events — List simulation events
router.get("/sim-events", authenticate, async (_req, res) => {
  try {
    const events = await prisma.simEvent.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ events });
  } catch (err) {
    console.error("List sim events error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default router;
