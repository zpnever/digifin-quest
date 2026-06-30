import { prisma } from "./db";

export const pointRules = {
  lessonComplete: 30,
  quizPassPerCorrect: 15,
  dailyLogin: 20,
  challenge: 40,
  scenarioSafe: 25,
  scenarioPartial: 10,
  simulationPass: 100,
};

export function dayKey(date = new Date()) {
  return date.toDateString();
}

export async function ensureProgress(userId: string) {
  const today = dayKey();
  return prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId, lastLoginDay: today, joined: today },
  });
}

export async function addPointsOnce(userId: string, source: string, sourceId: string, points: number) {
  try {
    await prisma.pointLedger.create({ data: { userId, source, sourceId, points } });
    await prisma.userProgress.update({ where: { userId }, data: { points: { increment: points } } });
    return points;
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") return 0;
    throw error;
  }
}

export async function awardBadge(userId: string, badgeId: string) {
  try {
    await prisma.badgeAward.create({ data: { userId, badgeId } });
    return badgeId;
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") return null;
    throw error;
  }
}

export async function recordLogin(userId: string) {
  const progress = await ensureProgress(userId);
  const today = dayKey();
  if (progress.lastLoginDay === today) return { pointsAwarded: 0, badgesAwarded: [] as string[] };

  const yesterday = dayKey(new Date(Date.now() - 86400000));
  const streak = progress.lastLoginDay === yesterday ? progress.streak + 1 : 1;
  await prisma.userProgress.update({
    where: { userId },
    data: { lastLoginDay: today, streak, todayLessons: 0 },
  });

  const pointsAwarded = await addPointsOnce(userId, "daily-login", today, pointRules.dailyLogin);
  const badgesAwarded: string[] = [];
  if (streak >= 5) {
    const badge = await awardBadge(userId, "streak5");
    if (badge) badgesAwarded.push(badge);
  }
  return { pointsAwarded, badgesAwarded };
}

function sanitizeQuestion(q: {
  id: string;
  question: string;
  options: unknown;
  explanation: string;
  difficulty: string;
  order: number;
}) {
  return {
    id: q.id,
    q: q.question,
    options: q.options,
    explanation: q.explanation,
    difficulty: q.difficulty,
    order: q.order,
  };
}

export async function getModules({ includeAnswers = false } = {}) {
  const modules = await prisma.module.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      sections: { orderBy: { order: "asc" } },
      quizQuestions: { orderBy: { order: "asc" } },
    },
  });

  return modules.map((m) => ({
    id: m.id,
    title: m.title,
    topics: m.topics,
    lesson: {
      intro: m.intro,
      sections: m.sections.map((s) => ({ h: s.heading, b: s.body })),
      example: m.example,
      takeaways: m.takeaways,
    },
    quiz: m.quizQuestions.map((q) => ({
      ...sanitizeQuestion(q),
      ...(includeAnswers ? { answer: q.answer } : {}),
    })),
  }));
}

export async function getProgressPayload(userId: string) {
  await ensureProgress(userId);
  const [progress, lessons, scores, awards, claims, scenarios, sim] = await Promise.all([
    prisma.userProgress.findUniqueOrThrow({ where: { userId } }),
    prisma.completedLesson.findMany({ where: { userId } }),
    prisma.quizScore.findMany({ where: { userId } }),
    prisma.badgeAward.findMany({ where: { userId } }),
    prisma.dailyChallengeClaim.findMany({ where: { userId } }),
    prisma.scenarioAttempt.findMany({ where: { userId } }),
    prisma.simulationResult.findUnique({ where: { userId } }),
  ]);

  return {
    completedLessons: Object.fromEntries(lessons.map((l) => [l.moduleId, true])),
    quizScores: Object.fromEntries(scores.map((s) => [s.moduleId, { correct: s.correct, total: s.total, pct: s.pct }])),
    points: progress.points,
    badges: awards.map((a) => a.badgeId),
    streak: progress.streak,
    lastLoginDay: progress.lastLoginDay,
    todayLessons: progress.todayLessons,
    claimedChallenges: claims.map((c) => c.challengeId),
    joined: progress.joined,
    scenarioResults: Object.fromEntries(scenarios.map((s) => [s.scenarioId, { choiceIndex: s.choiceIndex, quality: s.quality }])),
    simResult: sim
      ? {
          balance: sim.balance,
          saving: sim.saving,
          avgQuality: sim.avgQuality,
          pct: sim.pct,
          passed: sim.passed,
        }
      : null,
  };
}

export async function getDashboardPayload(userId: string) {
  const [progress, modules, badges, levels, pointRows, challenges, leaderboard] = await Promise.all([
    getProgressPayload(userId),
    getModules(),
    prisma.badge.findMany({ orderBy: { id: "asc" } }),
    prisma.level.findMany({ orderBy: { min: "asc" } }),
    prisma.pointRule.findMany(),
    prisma.dailyChallenge.findMany({ orderBy: { id: "asc" } }),
    getLeaderboard(userId),
  ]);

  return {
    progress,
    modules,
    badges,
    levels,
    points: Object.fromEntries(pointRows.map((p) => [p.key, p.value])),
    challenges,
    leaderboard,
  };
}

export async function getLeaderboard(currentUserId?: string) {
  const [users, peers] = await Promise.all([
    prisma.user.findMany({
      where: { role: "student" },
      select: { id: true, name: true, progress: { select: { points: true } } },
    }),
    prisma.seedPeer.findMany(),
  ]);
  return [
    ...peers.map((p) => ({ name: p.name, points: p.points, self: false })),
    ...users.map((u) => ({ name: u.name, points: u.progress?.points ?? 0, self: currentUserId === u.id })),
  ].sort((a, b) => b.points - a.points);
}

export function inferTopic(module: { topics: string[] }, q: { q: string; options: string[] }) {
  const text = (q.q + " " + q.options.join(" ")).toLowerCase();
  let best = module.topics[0];
  let bestScore = -1;
  for (const t of module.topics) {
    const words = t.toLowerCase().split(/[\s/]+/);
    const score = words.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return best;
}
