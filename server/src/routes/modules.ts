import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/modules — List all modules
router.get("/", authenticate, async (_req, res) => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { quizzes: true } },
      },
    });

    res.json({
      modules: modules.map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        topics: m.topics,
        order: m.order,
        quizCount: m._count.quizzes,
      })),
    });
  } catch (err) {
    console.error("List modules error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// GET /api/modules/:id — Get module detail with lesson + quizzes
router.get("/:id", authenticate, async (req, res) => {
  try {
    const mod = await prisma.module.findUnique({
      where: { id: req.params.id },
      include: {
        quizzes: { orderBy: { order: "asc" } },
      },
    });

    if (!mod) {
      res.status(404).json({ error: "Modul tidak ditemukan" });
      return;
    }

    res.json({ module: mod });
  } catch (err) {
    console.error("Get module error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/modules — Create module (Admin only)
router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { slug, title, topics, order, lesson } = req.body;

    if (!slug || !title || !topics || !lesson) {
      res.status(400).json({ error: "Slug, title, topics, dan lesson wajib diisi" });
      return;
    }

    const existing = await prisma.module.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ error: "Slug modul sudah digunakan" });
      return;
    }

    const mod = await prisma.module.create({
      data: { slug, title, topics, order: order ?? 0, lesson },
    });

    res.status(201).json({ module: mod });
  } catch (err) {
    console.error("Create module error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// PUT /api/modules/:id — Update module (Admin only)
router.put("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { title, topics, order, lesson } = req.body;

    const mod = await prisma.module.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(topics && { topics }),
        ...(order !== undefined && { order }),
        ...(lesson && { lesson }),
      },
    });

    res.json({ module: mod });
  } catch (err) {
    console.error("Update module error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// DELETE /api/modules/:id — Delete module (Admin only)
router.delete("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    await prisma.module.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete module error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/modules/:id/quizzes — Add quiz to module (Admin only)
router.post("/:id/quizzes", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { question, options, answer, explanation, difficulty, order } = req.body;

    if (!question || !options || answer === undefined || !explanation || !difficulty) {
      res.status(400).json({ error: "Semua field quiz wajib diisi" });
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        moduleId: req.params.id,
        question,
        options,
        answer,
        explanation,
        difficulty,
        order: order ?? 0,
      },
    });

    res.status(201).json({ quiz });
  } catch (err) {
    console.error("Create quiz error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// PUT /api/modules/:id/quizzes/:qid — Update quiz (Admin only)
router.put("/:id/quizzes/:qid", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { question, options, answer, explanation, difficulty, order } = req.body;

    const quiz = await prisma.quiz.update({
      where: { id: req.params.qid },
      data: {
        ...(question && { question }),
        ...(options && { options }),
        ...(answer !== undefined && { answer }),
        ...(explanation && { explanation }),
        ...(difficulty && { difficulty }),
        ...(order !== undefined && { order }),
      },
    });

    res.json({ quiz });
  } catch (err) {
    console.error("Update quiz error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// DELETE /api/modules/:id/quizzes/:qid — Delete quiz (Admin only)
router.delete("/:id/quizzes/:qid", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    await prisma.quiz.delete({ where: { id: req.params.qid } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete quiz error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default router;
