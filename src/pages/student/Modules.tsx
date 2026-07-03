import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useProgress } from "../../hooks/useProgress";
import { Card, Bar } from "../../components/ui";
import { cls } from "../../lib/utils";

interface ModuleItem {
  id: string; slug: string; title: string; topics: string[]; order: number; quizCount: number;
}

const MODULE_THEME: Record<string, { icon: string; grad: string }> = {
  m1: { icon: "🚀", grad: "from-sky-400 to-blue-500" },
  m2: { icon: "💳", grad: "from-emerald-400 to-teal-500" },
  m3: { icon: "🐷", grad: "from-pink-400 to-rose-500" },
  m4: { icon: "🤝", grad: "from-amber-400 to-orange-500" },
  m5: { icon: "🛡️", grad: "from-violet-400 to-purple-500" },
  m6: { icon: "⚖️", grad: "from-cyan-400 to-teal-500" },
};

export default function Modules() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const { progress } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/modules").then((res) => setModules(res.data.modules)).catch(console.error);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {modules.map((m, i) => {
        const done = progress.completedLessons[m.id];
        const quiz = progress.quizScores[m.id];
        const th = MODULE_THEME[m.slug] || { icon: "📘", grad: "from-emerald-400 to-teal-500" };
        return (
          <Card key={m.id} hover className="p-6 flex flex-col fq-in overflow-hidden relative">
            <div className={cls("absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-20 bg-gradient-to-br", th.grad)} />
            <div className="flex justify-between items-start mb-3 relative">
              <div className={cls("inline-grid place-items-center w-14 h-14 rounded-2xl text-3xl text-white shadow-lg bg-gradient-to-br", th.grad)}>{th.icon}</div>
              {done && <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold">✓ Selesai</span>}
            </div>
            <span className="text-xs font-extrabold tracking-wide text-slate-400">MODUL {i + 1}</span>
            <h3 className="font-extrabold text-lg mb-2 leading-tight">{m.title}</h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {m.topics.map((t) => <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5">{t}</span>)}
            </div>
            {quiz && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">KUIS</span>
                <div className="flex-1"><Bar pct={quiz.pct} color={quiz.pct >= 60 ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-rose-400 to-red-500"} /></div>
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{quiz.pct}%</span>
              </div>
            )}
            <button onClick={() => navigate(`/modules/${m.id}`)}
              className={cls("mt-auto rounded-2xl text-white font-bold py-3 transition-all fq-press shadow-[0_4px_0_0_rgba(13,148,136,0.4)] hover:brightness-110 bg-gradient-to-r", th.grad)}>
              {done ? "Tinjau & Kuis" : "Mulai Belajar"} →
            </button>
          </Card>
        );
      })}
    </div>
  );
}
