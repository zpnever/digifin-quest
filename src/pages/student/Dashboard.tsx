import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useProgress } from "../../hooks/useProgress";
import { Card, Bar, Stat } from "../../components/ui";
import { levelFor, nextLevel } from "../../constants/levels";
import { POINTS, DAILY_CHALLENGES } from "../../constants/points";

export default function Dashboard() {
  const { progress, claimChallenge } = useProgress();
  const navigate = useNavigate();
  const [moduleCount, setModuleCount] = useState(6);

  useEffect(() => {
    api.get("/modules").then((res) => setModuleCount(res.data.modules.length)).catch(() => {});
  }, []);

  const lvl = levelFor(progress.points);
  const next = nextLevel(progress.points);
  const completedCount = Object.keys(progress.completedLessons).length;
  const bestQuizPct = Math.max(0, ...Object.values(progress.quizScores).map((s) => s.pct), 0);
  const overallPct = moduleCount > 0 ? Math.round((completedCount / moduleCount) * 100) : 0;
  const toNext = next ? next.min - progress.points : 0;
  const challengeState = { todayLessons: progress.todayLessons, bestQuizPct, streak: progress.streak };

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2 p-6">
        <h3 className="font-bold text-lg mb-4">Kemajuan Anda</h3>
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">{completedCount} dari {moduleCount} modul selesai</span>
          <span className="font-bold text-emerald-500">{overallPct}%</span>
        </div>
        <Bar pct={overallPct} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Stat label="Poin" value={progress.points} icon="⭐" />
          <Stat label="Level" value={`${lvl.lvl} · ${lvl.name}`} icon="🚀" small />
          <Stat label="Lencana" value={progress.badges.length} icon="🎖️" />
          <Stat label="Rentetan" value={`${progress.streak} hari`} icon="🔥" />
        </div>
        {next && <p className="mt-5 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-200">{toNext} pts</span> to reach Level {next.lvl} · {next.name}</p>}
      </Card>

      <Card className="p-6 flex flex-col">
        <h3 className="font-bold text-lg mb-3">Disarankan Berikutnya</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Lanjutkan petualangan Anda:</p>
        <button onClick={() => navigate("/modules")} className="mt-auto rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 transition">
          Lihat Modul →
        </button>
      </Card>

      <Card className="lg:col-span-3 p-6">
        <h3 className="font-bold text-lg mb-4">Tantangan Harian <span className="text-sm font-normal text-slate-400">(+{POINTS.challenge} pts each)</span></h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {DAILY_CHALLENGES.map((c) => {
            const done = c.check(challengeState as any);
            const claimed = progress.claimedChallenges.includes(c.id);
            return (
              <div key={c.id} className="rounded-xl border border-slate-200 dark:border-white/10 p-4 flex flex-col gap-3">
                <span className="text-sm">{c.text}</span>
                {claimed ? <span className="text-emerald-500 font-semibold text-sm">✓ Diklaim</span>
                  : done ? <button onClick={() => claimChallenge(c.id)} className="rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm py-2 transition">Klaim hadiah</button>
                  : <span className="text-slate-400 text-sm">Sedang berjalan…</span>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
