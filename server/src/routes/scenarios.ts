import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// ============ PUBLIC (authenticated) ============

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

// ============ ADMIN CRUD — SCENARIOS ============

// POST /api/scenarios — Create scenario
router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { slug, theme, situation, choices, order } = req.body;
    if (!slug || !theme || !situation || !choices) {
      res.status(400).json({ error: "slug, theme, situation, dan choices wajib diisi" });
      return;
    }
    const scenario = await prisma.scenario.create({
      data: { slug, theme, situation, choices, order: order ?? 0 },
    });
    res.status(201).json({ scenario });
  } catch (err: any) {
    if (err.code === "P2002") { res.status(409).json({ error: "Slug sudah digunakan" }); return; }
    console.error("Create scenario error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// PUT /api/scenarios/:id — Update scenario
router.put("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { theme, situation, choices, order } = req.body;
    const scenario = await prisma.scenario.update({
      where: { id },
      data: {
        ...(theme !== undefined && { theme }),
        ...(situation !== undefined && { situation }),
        ...(choices !== undefined && { choices }),
        ...(order !== undefined && { order }),
      },
    });
    res.json({ scenario });
  } catch (err: any) {
    if (err.code === "P2025") { res.status(404).json({ error: "Skenario tidak ditemukan" }); return; }
    console.error("Update scenario error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// DELETE /api/scenarios/:id — Delete scenario
router.delete("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.scenario.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    if (err.code === "P2025") { res.status(404).json({ error: "Skenario tidak ditemukan" }); return; }
    console.error("Delete scenario error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// ============ ADMIN CRUD — SIM EVENTS ============

// POST /api/scenarios/sim-events — Create sim event
router.post("/sim-events", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { slug, theme, icon, text, choices, order } = req.body;
    if (!slug || !theme || !icon || !text || !choices) {
      res.status(400).json({ error: "slug, theme, icon, text, dan choices wajib diisi" });
      return;
    }
    const event = await prisma.simEvent.create({
      data: { slug, theme, icon, text, choices, order: order ?? 0 },
    });
    res.status(201).json({ event });
  } catch (err: any) {
    if (err.code === "P2002") { res.status(409).json({ error: "Slug sudah digunakan" }); return; }
    console.error("Create sim event error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// PUT /api/scenarios/sim-events/:id — Update sim event
router.put("/sim-events/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { theme, icon, text, choices, order } = req.body;
    const event = await prisma.simEvent.update({
      where: { id },
      data: {
        ...(theme !== undefined && { theme }),
        ...(icon !== undefined && { icon }),
        ...(text !== undefined && { text }),
        ...(choices !== undefined && { choices }),
        ...(order !== undefined && { order }),
      },
    });
    res.json({ event });
  } catch (err: any) {
    if (err.code === "P2025") { res.status(404).json({ error: "Sim event tidak ditemukan" }); return; }
    console.error("Update sim event error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// DELETE /api/scenarios/sim-events/:id — Delete sim event
router.delete("/sim-events/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.simEvent.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    if (err.code === "P2025") { res.status(404).json({ error: "Sim event tidak ditemukan" }); return; }
    console.error("Delete sim event error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default router;
