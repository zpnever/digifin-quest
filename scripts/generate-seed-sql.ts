import fs from "fs";
import path from "path";
import bcrypt from "../server/node_modules/bcryptjs/index.js";
import crypto from "crypto";

// We can read and evaluate the data from seed.ts or define the generator
async function run() {
  console.log("Generating seed.sql from server/prisma/seed.ts data...");

  // Generate bcrypt hashes
  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash("student123", 10);

  // We can load seed.ts source and extract modulesData, scenarios, simEvents
  const seedSource = fs.readFileSync(path.resolve("server/prisma/seed.ts"), "utf-8");

  // Let's create an evaluation sandbox or extract objects
  // In seed.ts: modulesData starts at 'const modulesData =' and ends before 'for (const mod of modulesData)'
  const modDataMatch = seedSource.match(/const modulesData\s*=\s*(\[[\s\S]*?\]);\s*for\s*\(const mod of modulesData\)/);
  if (!modDataMatch) throw new Error("Could not extract modulesData from seed.ts");

  const scenariosMatch = seedSource.match(/const scenarios\s*=\s*(\[[\s\S]*?\]);\s*for\s*\(const sc of scenarios\)/);
  if (!scenariosMatch) throw new Error("Could not extract scenarios from seed.ts");

  const simEventsMatch = seedSource.match(/const simEvents\s*=\s*(\[[\s\S]*?\]);\s*for\s*\(const ev of simEvents\)/);
  if (!simEventsMatch) throw new Error("Could not extract simEvents from seed.ts");

  // Safe eval of JS objects
  const modulesData = eval(modDataMatch[1]);
  const scenarios = eval(scenariosMatch[1]);
  const simEvents = eval(simEventsMatch[1]);

  const peers = [
    { name: "Ayu P.", email: "ayu@student.ac.id", points: 1240 },
    { name: "Budi S.", email: "budi@student.ac.id", points: 980 },
    { name: "Citra W.", email: "citra@student.ac.id", points: 760 },
    { name: "Dewi R.", email: "dewi@student.ac.id", points: 540 },
    { name: "Eko H.", email: "eko@student.ac.id", points: 410 },
    { name: "Fitri N.", email: "fitri@student.ac.id", points: 300 },
  ];

  function escapeSql(str: string): string {
    return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
  }

  let sql = `-- =======================================================
-- DigiFin Quest — Initial Seed Data for MySQL
-- Password Admin default: admin123
-- Password Mahasiswa default: student123
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE \`simulation_results\`;
TRUNCATE TABLE \`sim_events\`;
TRUNCATE TABLE \`scenario_results\`;
TRUNCATE TABLE \`scenarios\`;
TRUNCATE TABLE \`claimed_challenges\`;
TRUNCATE TABLE \`user_badges\`;
TRUNCATE TABLE \`quiz_scores\`;
TRUNCATE TABLE \`completed_lessons\`;
TRUNCATE TABLE \`quizzes\`;
TRUNCATE TABLE \`modules\`;
TRUNCATE TABLE \`users\`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. SEED ADMIN USER
INSERT INTO \`users\` (\`id\`, \`email\`, \`name\`, \`password\`, \`role\`, \`points\`, \`streak\`, \`todayLessons\`, \`joinedAt\`, \`updatedAt\`) VALUES
('${crypto.randomUUID()}', 'admin@digifinquest.ac.id', 'Admin DigiFin', '${adminHash}', 'ADMIN', 0, 1, 0, NOW(), NOW());

-- 2. SEED SAMPLE STUDENTS
INSERT INTO \`users\` (\`id\`, \`email\`, \`name\`, \`password\`, \`role\`, \`points\`, \`streak\`, \`todayLessons\`, \`joinedAt\`, \`updatedAt\`) VALUES
`;

  const peerValues = peers.map(p => {
    return `('${crypto.randomUUID()}', '${escapeSql(p.email)}', '${escapeSql(p.name)}', '${studentHash}', 'STUDENT', ${p.points}, 1, 0, NOW(), NOW())`;
  });
  sql += peerValues.join(",\n") + ";\n\n";

  // 3. SEED MODULES & QUIZZES
  sql += `-- 3. SEED MODULES & QUIZZES\n`;

  for (const mod of modulesData) {
    const moduleId = crypto.randomUUID();
    const topicsJson = JSON.stringify(mod.topics);
    const lessonJson = JSON.stringify(mod.lesson);

    sql += `INSERT INTO \`modules\` (\`id\`, \`slug\`, \`title\`, \`topics\`, \`order_num\`, \`lesson\`) VALUES\n`;
    sql += `('${moduleId}', '${escapeSql(mod.slug)}', '${escapeSql(mod.title)}', '${escapeSql(topicsJson)}', ${mod.order}, '${escapeSql(lessonJson)}');\n\n`;

    if (mod.quizzes && mod.quizzes.length > 0) {
      sql += `INSERT INTO \`quizzes\` (\`id\`, \`moduleId\`, \`question\`, \`options\`, \`answer\`, \`explanation\`, \`difficulty\`, \`order_num\`) VALUES\n`;
      const quizVals = mod.quizzes.map((q: any, idx: number) => {
        const qId = crypto.randomUUID();
        const optionsJson = JSON.stringify(q.options);
        return `('${qId}', '${moduleId}', '${escapeSql(q.question)}', '${escapeSql(optionsJson)}', ${q.answer}, '${escapeSql(q.explanation)}', '${escapeSql(q.difficulty)}', ${idx})`;
      });
      sql += quizVals.join(",\n") + ";\n\n";
    }
  }

  // 4. SEED SCENARIOS
  sql += `-- 4. SEED SCENARIOS\n`;
  sql += `INSERT INTO \`scenarios\` (\`id\`, \`slug\`, \`theme\`, \`situation\`, \`choices\`, \`order_num\`) VALUES\n`;
  const scenarioVals = scenarios.map((sc: any) => {
    const scId = crypto.randomUUID();
    const choicesJson = JSON.stringify(sc.choices);
    return `('${scId}', '${escapeSql(sc.slug)}', '${escapeSql(sc.theme)}', '${escapeSql(sc.situation)}', '${escapeSql(choicesJson)}', ${sc.order})`;
  });
  sql += scenarioVals.join(",\n") + ";\n\n";

  // 5. SEED SIM EVENTS
  sql += `-- 5. SEED SIM EVENTS\n`;
  sql += `INSERT INTO \`sim_events\` (\`id\`, \`slug\`, \`theme\`, \`icon\`, \`text\`, \`choices\`, \`order_num\`) VALUES\n`;
  const eventVals = simEvents.map((ev: any) => {
    const evId = crypto.randomUUID();
    const choicesJson = JSON.stringify(ev.choices);
    return `('${evId}', '${escapeSql(ev.slug)}', '${escapeSql(ev.theme)}', '${escapeSql(ev.icon)}', '${escapeSql(ev.text)}', '${escapeSql(choicesJson)}', ${ev.order})`;
  });
  sql += eventVals.join(",\n") + ";\n";

  const outputPath = path.resolve("api/install/seed.sql");
  fs.writeFileSync(outputPath, sql, "utf-8");
  console.log(`✅ seed.sql successfully written to ${outputPath} (${(sql.length / 1024).toFixed(1)} KB)`);
}

run().catch(console.error);
