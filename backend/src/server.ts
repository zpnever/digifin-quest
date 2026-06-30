import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import { z } from "zod";
import { requireAdmin, requireAuth, signToken } from "./auth";
import { prisma } from "./db";
import {
  addPointsOnce,
  awardBadge,
  ensureProgress,
  getDashboardPayload,
  getLeaderboard,
  getModules,
  getProgressPayload,
  inferTopic,
  pointRules,
  recordLogin,
} from "./progress";
import { SIM_START_BALANCE } from "./seedData";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
  role: z.enum(["student", "admin"]).optional(),
});

function publicUser(user: { id: string; email: string; name: string; role: string }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

async function authResponse(user: { id: string; email: string; name: string; role: string }) {
  await ensureProgress(user.id);
  await recordLogin(user.id);
  return {
    token: signToken(publicUser(user)),
    user: publicUser(user),
    dashboard: await getDashboardPayload(user.id),
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const data = authSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name || data.email.split("@")[0],
        role: data.role || "student",
        passwordHash,
      },
      select: { id: true, email: true, name: true, role: true },
    });
    res.status(201).json(await authResponse(user));
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const data = authSchema.pick({ email: true, password: true }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return res.status(401).json({ error: "Email atau password salah" });
    }
    res.json(await authResponse(user));
  } catch (error) {
    next(error);
  }
});

app.get("/api/me", requireAuth, async (req, res) => {
  res.json({ user: req.user, dashboard: await getDashboardPayload(req.user!.id) });
});

app.get("/api/modules", async (_req, res) => {
  res.json({ modules: await getModules() });
});

app.get("/api/modules/:id", async (req, res) => {
  const modules = await getModules();
  const moduleId = String(req.params.id);
  const module = modules.find((m) => m.id === moduleId);
  if (!module) return res.status(404).json({ error: "Module not found" });
  res.json({ module });
});

app.get("/api/progress/me", requireAuth, async (req, res) => {
  res.json({ progress: await getProgressPayload(req.user!.id) });
});

app.post("/api/progress/lessons/:moduleId/complete", requireAuth, async (req, res, next) => {
  try {
    const moduleId = String(req.params.moduleId);
    const module = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) return res.status(404).json({ error: "Module not found" });

    const existing = await prisma.completedLesson.findUnique({
      where: { userId_moduleId: { userId: req.user!.id, moduleId: module.id } },
    });
    if (!existing) {
      await prisma.completedLesson.create({ data: { userId: req.user!.id, moduleId: module.id } });
      await prisma.userProgress.update({
        where: { userId: req.user!.id },
        data: { todayLessons: { increment: 1 } },
      });
      await addPointsOnce(req.user!.id, "lesson", module.id, pointRules.lessonComplete);
      await awardBadge(req.user!.id, "explorer");
    }

    res.json({ progress: await getProgressPayload(req.user!.id) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/quizzes/:moduleId/submit", requireAuth, async (req, res, next) => {
  try {
    const schema = z.object({ answers: z.record(z.string(), z.number().int().min(0)) });
    const { answers } = schema.parse(req.body);
    const moduleId = String(req.params.moduleId);
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { quizQuestions: { orderBy: { order: "asc" } } },
    }) as any;
    if (!module) return res.status(404).json({ error: "Module not found" });

    const total = module.quizQuestions.length;
    const correct = module.quizQuestions.reduce((sum, q, index) => sum + (answers[String(index)] === q.answer ? 1 : 0), 0);
    const pct = Math.round((correct / total) * 100);
    const previous = await prisma.quizScore.findUnique({
      where: { userId_moduleId: { userId: req.user!.id, moduleId: module.id } },
    });

    await prisma.quizAttempt.create({
      data: { userId: req.user!.id, moduleId: module.id, answers, correct, total, pct },
    });
    await prisma.quizScore.upsert({
      where: { userId_moduleId: { userId: req.user!.id, moduleId: module.id } },
      update: pct >= (previous?.pct ?? -1) ? { correct, total, pct } : {},
      create: { userId: req.user!.id, moduleId: module.id, correct, total, pct },
    });

    const pointsAwarded = await addPointsOnce(
      req.user!.id,
      "quiz-best",
      `${module.id}:${correct}`,
      correct * pointRules.quizPassPerCorrect,
    );
    const badgesAwarded = [];
    const moduleBadge: Record<string, string> = { m3: "saver", m4: "borrower", m5: "guardian", m6: "advocate" };
    if (pct >= 60 && moduleBadge[module.id]) {
      const badge = await awardBadge(req.user!.id, moduleBadge[module.id]);
      if (badge) badgesAwarded.push(badge);
    }
    if (pct === 100) {
      const badge = await awardBadge(req.user!.id, "perfect");
      if (badge) badgesAwarded.push(badge);
    }

    const publicModule = {
      id: module.id,
      topics: module.topics as string[],
    };
    const explanations = module.quizQuestions.map((q, index) => ({
      index,
      correctAnswer: q.answer,
      explanation: q.explanation,
      correct: answers[String(index)] === q.answer,
    }));
    const weakTopicCounts = new Map<string, number>();
    module.quizQuestions.forEach((q, index) => {
      if (answers[String(index)] !== q.answer) {
        const topic = inferTopic(publicModule, { q: q.question, options: q.options as string[] });
        weakTopicCounts.set(topic, (weakTopicCounts.get(topic) || 0) + 1);
      }
    });

    res.json({
      correct,
      total,
      pct,
      explanations,
      weakTopics: [...weakTopicCounts.entries()].sort((a, b) => b[1] - a[1]),
      pointsAwarded,
      badgesAwarded,
      progress: await getProgressPayload(req.user!.id),
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/leaderboard", requireAuth, async (req, res) => {
  res.json({ leaderboard: await getLeaderboard(req.user!.id) });
});

app.get("/api/scenarios", async (_req, res) => {
  const scenarios = await prisma.scenario.findMany({ orderBy: { order: "asc" } });
  res.json({ scenarios });
});

app.post("/api/scenarios/:id/answer", requireAuth, async (req, res, next) => {
  try {
    const { choiceIndex } = z.object({ choiceIndex: z.number().int().min(0) }).parse(req.body);
    const scenarioId = String(req.params.id);
    const scenario = await prisma.scenario.findUnique({ where: { id: scenarioId } });
    if (!scenario) return res.status(404).json({ error: "Scenario not found" });
    const choices = scenario.choices as Array<{ quality: number; outcome: string }>;
    const choice = choices[choiceIndex];
    if (!choice) return res.status(400).json({ error: "Invalid choice" });

    const existing = await prisma.scenarioAttempt.findUnique({
      where: { userId_scenarioId: { userId: req.user!.id, scenarioId: scenario.id } },
    });
    if (!existing) {
      await prisma.scenarioAttempt.create({
        data: { userId: req.user!.id, scenarioId: scenario.id, choiceIndex, quality: choice.quality },
      });
      const reward = choice.quality === 2 ? pointRules.scenarioSafe : choice.quality === 1 ? pointRules.scenarioPartial : 0;
      if (reward) await addPointsOnce(req.user!.id, "scenario", scenario.id, reward);
    }

    res.json({ choice, progress: await getProgressPayload(req.user!.id) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/simulation", async (_req, res) => {
  const events = await prisma.simulationEvent.findMany({ orderBy: { order: "asc" } });
  res.json({ startBalance: SIM_START_BALANCE, events });
});

app.post("/api/simulation/finish", requireAuth, async (req, res, next) => {
  try {
    const { answers } = z.object({ answers: z.array(z.number().int().min(0)) }).parse(req.body);
    const events = await prisma.simulationEvent.findMany({ orderBy: { order: "asc" } });
    if (answers.length !== events.length) return res.status(400).json({ error: "All simulation answers are required" });

    let balance = SIM_START_BALANCE;
    let saving = 0;
    const qualities: number[] = [];
    events.forEach((event, index) => {
      const choice = (event.choices as Array<{ quality: number; dBalance: number; dSaving: number }>)[answers[index]];
      if (!choice) throw new Error("Invalid simulation choice");
      balance += choice.dBalance;
      saving += choice.dSaving;
      qualities.push(choice.quality);
    });
    const avgQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
    const pct = Math.round((avgQuality / 2) * 100);
    const passed = pct >= 60 && balance >= 0;

    const previous = await prisma.simulationResult.findUnique({ where: { userId: req.user!.id } });
    const isBetter = pct > (previous?.pct ?? -1);
    const firstPass = passed && !previous?.passed;
    if (!previous || isBetter) {
      await prisma.simulationResult.upsert({
        where: { userId: req.user!.id },
        update: { balance, saving, avgQuality, pct, passed, answers },
        create: { userId: req.user!.id, balance, saving, avgQuality, pct, passed, answers },
      });
    }
    if (firstPass) await addPointsOnce(req.user!.id, "simulation-pass", "final", pointRules.simulationPass);

    res.json({
      result: { balance, saving, avgQuality, pct, passed },
      progress: await getProgressPayload(req.user!.id),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/challenges/:id/claim", requireAuth, async (req, res, next) => {
  try {
    const challengeId = String(req.params.id);
    const challenge = await prisma.dailyChallenge.findUnique({ where: { id: challengeId } });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    const progress = await getProgressPayload(req.user!.id);
    const bestQuizPct = Math.max(0, ...Object.values(progress.quizScores).map((s) => s.pct));
    const eligible =
      challenge.id === "c1"
        ? progress.todayLessons >= 1
        : challenge.id === "c2"
          ? bestQuizPct >= 80
          : challenge.id === "c3"
            ? progress.streak >= 5
            : false;
    if (!eligible) return res.status(400).json({ error: "Challenge not completed yet" });

    await prisma.dailyChallengeClaim.upsert({
      where: { userId_challengeId: { userId: req.user!.id, challengeId: challenge.id } },
      update: {},
      create: { userId: req.user!.id, challengeId: challenge.id },
    });
    await addPointsOnce(req.user!.id, "challenge", challenge.id, pointRules.challenge);
    res.json({ progress: await getProgressPayload(req.user!.id) });
  } catch (error) {
    next(error);
  }
});

async function adminAnalyticsPayload() {
  const users = await prisma.user.findMany({
    where: { role: "student" },
    include: {
      progress: true,
      quizScores: true,
      completedLessons: true,
      badgeAwards: true,
      scenarioAttempts: true,
      simulationResult: true,
    },
  });
  const totalUsers = users.length;
  const avgPoints = totalUsers
    ? Math.round(users.reduce((sum, user) => sum + (user.progress?.points ?? 0), 0) / totalUsers)
    : 0;
  const moduleCount = await prisma.module.count({ where: { published: true } });
  const completionRate = totalUsers
    ? Math.round((users.reduce((sum, user) => sum + user.completedLessons.length, 0) / (totalUsers * moduleCount)) * 100)
    : 0;
  return { totalUsers, avgPoints, completionRate, users };
}

app.get("/api/admin/analytics", requireAuth, requireAdmin, async (_req, res) => {
  const payload = await adminAnalyticsPayload();
  res.json({
    totalUsers: payload.totalUsers,
    avgPoints: payload.avgPoints,
    completionRate: payload.completionRate,
    users: payload.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      points: user.progress?.points ?? 0,
      quizzes: user.quizScores,
      completed: user.completedLessons.length,
      badges: user.badgeAwards.length,
      scenarios: user.scenarioAttempts.length,
      simulation: user.simulationResult,
    })),
  });
});

app.get("/api/admin/export.csv", requireAuth, requireAdmin, async (_req, res) => {
  const payload = await adminAnalyticsPayload();
  const rows = [
    ["name", "email", "points", "modules_completed", "badges", "scenarios_played", "sim_pct", "sim_passed"],
    ...payload.users.map((user) => [
      user.name,
      user.email,
      String(user.progress?.points ?? 0),
      String(user.completedLessons.length),
      String(user.badgeAwards.length),
      String(user.scenarioAttempts.length),
      String(user.simulationResult?.pct ?? ""),
      String(user.simulationResult?.passed ?? ""),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  res.header("content-type", "text/csv; charset=utf-8");
  res.attachment("digifinquest_report.csv");
  res.send(csv);
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues[0]?.message || "Invalid input" });
  if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
    return res.status(409).json({ error: "Data already exists" });
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`DigiFin Quest API listening on http://localhost:${port}`);
  });
}

export { app };
