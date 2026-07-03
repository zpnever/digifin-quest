import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/admin/users — List all students with progress
router.get("/users", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true, name: true, email: true, points: true, streak: true, joinedAt: true,
        _count: {
          select: {
            completedLessons: true,
            quizScores: true,
            badges: true,
            scenarioResults: true,
          },
        },
      },
      orderBy: { points: "desc" },
    });

    res.json({ users });
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// GET /api/admin/analytics — Aggregated analytics
router.get("/analytics", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    const totalModules = await prisma.module.count();

    const avgPoints = await prisma.user.aggregate({
      where: { role: "STUDENT" },
      _avg: { points: true },
    });

    const completionCounts = await prisma.completedLesson.groupBy({
      by: ["moduleId"],
      _count: true,
    });

    const quizAverages = await prisma.quizScore.groupBy({
      by: ["moduleId"],
      _avg: { pct: true },
      _count: true,
    });

    const modules = await prisma.module.findMany({
      orderBy: { order: "asc" },
      select: { id: true, slug: true, title: true },
    });

    const moduleStats = modules.map((m) => {
      const completion = completionCounts.find((c) => c.moduleId === m.id);
      const quiz = quizAverages.find((q) => q.moduleId === m.id);
      return {
        ...m,
        completions: completion?._count ?? 0,
        avgQuizPct: Math.round(quiz?._avg?.pct ?? 0),
        quizAttempts: quiz?._count ?? 0,
      };
    });

    res.json({
      analytics: {
        totalStudents,
        totalModules,
        avgPoints: Math.round(avgPoints._avg.points ?? 0),
        completionRate: totalStudents > 0 && totalModules > 0
          ? Math.round((completionCounts.length / totalModules) * 100)
          : 0,
        moduleStats,
      },
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// GET /api/admin/leaderboard — Leaderboard data
router.get("/leaderboard", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, points: true },
      orderBy: { points: "desc" },
      take: 20,
    });

    res.json({ leaderboard: users });
  } catch (err) {
    console.error("Admin leaderboard error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// GET /api/admin/export/csv — Download CSV report
router.get("/export/csv", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        completedLessons: true,
        quizScores: true,
        badges: true,
        scenarioResults: true,
        simResult: true,
      },
      orderBy: { points: "desc" },
    });

    const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });

    const header = [
      "name", "email", "points", "streak",
      "modules_completed", "avg_quiz_pct",
      "scenarios_played", "sim_completed", "sim_pct", "sim_passed",
      ...modules.map((m) => `quiz_${m.slug}`),
    ];

    const rows = users.map((u) => {
      const quizMap: Record<string, number> = {};
      for (const qs of u.quizScores) quizMap[qs.moduleId] = qs.pct;
      const avgQuiz = u.quizScores.length
        ? Math.round(u.quizScores.reduce((a, s) => a + s.pct, 0) / u.quizScores.length)
        : 0;

      return [
        u.name, u.email, u.points, u.streak,
        u.completedLessons.length, avgQuiz,
        u.scenarioResults.length,
        u.simResult ? 1 : 0,
        u.simResult?.pct ?? "",
        u.simResult ? (u.simResult.passed ? 1 : 0) : "",
        ...modules.map((m) => quizMap[m.id] ?? ""),
      ].join(",");
    });

    const csv = [header.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=digifinquest_report.csv");
    res.send(csv);
  } catch (err) {
    console.error("Admin export error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default router;
