import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useProgress } from "../../hooks/useProgress";
import { Card, Bar } from "../../components/ui";
import { cls } from "../../lib/utils";
import { POINTS } from "../../constants/points";

interface QuizItem { id: string; question: string; options: string[]; answer: number; explanation: string; difficulty: string; }
interface ModuleData { id: string; slug: string; title: string; topics: string[]; lesson: any; quizzes: QuizItem[]; }
interface ModuleListItem { id: string; slug: string; title: string; order: number; }

function inferTopic(topics: string[], q: QuizItem): string {
  const text = (q.question + " " + q.options.join(" ")).toLowerCase();
  let best = topics[0], bestScore = -1;
  for (const t of topics) {
    const words = t.toLowerCase().split(/[\s/]+/);
    const score = words.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return best;
}

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { progress, completeLesson, submitQuiz } = useProgress();
  const [mod, setMod] = useState<ModuleData | null>(null);
  const [allModules, setAllModules] = useState<ModuleListItem[]>([]);
  const [view, setView] = useState<"lesson" | "quiz">("lesson");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/modules/${id}`).then((res) => setMod(res.data.module)).catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    api.get("/modules").then((res) => setAllModules(res.data.modules)).catch(console.error);
  }, []);

  // Reset state when navigating between modules
  useEffect(() => {
    setView("lesson");
    setAnswers({});
    setSubmitted(false);
  }, [id]);

  const correct = mod ? mod.quizzes.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0) : 0;
  const pct = mod && mod.quizzes.length > 0 ? Math.round((correct / mod.quizzes.length) * 100) : 0;
  const diffColor: Record<string, string> = { mudah: "text-emerald-500", sedang: "text-amber-500", sulit: "text-rose-500" };

  const weakTopics = useMemo(() => {
    if (!submitted || !mod) return [];
    const miss: Record<string, number> = {};
    mod.quizzes.forEach((q, i) => {
      if (answers[i] !== q.answer) { const t = inferTopic(mod.topics, q); miss[t] = (miss[t] || 0) + 1; }
    });
    return Object.entries(miss).sort((a, b) => b[1] - a[1]);
  }, [submitted, answers, mod]);

  // Determine prev/next module
  const currentIdx = allModules.findIndex((m) => m.id === id);
  const prevModule = currentIdx > 0 ? allModules[currentIdx - 1] : null;
  const nextModule = currentIdx >= 0 && currentIdx < allModules.length - 1 ? allModules[currentIdx + 1] : null;

  if (!mod) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" /></div>;

  const lessonDone = progress.completedLessons[mod.id];
  const L = mod.lesson;
  const prev = progress.quizScores[mod.id];

  return (
    <div>
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate("/modules")} className="text-sm text-slate-500 hover:text-emerald-500">← Kembali ke modul</button>
        <div className="flex gap-2">
          {prevModule && (
            <button onClick={() => navigate(`/modules/${prevModule.id}`)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition">
              ← {prevModule.title}
            </button>
          )}
          {nextModule && (
            <button onClick={() => navigate(`/modules/${nextModule.id}`)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">
              {nextModule.title} →
            </button>
          )}
        </div>
      </div>

      <Card className="p-6 mb-5">
        <h2 className="text-2xl font-bold mb-2">{mod.title}</h2>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mod.topics.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5">{t}</span>)}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("lesson")} className={cls("px-4 py-2 rounded-lg text-sm font-semibold", view === "lesson" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-white/5")}>Pelajaran</button>
          <button onClick={() => setView("quiz")} className={cls("px-4 py-2 rounded-lg text-sm font-semibold", view === "quiz" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-white/5")}>Kuis ({mod.quizzes.length} soal)</button>
        </div>
      </Card>

      {view === "lesson" ? (
        <Card className="p-6 lg:p-8">
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">{L.intro}</p>
          <div className="space-y-5">
            {L.sections.map((s: any) => (
              <div key={s.h} className="border-l-2 border-emerald-500 pl-4">
                <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">{s.h}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 p-5">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1">📝 {L.example.title}</h4>
            <p className="text-sm text-amber-900/80 dark:text-amber-100/80 leading-relaxed">{L.example.body}</p>
          </div>
          <div className="mt-6">
            <h4 className="font-bold mb-2">Poin penting</h4>
            <ul className="space-y-1.5">
              {L.takeaways.map((t: string, i: number) => <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="text-emerald-500">✓</span>{t}</li>)}
            </ul>
          </div>
          <div className="mt-7 flex items-center justify-between">
            <div>
              {lessonDone ? <span className="text-emerald-500 font-semibold">✓ Pelajaran selesai (+{POINTS.lessonComplete} poin diperoleh)</span>
                : <button onClick={() => completeLesson(mod.id)} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 transition">Tandai pelajaran selesai (+{POINTS.lessonComplete} pts)</button>}
            </div>
            {nextModule && (
              <button onClick={() => navigate(`/modules/${nextModule.id}`)}
                className="rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-emerald-500 hover:text-white font-bold px-6 py-2.5 transition">
                Modul selanjutnya →
              </button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          {prev && !submitted && <p className="text-sm text-slate-500 mb-4">Terbaik sebelumnya: <b>{prev.pct}%</b>. Ulangi untuk memperbaiki.</p>}
          <div className="space-y-6">
            {mod.quizzes.map((q, i) => (
              <div key={i} className="border-b border-slate-100 dark:border-white/10 pb-5 last:border-0">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <p className="font-semibold">{i + 1}. {q.question}</p>
                  <span className={cls("text-xs font-bold uppercase shrink-0", diffColor[q.difficulty])}>{q.difficulty}</span>
                </div>
                <div className="grid gap-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[i] === oi, isCorrect = q.answer === oi;
                    let style = "border-slate-200 dark:border-white/15 hover:border-emerald-400";
                    if (submitted) {
                      if (isCorrect) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
                      else if (chosen) style = "border-rose-500 bg-rose-50 dark:bg-rose-500/10";
                    } else if (chosen) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
                    return <button key={oi} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                      className={cls("text-left rounded-xl border px-4 py-2.5 text-sm transition", style)}>{opt}</button>;
                  })}
                </div>
                {submitted && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400"><b>Penjelasan:</b> {q.explanation}</p>}
              </div>
            ))}
          </div>

          {!submitted ? (
            <button disabled={Object.keys(answers).length < mod.quizzes.length}
              onClick={() => { setSubmitted(true); submitQuiz(mod.id, correct, mod.quizzes.length); }}
              className="mt-6 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 transition">
              Kirim Kuis ({Object.keys(answers).length}/{mod.quizzes.length} terjawab)
            </button>
          ) : (
            <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-white/5 p-6">
              <div className="text-center">
                <div className={cls("text-5xl font-black", pct >= 80 ? "text-emerald-500" : pct >= 60 ? "text-amber-500" : "text-rose-500")}>{pct}%</div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{correct}/{mod.quizzes.length} benar · +{correct * POINTS.quizPassPerCorrect} pts</p>
              </div>
              <div className="mt-5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4">
                <h4 className="font-bold mb-2">📋 Umpan Balik</h4>
                {pct === 100 ? (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Skor sempurna — Anda telah menguasai konsep modul ini.</p>
                ) : weakTopics.length > 0 ? (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Fokuskan ulasan pada topik berikut:</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {weakTopics.map(([t, n]) => <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold">{t} · {n} keliru</span>)}
                    </div>
                    <button onClick={() => setView("lesson")} className="text-sm font-semibold text-emerald-600 hover:underline">← Baca ulang pelajaran</button>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Kerja bagus — hanya sedikit keliru.</p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="text-sm text-emerald-500 font-semibold hover:underline">Ulangi kuis</button>
                {nextModule && (
                  <button onClick={() => navigate(`/modules/${nextModule.id}`)}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 text-sm transition">
                    Modul selanjutnya →
                  </button>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
