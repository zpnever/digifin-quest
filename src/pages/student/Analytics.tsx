import React, { useEffect, useState, useMemo } from "react";
import api from "../../lib/api";
import { useProgress } from "../../hooks/useProgress";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Bar, Stat } from "../../components/ui";
import { BADGES } from "../../constants/badges";
import { levelFor } from "../../constants/levels";
import { cls } from "../../lib/utils";

interface ModuleInfo { id: string; slug: string; title: string; }

function computeScores(progress: any, modules: ModuleInfo[]) {
  const totalModules = modules.length || 6;
  const completed = Object.keys(progress.completedLessons).length;
  const quizzes = Object.values(progress.quizScores) as { pct: number }[];
  const avgQuiz = quizzes.length ? quizzes.reduce((a, s) => a + s.pct, 0) / quizzes.length : 0;

  const moduleQuiz = (slug: string) => {
    const mod = modules.find(m => m.slug === slug);
    return mod ? (progress.quizScores[mod.id]?.pct ?? 0) : 0;
  };
  const moduleDone = (slug: string) => {
    const mod = modules.find(m => m.slug === slug);
    return mod ? (progress.completedLessons[mod.id] ? 1 : 0) : 0;
  };

  const flQuiz = (moduleQuiz("m1") + moduleQuiz("m3")) / 2;
  const flDone = (moduleDone("m1") + moduleDone("m3")) / 2 * 100;
  const financialLiteracy = Math.round(0.7 * flQuiz + 0.3 * flDone);

  const dsQuiz = (moduleQuiz("m2") + moduleQuiz("m5") + moduleQuiz("m6")) / 3;
  const dsDone = (moduleDone("m2") + moduleDone("m5") + moduleDone("m6")) / 3 * 100;
  const digitalSafety = Math.round(0.7 * dsQuiz + 0.3 * dsDone);

  const sres = Object.values(progress.scenarioResults || {}) as { quality: number }[];
  const sim = progress.simResult;
  let decisionMaking: number;
  if (sres.length > 0 || sim) {
    let gameScore: number | null = null;
    if (sres.length > 0) {
      const avgQuality = sres.reduce((a, r) => a + r.quality, 0) / sres.length;
      const coverage = sres.length / 8;
      gameScore = (avgQuality / 2) * 100 * (0.5 + 0.5 * coverage);
    }
    const simScore = sim ? sim.pct : null;
    if (gameScore !== null && simScore !== null) decisionMaking = Math.round(0.4 * gameScore + 0.6 * simScore);
    else decisionMaking = Math.round(gameScore !== null ? gameScore : simScore!);
  } else {
    decisionMaking = Math.round(0.6 * moduleQuiz("m4") + 0.4 * avgQuiz);
  }

  const progressPart = (completed / totalModules) * 100;
  const streakPart = Math.min(progress.streak / 7, 1) * 100;
  const participationPart = Math.min(
    (progress.claimedChallenges.length / 3) * 0.5 +
    (progress.badges.length / BADGES.length) * 0.5, 1) * 100;
  const engagement = Math.round(0.4 * progressPart + 0.3 * streakPart + 0.3 * participationPart);

  const learning = (financialLiteracy + digitalSafety) / 2;
  const gamificationEffectiveness = (engagement + learning) > 0
    ? Math.round((2 * engagement * learning) / (engagement + learning)) : 0;

  return { financialLiteracy, digitalSafety, decisionMaking, engagement, gamificationEffectiveness };
}

const SCORE_META = [
  { key: "financialLiteracy", label: "Financial Literacy Score", formula: "0,7 × rata-rata kuis (Fintech Basics, Budgeting) + 0,3 × penyelesaian" },
  { key: "digitalSafety", label: "Digital Safety Score", formula: "0,7 × rata-rata kuis (Payment, Security, Consumer Protection) + 0,3 × penyelesaian" },
  { key: "decisionMaking", label: "Decision-Making Score", formula: "Gabungan Game Skenario (40%) & Simulasi Akhir (60%)" },
  { key: "engagement", label: "Engagement Score", formula: "0,4 × kemajuan modul + 0,3 × streak + 0,3 × partisipasi" },
  { key: "gamificationEffectiveness", label: "Gamification Effectiveness", formula: "Rata-rata harmonik Engagement & hasil belajar" },
];

export default function Analytics() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  useEffect(() => {
    api.get("/modules").then((res) => setModules(res.data.modules)).catch(console.error);
  }, []);

  const scores = useMemo(() => computeScores(progress, modules), [progress, modules]);
  const quizzes = Object.values(progress.quizScores) as { pct: number }[];
  const avgQuiz = quizzes.length ? Math.round(quizzes.reduce((a, s) => a + s.pct, 0) / quizzes.length) : 0;
  const completed = Object.keys(progress.completedLessons).length;

  const scoreColor = (v: number) => v >= 75 ? "text-emerald-500" : v >= 50 ? "text-amber-500" : "text-rose-500";
  const barColor = (v: number) => v >= 75 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : "bg-rose-500";

  function downloadCSV() {
    const header = ["participant", "points", "level", "streak", "modules_completed", "avg_quiz_pct",
      "financial_literacy", "digital_safety", "decision_making", "engagement", "gamification_effectiveness"];
    const row = [user?.name, progress.points, levelFor(progress.points).lvl, progress.streak,
      completed, avgQuiz, scores.financialLiteracy, scores.digitalSafety, scores.decisionMaking,
      scores.engagement, scores.gamificationEffectiveness];
    const csv = [header.join(","), row.join(",")].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "digifinquest_data.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
          <h3 className="font-bold text-lg">Skor Penelitian</h3>
          <button onClick={downloadCSV} className="text-sm rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 transition">Export CSV</button>
        </div>
        <p className="text-xs text-slate-400 mb-5">Rentang 0–100. Skor adalah proksi berbasis perilaku.</p>
        <div className="space-y-4">
          {SCORE_META.map((m) => (
            <div key={m.key}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-sm">{m.label}</span>
                <span className={cls("font-black text-lg", scoreColor((scores as any)[m.key]))}>{(scores as any)[m.key]}</span>
              </div>
              <Bar pct={(scores as any)[m.key]} color={barColor((scores as any)[m.key])} />
              <p className="text-xs text-slate-400 mt-1">Rumus: {m.formula}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Ringkasan Aktivitas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Modul Selesai" value={`${completed}/${modules.length}`} icon="📚" small />
          <Stat label="Rata-rata Kuis" value={`${avgQuiz}%`} icon="📝" />
          <Stat label="Rentetan" value={`${progress.streak} hari`} icon="🔥" />
          <Stat label="Lencana" value={progress.badges.length} icon="🎖️" />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Performa Kuis per Modul</h3>
        <div className="space-y-3">
          {modules.map((m) => {
            const sc = progress.quizScores[m.id];
            return (
              <div key={m.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{m.title}</span>
                  <span className="font-semibold">{sc ? `${sc.pct}%` : "—"}</span>
                </div>
                <Bar pct={sc?.pct ?? 0} color={sc ? barColor(sc.pct) : "bg-slate-300"} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
