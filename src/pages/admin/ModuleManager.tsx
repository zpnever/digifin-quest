import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { Card } from "../../components/ui";
import { cls } from "../../lib/utils";

interface QuizItem { id: string; question: string; options: string[]; answer: number; explanation: string; difficulty: string; order: number; }
interface ModuleItem { id: string; slug: string; title: string; topics: string[]; order: number; quizCount?: number; lesson?: any; quizzes?: QuizItem[]; }

// --- Module Form ---
function ModuleForm({ initial, onSave, onCancel }: {
  initial?: ModuleItem | null;
  onSave: (data: { slug: string; title: string; topics: string[]; order: number; lesson: any }) => void;
  onCancel: () => void;
}) {
  const [slug, setSlug] = useState(initial?.slug || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [topics, setTopics] = useState(initial?.topics?.join(", ") || "");
  const [order, setOrder] = useState(initial?.order || 0);
  const [intro, setIntro] = useState(initial?.lesson?.intro || "");
  const [sections, setSections] = useState<{ h: string; b: string }[]>(initial?.lesson?.sections || [{ h: "", b: "" }]);
  const [exTitle, setExTitle] = useState(initial?.lesson?.example?.title || "");
  const [exBody, setExBody] = useState(initial?.lesson?.example?.body || "");
  const [takeaways, setTakeaways] = useState(initial?.lesson?.takeaways?.join("\n") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !title) { toast.error("Slug dan judul wajib diisi"); return; }
    onSave({
      slug, title,
      topics: topics.split(",").map(t => t.trim()).filter(Boolean),
      order,
      lesson: {
        intro,
        sections: sections.filter(s => s.h || s.b),
        example: { title: exTitle, body: exBody },
        takeaways: takeaways.split("\n").map(t => t.trim()).filter(Boolean),
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!!initial} placeholder="m7"
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm disabled:opacity-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nama Modul"
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Topik (dipisah koma)</label>
        <input value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="Topik 1, Topik 2, Topik 3"
          className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Pendahuluan</label>
        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={3}
          className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Bagian Pelajaran</label>
          <button type="button" onClick={() => setSections([...sections, { h: "", b: "" }])} className="text-xs text-emerald-500 font-semibold">+ Tambah bagian</button>
        </div>
        {sections.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={s.h} onChange={(e) => { const ns = [...sections]; ns[i] = { ...s, h: e.target.value }; setSections(ns); }} placeholder="Judul bagian"
              className="w-1/3 rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
            <textarea value={s.b} onChange={(e) => { const ns = [...sections]; ns[i] = { ...s, b: e.target.value }; setSections(ns); }} placeholder="Konten" rows={2}
              className="flex-1 rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
            <button type="button" onClick={() => setSections(sections.filter((_, j) => j !== i))} className="text-rose-400 hover:text-rose-500 text-sm">✕</button>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Contoh</label>
          <input value={exTitle} onChange={(e) => setExTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Isi Contoh</label>
          <textarea value={exBody} onChange={(e) => setExBody(e.target.value)} rows={2}
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Poin Penting (satu per baris)</label>
        <textarea value={takeaways} onChange={(e) => setTakeaways(e.target.value)} rows={3}
          className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-white/5">Batal</button>
        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">Simpan</button>
      </div>
    </form>
  );
}

// --- Quiz Form ---
function QuizForm({ initial, onSave, onCancel }: {
  initial?: QuizItem | null;
  onSave: (data: { question: string; options: string[]; answer: number; explanation: string; difficulty: string; order: number }) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question || "");
  const [options, setOptions] = useState<string[]>(initial?.options || ["", "", "", ""]);
  const [answer, setAnswer] = useState(initial?.answer ?? 0);
  const [explanation, setExplanation] = useState(initial?.explanation || "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty || "mudah");
  const [order, setOrder] = useState(initial?.order ?? 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question || options.some(o => !o)) { toast.error("Semua field wajib diisi"); return; }
    onSave({ question, options, answer, explanation, difficulty, order });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 dark:bg-white/5 rounded-xl p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Pertanyaan</label>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={2}
          className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Opsi Jawaban</label>
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <input type="radio" name="answer" checked={answer === i} onChange={() => setAnswer(i)} className="accent-emerald-500" />
            <input value={o} onChange={(e) => { const no = [...options]; no[i] = e.target.value; setOptions(no); }} placeholder={`Opsi ${i + 1}`}
              className="flex-1 rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-sm" />
          </div>
        ))}
        <p className="text-xs text-slate-400 mt-1">Pilih radio button untuk jawaban benar.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Kesulitan</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm">
            <option value="mudah">Mudah</option>
            <option value="sedang">Sedang</option>
            <option value="sulit">Sulit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Penjelasan</label>
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2}
          className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-200 dark:bg-white/10">Batal</button>
        <button type="submit" className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">Simpan Soal</button>
      </div>
    </form>
  );
}

// --- Confirm Modal ---
function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <p className="font-semibold mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-white/5">Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white transition">Hapus</button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function ModuleManager() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [editModule, setEditModule] = useState<ModuleItem | null>(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editQuiz, setEditQuiz] = useState<{ moduleId: string; quiz: QuizItem | null } | null>(null);
  const [confirm, setConfirm] = useState<{ msg: string; action: () => void } | null>(null);

  async function fetchModules() {
    const res = await api.get("/modules");
    setModules(res.data.modules);
  }

  async function fetchModuleDetail(id: string) {
    const res = await api.get(`/modules/${id}`);
    return res.data.module;
  }

  useEffect(() => { fetchModules(); }, []);

  async function handleSaveModule(data: any) {
    try {
      if (editModule) {
        await api.put(`/modules/${editModule.id}`, data);
        toast.success("Modul berhasil diperbarui");
      } else {
        await api.post("/modules", data);
        toast.success("Modul berhasil ditambahkan");
      }
      setEditModule(null); setShowAddModule(false);
      fetchModules();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menyimpan modul");
    }
  }

  async function handleDeleteModule(id: string) {
    try {
      await api.delete(`/modules/${id}`);
      toast.success("Modul berhasil dihapus");
      fetchModules();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menghapus modul");
    }
  }

  async function handleSaveQuiz(moduleId: string, data: any) {
    try {
      if (editQuiz?.quiz) {
        await api.put(`/modules/${moduleId}/quizzes/${editQuiz.quiz.id}`, data);
        toast.success("Soal berhasil diperbarui");
      } else {
        await api.post(`/modules/${moduleId}/quizzes`, data);
        toast.success("Soal berhasil ditambahkan");
      }
      setEditQuiz(null);
      // Refresh expanded module
      const detail = await fetchModuleDetail(moduleId);
      setModules((prev) => prev.map(m => m.id === moduleId ? { ...m, ...detail } : m));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menyimpan soal");
    }
  }

  async function handleDeleteQuiz(moduleId: string, quizId: string) {
    try {
      await api.delete(`/modules/${moduleId}/quizzes/${quizId}`);
      toast.success("Soal berhasil dihapus");
      const detail = await fetchModuleDetail(moduleId);
      setModules((prev) => prev.map(m => m.id === moduleId ? { ...m, ...detail } : m));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menghapus soal");
    }
  }

  async function toggleExpand(id: string) {
    if (expandedModule === id) { setExpandedModule(null); return; }
    const detail = await fetchModuleDetail(id);
    setModules((prev) => prev.map(m => m.id === id ? { ...m, ...detail } : m));
    setExpandedModule(id);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Manajemen Modul</h2>
        <button onClick={() => { setShowAddModule(true); setEditModule(null); }}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">+ Tambah Modul</button>
      </div>

      {(showAddModule || editModule) && (
        <Card className="p-6">
          <h3 className="font-bold mb-3">{editModule ? "Edit Modul" : "Tambah Modul Baru"}</h3>
          <ModuleForm initial={editModule} onSave={handleSaveModule} onCancel={() => { setShowAddModule(false); setEditModule(null); }} />
        </Card>
      )}

      {modules.map((m) => (
        <Card key={m.id} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(m.id)}>
              <span className="text-xs font-bold text-emerald-500">{m.slug.toUpperCase()}</span>
              <h3 className="font-bold">{m.title}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {m.topics.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5">{t}</span>)}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={async () => {
                const detail = await fetchModuleDetail(m.id);
                setEditModule({ ...m, ...detail });
                setShowAddModule(false);
              }} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition">✏️ Edit</button>
              <button onClick={() => setConfirm({ msg: `Hapus modul "${m.title}"? Semua kuis terkait juga akan dihapus.`, action: () => handleDeleteModule(m.id) })}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition">🗑 Hapus</button>
            </div>
          </div>

          {expandedModule === m.id && m.quizzes && (
            <div className="mt-4 border-t border-slate-100 dark:border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">Soal Kuis ({m.quizzes.length})</h4>
                <button onClick={() => setEditQuiz({ moduleId: m.id, quiz: null })}
                  className="text-xs text-emerald-500 font-semibold">+ Tambah Soal</button>
              </div>
              {editQuiz?.moduleId === m.id && !editQuiz.quiz && (
                <QuizForm onSave={(d) => handleSaveQuiz(m.id, d)} onCancel={() => setEditQuiz(null)} />
              )}
              <div className="space-y-2">
                {m.quizzes.map((q, qi) => (
                  <div key={q.id}>
                    {editQuiz?.quiz?.id === q.id ? (
                      <QuizForm initial={q} onSave={(d) => handleSaveQuiz(m.id, d)} onCancel={() => setEditQuiz(null)} />
                    ) : (
                      <div className="flex items-start gap-3 rounded-lg bg-slate-50 dark:bg-white/5 p-3">
                        <span className="text-xs text-slate-400 font-bold mt-1">{qi + 1}.</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{q.question}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={cls("text-xs font-bold", q.difficulty === "mudah" ? "text-emerald-500" : q.difficulty === "sedang" ? "text-amber-500" : "text-rose-500")}>{q.difficulty}</span>
                            <span className="text-xs text-slate-400">Jawaban: opsi {q.answer + 1}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setEditQuiz({ moduleId: m.id, quiz: q })} className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-white/10">Edit</button>
                          <button onClick={() => setConfirm({ msg: `Hapus soal "${q.question.slice(0, 50)}..."?`, action: () => handleDeleteQuiz(m.id, q.id) })}
                            className="text-xs px-2 py-1 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-500">Hapus</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}

      {confirm && <ConfirmModal message={confirm.msg} onConfirm={() => { confirm.action(); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
