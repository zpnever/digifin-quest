import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/progress — Get full progress for current user
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    const [user, completedLessons, quizScores, badges, claimedChallenges, scenarioResults, simResult] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { points: true, streak: true, lastLoginDay: true, todayLessons: true, joinedAt: true },
        }),
        prisma.completedLesson.findMany({ where: { userId }, select: { moduleId: true } }),
        prisma.quizScore.findMany({ where: { userId }, select: { moduleId: true, correct: true, total: true, pct: true } }),
        prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
        prisma.claimedChallenge.findMany({ where: { userId }, select: { challengeId: true } }),
        prisma.scenarioResult.findMany({ where: { userId }, select: { scenarioId: true, choiceIndex: true, quality: true } }),
        prisma.simulationResult.findUnique({ where: { userId } }),
      ]);

    // Transform to frontend-friendly shape
    const completedLessonsMap: Record<string, boolean> = {};
    for (const cl of completedLessons) completedLessonsMap[cl.moduleId] = true;

    const quizScoresMap: Record<string, { correct: number; total: number; pct: number }> = {};
    for (const qs of quizScores) quizScoresMap[qs.moduleId] = { correct: qs.correct, total: qs.total, pct: qs.pct };

    const scenarioResultsMap: Record<string, { choiceIndex: number; quality: number }> = {};
    for (const sr of scenarioResults) scenarioResultsMap[sr.scenarioId] = { choiceIndex: sr.choiceIndex, quality: sr.quality };

    res.json({
      progress: {
        completedLessons: completedLessonsMap,
        quizScores: quizScoresMap,
        points: user?.points ?? 0,
        badges: badges.map((b) => b.badgeId),
        streak: user?.streak ?? 1,
        lastLoginDay: user?.lastLoginDay ?? null,
        todayLessons: user?.todayLessons ?? 0,
        claimedChallenges: claimedChallenges.map((c) => c.challengeId),
        joined: user?.joinedAt?.toDateString() ?? new Date().toDateString(),
        scenarioResults: scenarioResultsMap,
        simResult: simResult
          ? { balance: simResult.balance, saving: simResult.saving, avgQuality: simResult.avgQuality, pct: simResult.pct, passed: simResult.passed }
          : null,
      },
    });
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/progress/lessons/:moduleId — Mark lesson complete
router.post("/lessons/:moduleId", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { moduleId } = req.params;

    // Check if already completed
    const existing = await prisma.completedLesson.findUnique({
      where: { userId_moduleId: { userId, moduleId } },
    });

    if (existing) {
      res.json({ alreadyCompleted: true });
      return;
    }

    await prisma.completedLesson.create({ data: { userId, moduleId } });

    // Award points + explorer badge
    const pointsToAdd = 30; // POINTS.lessonComplete
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: pointsToAdd },
        todayLessons: { increment: 1 },
      },
    });

    // Award explorer badge (first lesson completed)
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: "explorer" } },
      create: { userId, badgeId: "explorer" },
      update: {},
    });

    res.json({ success: true, pointsAdded: pointsToAdd });
  } catch (err) {
    console.error("Complete lesson error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/progress/quizzes/:moduleId — Submit quiz score
router.post("/quizzes/:moduleId", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { moduleId } = req.params;
    const { correct, total } = req.body;

    if (correct === undefined || total === undefined) {
      res.status(400).json({ error: "correct dan total wajib diisi" });
      return;
    }

    const pct = Math.round((correct / total) * 100);
    const pointsToAdd = correct * 15; // POINTS.quizPassPerCorrect

    // Get existing score
    const existing = await prisma.quizScore.findUnique({
      where: { userId_moduleId: { userId, moduleId } },
      select: { pct: true },
    });

    // Only update if no existing score or new score is higher
    if (!existing || pct > existing.pct) {
      await prisma.quizScore.upsert({
        where: { userId_moduleId: { userId, moduleId } },
        create: { userId, moduleId, correct, total, pct },
        update: { correct, total, pct },
      });
    }

    // Award points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } },
    });

    // Award module-specific badges
    const badgeMap: Record<string, string> = {};
    // We need to find module slug for badge mapping
    const mod = await prisma.module.findUnique({ where: { id: moduleId }, select: { slug: true } });
    if (mod) {
      const slugBadgeMap: Record<string, string> = {
        m3: "saver",
        m4: "borrower",
        m5: "guardian",
        m6: "advocate",
      };
      const badgeId = slugBadgeMap[mod.slug];
      if (badgeId && pct >= 60) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId, badgeId } },
          create: { userId, badgeId },
          update: {},
        });
      }
    }

    // Perfect score badge
    if (pct === 100) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: "perfect" } },
        create: { userId, badgeId: "perfect" },
        update: {},
      });
    }

    res.json({ success: true, pct, pointsAdded: pointsToAdd });
  } catch (err) {
    console.error("Submit quiz error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/progress/challenges/:id — Claim daily challenge
router.post("/challenges/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const challengeId = req.params.id;

    const existing = await prisma.claimedChallenge.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    });

    if (existing) {
      res.json({ alreadyClaimed: true });
      return;
    }

    await prisma.claimedChallenge.create({ data: { userId, challengeId } });

    const pointsToAdd = 40; // POINTS.challenge
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } },
    });

    res.json({ success: true, pointsAdded: pointsToAdd });
  } catch (err) {
    console.error("Claim challenge error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/progress/scenarios/:scenarioId — Record scenario result
router.post("/scenarios/:scenarioId", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { scenarioId } = req.params;
    const { choiceIndex, quality } = req.body;

    if (choiceIndex === undefined || quality === undefined) {
      res.status(400).json({ error: "choiceIndex dan quality wajib diisi" });
      return;
    }

    const existing = await prisma.scenarioResult.findUnique({
      where: { userId_scenarioId: { userId, scenarioId } },
    });

    if (existing) {
      res.json({ alreadyRecorded: true });
      return;
    }

    await prisma.scenarioResult.create({
      data: { userId, scenarioId, choiceIndex, quality },
    });

    // Points: safe=25, medium=10, risky=0
    const reward = quality === 2 ? 25 : quality === 1 ? 10 : 0;
    if (reward > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: reward } },
      });
    }

    res.json({ success: true, pointsAdded: reward });
  } catch (err) {
    console.error("Record scenario error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/progress/simulation — Save simulation result
router.post("/simulation", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { balance, saving, avgQuality, pct, passed, choicesLog } = req.body;

    // Upsert: keep best result
    const existing = await prisma.simulationResult.findUnique({ where: { userId } });

    if (!existing || pct > existing.pct) {
      await prisma.simulationResult.upsert({
        where: { userId },
        create: { userId, balance, saving, avgQuality, pct, passed, choicesLog: choicesLog ?? null },
        update: { balance, saving, avgQuality, pct, passed, choicesLog: choicesLog ?? null },
      });
    }

    // Bonus points on first pass
    if (passed && (!existing || !existing.passed)) {
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: 100 } },
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Save simulation error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default router;
