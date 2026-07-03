import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useProgress } from "../../hooks/useProgress";
import { Card, Stat } from "../../components/ui";
import { cls } from "../../lib/utils";
import { SIM_START_BALANCE } from "../../constants/points";

interface SimEventData { id: string; slug: string; theme: string; icon: string; text: string; choices: { t: string; quality: number; dBalance: number; dSaving: number; outcome: string }[]; }

export default function FinalSimulation() {
  const { progress, finishSimulation } = useProgress();
  const [events, setEvents] = useState<SimEventData[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [balance, setBalance] = useState(SIM_START_BALANCE);
  const [saving, setSaving] = useState(0);
  const [qualities, setQualities] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get("/scenarios/sim-events").then((res) => setEvents(res.data.events)).catch(console.error);
  }, []);

  if (events.length === 0) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" /></div>;

  const fmt = (n: number) => "Rp" + n.toLocaleString("id-ID");

  function choose(ci: number) {
    if (picked !== null) return;
    setPicked(ci);
    const c = events[idx].choices[ci];
    setBalance((b) => b + c.dBalance);
    setSaving((s) => s + c.dSaving);
    setQualities((q) => [...q, c.quality]);
  }

  function next() {
    setPicked(null);
    if (idx < events.length - 1) { setIdx(idx + 1); return; }
    const avgQuality = qualities.length ? qualities.reduce((a, q) => a + q, 0) / qualities.length : 0;
    const pct = Math.round((avgQuality / 2) * 100);
    const passed = pct >= 60;
    setDone(true);
    finishSimulation({ balance, saving, avgQuality: Math.round(avgQuality * 100) / 100, pct, passed });
  }

  if (done) {
    const avgQuality = qualities.reduce((a, q) => a + q, 0) / qualities.length;
    const pct = Math.round((avgQuality / 2) * 100);
    const passed = pct >= 60;
    return (
      <Card className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-1">Hasil Simulasi Akhir</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Ringkasan keputusan keuangan Anda.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Stat label="Saldo Akhir" value={fmt(balance)} icon="💰" small />
          <Stat label="Tabungan" value={fmt(saving)} icon="🐷" small />
          <Stat label="Kualitas Keputusan" value={`${pct}%`} icon="🧠" />
          <Stat label="Status" value={passed ? "Lulus" : "Ulangi"} icon={passed ? "✅" : "🔁"} small />
        </div>
        <div className={cls("rounded-xl p-5 border mb-6", passed ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200" : "bg-amber-50 dark:bg-amber-400/10 border-amber-200")}>
          <p className="font-bold mb-1">{passed ? "🎉 Selamat!" : "Tetap semangat!"}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {passed ? "Anda menunjukkan pengambilan keputusan keuangan yang baik. Sertifikat tersedia di Profil."
              : "Beberapa keputusan masih berisiko. Tinjau modul dan ulangi simulasi."}
          </p>
        </div>
        <button onClick={() => { setIdx(0); setPicked(null); setBalance(SIM_START_BALANCE); setSaving(0); setQualities([]); setDone(false); }}
          className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 transition">Ulangi Simulasi</button>
      </Card>
    );
  }

  const ev = events[idx];
  const c = picked !== null ? ev.choices[picked] : null;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="p-3 text-center"><div className="text-xs text-slate-400">Saldo</div><div className="font-bold text-emerald-500">{fmt(balance)}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-slate-400">Tabungan</div><div className="font-bold">{fmt(saving)}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-slate-400">Peristiwa</div><div className="font-bold">{idx + 1}/{events.length}</div></Card>
      </div>
      <Card className="p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{ev.icon}</span>
          <div>
            <span className="text-xs font-bold text-emerald-500">SIMULASI AKHIR · {ev.theme}</span>
            <h2 className="text-lg font-bold">Bulan ke-1, peristiwa {idx + 1}</h2>
          </div>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-5">{ev.text}</p>
        <div className="grid gap-2">
          {ev.choices.map((o, oi) => {
            const isPicked = picked === oi;
            let style = "border-slate-200 dark:border-white/15 hover:border-emerald-400";
            if (picked !== null) {
              if (o.quality === 2) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
              else if (isPicked) style = "border-rose-500 bg-rose-50 dark:bg-rose-500/10";
              else style = "border-slate-200 dark:border-white/10 opacity-60";
            }
            return <button key={oi} disabled={picked !== null} onClick={() => choose(oi)}
              className={cls("text-left rounded-xl border px-4 py-3 text-sm transition", style)}>{o.t}</button>;
          })}
        </div>
        {c && (
          <div className={cls("mt-5 rounded-xl p-4 border",
            c.quality === 2 ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200"
            : c.quality === 1 ? "bg-amber-50 dark:bg-amber-400/10 border-amber-200"
            : "bg-rose-50 dark:bg-rose-500/10 border-rose-200")}>
            <p className="font-bold text-sm mb-1">{c.quality === 2 ? "✅ Keputusan baik" : c.quality === 1 ? "⚠️ Bisa lebih baik" : "❌ Berisiko"}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{c.outcome}</p>
            <button onClick={next} className="mt-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-2 transition">
              {idx < events.length - 1 ? "Peristiwa berikutnya →" : "Lihat hasil akhir →"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
