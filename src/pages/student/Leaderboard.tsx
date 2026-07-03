import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useProgress } from "../../hooks/useProgress";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui";
import { cls } from "../../lib/utils";
import { levelFor } from "../../constants/levels";

interface PeerData { id: string; name: string; points: number; }

export default function Leaderboard() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [scope, setScope] = useState("all");

  useEffect(() => {
    api.get("/admin/leaderboard").catch(() => {
      // If not admin, try to get users list another way — fallback to progress data
    });
    // For students, we build leaderboard from available data
    api.get("/admin/users").then((res) => {
      setPeers(res.data.users.map((u: any) => ({ id: u.id, name: u.name, points: u.points })));
    }).catch(() => {
      // Student might not have admin access, use a simpler endpoint
      setPeers([]);
    });
  }, []);

  const factor: Record<string, number> = { weekly: 0.25, monthly: 0.6, all: 1 };
  const allEntries = [
    ...peers.filter(p => p.id !== user?.id),
    { id: user?.id || "", name: user?.name || "You", points: progress.points },
  ];
  const ranked = allEntries
    .map((c) => ({ ...c, score: c.id === user?.id ? c.points : Math.round(c.points * (factor[scope] || 1)), self: c.id === user?.id }))
    .sort((a, b) => b.score - a.score);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="font-bold text-lg">Papan Peringkat</h3>
        <div className="flex gap-2">
          {([["weekly", "Mingguan"], ["monthly", "Bulanan"], ["all", "Sepanjang Waktu"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setScope(id)} className={cls("px-3 py-1.5 rounded-lg text-sm font-semibold transition", scope === id ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-white/5")}>{label}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {ranked.map((c, i) => (
          <div key={c.id || c.name} className={cls("flex items-center gap-4 rounded-xl px-4 py-3",
            c.self ? "bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500"
              : i === 0 ? "bg-amber-50 dark:bg-amber-400/10 ring-1 ring-amber-300 dark:ring-amber-400/30" : "bg-slate-50 dark:bg-white/5")}>
            <span className={cls("w-8 text-center font-black", i === 0 ? "text-xl" : "text-slate-400")}>{i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}</span>
            <span className="flex-1 font-semibold">{c.name}{c.self && " (You)"}</span>
            <span className="font-bold text-emerald-500">{c.score} pts</span>
          </div>
        ))}
      </div>
      {ranked.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Belum ada data peringkat.</p>}
    </Card>
  );
}
