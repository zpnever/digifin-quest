import bcrypt from "bcryptjs";
import { prisma } from "./db";
import {
  BADGES,
  DAILY_CHALLENGES,
  LEVELS,
  MODULES,
  POINTS,
  SCENARIOS,
  SEED_PEERS,
  SIM_EVENTS,
} from "./seedData";

async function seedModules() {
  for (const [moduleIndex, module] of MODULES.entries()) {
    await prisma.module.upsert({
      where: { id: module.id },
      update: {
        title: module.title,
        topics: module.topics,
        intro: module.lesson.intro,
        example: module.lesson.example,
        takeaways: module.lesson.takeaways,
        order: moduleIndex,
        published: true,
      },
      create: {
        id: module.id,
        title: module.title,
        topics: module.topics,
        intro: module.lesson.intro,
        example: module.lesson.example,
        takeaways: module.lesson.takeaways,
        order: moduleIndex,
        published: true,
      },
    });

    await prisma.lessonSection.deleteMany({ where: { moduleId: module.id } });
    await prisma.quizQuestion.deleteMany({ where: { moduleId: module.id } });

    for (const [sectionIndex, section] of module.lesson.sections.entries()) {
      await prisma.lessonSection.create({
        data: {
          moduleId: module.id,
          heading: section.h,
          body: section.b,
          order: sectionIndex,
        },
      });
    }

    for (const [questionIndex, question] of module.quiz.entries()) {
      await prisma.quizQuestion.create({
        data: {
          moduleId: module.id,
          question: question.q,
          options: question.options,
          answer: question.answer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          order: questionIndex,
        },
      });
    }
  }
}

async function seedReferenceData() {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: { name: badge.name, desc: badge.desc, icon: badge.icon },
      create: badge,
    });
  }

  for (const level of LEVELS) {
    await prisma.level.upsert({
      where: { lvl: level.lvl },
      update: { name: level.name, min: level.min },
      create: level,
    });
  }

  for (const [key, value] of Object.entries(POINTS)) {
    await prisma.pointRule.upsert({
      where: { key },
      update: { value: Number(value) },
      create: { key, value: Number(value) },
    });
  }

  await prisma.pointRule.upsert({
    where: { key: "scenarioSafe" },
    update: { value: 25 },
    create: { key: "scenarioSafe", value: 25 },
  });
  await prisma.pointRule.upsert({
    where: { key: "scenarioPartial" },
    update: { value: 10 },
    create: { key: "scenarioPartial", value: 10 },
  });
  await prisma.pointRule.upsert({
    where: { key: "simulationPass" },
    update: { value: 100 },
    create: { key: "simulationPass", value: 100 },
  });

  for (const challenge of DAILY_CHALLENGES) {
    await prisma.dailyChallenge.upsert({
      where: { id: challenge.id },
      update: { text: challenge.text },
      create: { id: challenge.id, text: challenge.text },
    });
  }

  await prisma.seedPeer.deleteMany();
  await prisma.seedPeer.createMany({ data: SEED_PEERS });
}

async function seedScenarioData() {
  for (const [order, scenario] of SCENARIOS.entries()) {
    await prisma.scenario.upsert({
      where: { id: scenario.id },
      update: {
        theme: scenario.theme,
        situation: scenario.situation,
        choices: scenario.choices,
        order,
      },
      create: {
        id: scenario.id,
        theme: scenario.theme,
        situation: scenario.situation,
        choices: scenario.choices,
        order,
      },
    });
  }

  for (const [order, event] of SIM_EVENTS.entries()) {
    await prisma.simulationEvent.upsert({
      where: { id: event.id },
      update: {
        theme: event.theme,
        icon: event.icon,
        text: event.text,
        choices: event.choices,
        order,
      },
      create: {
        id: event.id,
        theme: event.theme,
        icon: event.icon,
        text: event.text,
        choices: event.choices,
        order,
      },
    });
  }
}

async function seedDemoUsers() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const today = new Date().toDateString();
  const users = [
    { email: "student@digifin.local", name: "Student Demo", role: "student" },
    { email: "admin@digifin.local", name: "Lecturer Demo", role: "admin" },
  ];

  for (const user of users) {
    const saved = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: { ...user, passwordHash },
    });
    await prisma.userProgress.upsert({
      where: { userId: saved.id },
      update: {},
      create: { userId: saved.id, lastLoginDay: today, joined: today },
    });
  }
}

async function main() {
  await seedModules();
  await seedReferenceData();
  await seedScenarioData();
  await seedDemoUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
