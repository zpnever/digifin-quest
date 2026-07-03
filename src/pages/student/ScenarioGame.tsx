import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useProgress } from "../../hooks/useProgress";
import { Card, Bar } from "../../components/ui";
import { cls } from "../../lib/utils";

interface ScenarioData { id: string; slug: string; theme: string; situation: string; choices: { t: string; quality: number; outcome: string }[]; }

export default function ScenarioGame() {
  const { progress, recordScenario } = useProgress();
  const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    api.get("/scenarios").then((res) => setScenarios(res.data.scenarios)).catch(console.error);
  }, []);

  if (scenarios.length === 0) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" /></div>;

  const sc = scenarios[idx];
  const played = Object.keys(progress.scenarioResults || {}).length;
  const allDone = played >= scenarios.length;
  const alreadyAnswered = progress.scenarioResults?.[sc.id];
  const activePick = picked !== null ? picked : (alreadyAnswered ? alreadyAnswered.choiceIndex : null);

  const qualityColor = (q: number) => q === 2 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : q === 1 ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10" : "border-rose-500 bg-rose-50 dark:bg-rose-500/10";
  const qualityLabel = (q: number) => q === 2 ? "Keputusan aman" : q === 1 ? "Kurang tepat" : "Berisiko";

  function choose(ci: number) {
    if (picked !== null || alreadyAnswered) return;
    setPicked(ci);
    recordScenario(sc.id, ci, sc.choices[ci].quality);
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-500">SKENARIO {idx + 1} / {scenarios.length}</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5">{sc.theme}</span>
        </div>
        <Bar pct={(played / scenarios.length) * 100} />
        <p className="text-xs text-slate-400 mt-1">{played} dari {scenarios.length} skenario telah dijawab</p>
      </Card>

      <Card className="p-6">
        <p className="text-lg leading-relaxed mb-5">{sc.situation}</p>
        <div className="grid gap-3">
          {sc.choices.map((c, ci) => {
            const isPicked = activePick === ci;
            let style = "border-slate-200 dark:border-white/15 hover:border-emerald-400";
            if (activePick !== null) {
              if (isPicked) style = qualityColor(c.quality);
              else style = "border-slate-200 dark:border-white/10 opacity-60";
            }
            return (
              <button key={ci} disabled={activePick !== null} onClick={() => choose(ci)}
                className={cls("text-left rounded-xl border px-4 py-3 text-sm transition", style)}>{c.t}</button>
            );
          })}
        </div>
        {activePick !== null && (
          <div className="mt-5 rounded-xl bg-slate-50 dark:bg-white/5 p-5">
            <span className={cls("inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2",
              sc.choices[activePick].quality === 2 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : sc.choices[activePick].quality === 1 ? "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300")}>
              {qualityLabel(sc.choices[activePick].quality)}
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300"><b>Konsekuensi:</b> {sc.choices[activePick].outcome}</p>
            <div className="mt-4">
              {idx < scenarios.length - 1
                ? <button onClick={() => { setPicked(null); setIdx(idx + 1); }} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 text-sm transition">Skenario berikutnya →</button>
                : <span className="text-emerald-500 font-semibold text-sm">✓ Semua skenario selesai.</span>}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {scenarios.map((s, i) => {
            const done = progress.scenarioResults?.[s.id];
            return (
              <button key={s.id} onClick={() => { setIdx(i); setPicked(null); }}
                className={cls("w-9 h-9 rounded-lg text-sm font-bold transition",
                  i === idx ? "bg-emerald-500 text-white"
                  : done ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-white/5 text-slate-400")}>{i + 1}</button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
