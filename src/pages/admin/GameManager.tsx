import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { Card } from "../../components/ui";
import { cls } from "../../lib/utils";

// ---- Types ----
interface ScenarioChoice { t: string; quality: number; outcome: string; }
interface ScenarioItem { id: string; slug: string; theme: string; situation: string; choices: ScenarioChoice[]; order: number; }
interface SimChoice { t: string; quality: number; dBalance: number; dSaving: number; outcome: string; }
interface SimEventItem { id: string; slug: string; theme: string; icon: string; text: string; choices: SimChoice[]; order: number; }

// ---- Confirm Modal ----
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

// ---- Scenario Choice Form ----
function ScenarioChoiceEditor({ choices, onChange }: { choices: ScenarioChoice[]; onChange: (c: ScenarioChoice[]) => void }) {
  function update(idx: number, field: keyof ScenarioChoice, value: any) {
    const nc = [...choices];
    nc[idx] = { ...nc[idx], [field]: value };
    onChange(nc);
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Pilihan ({choices.length})</label>
        <button type="button" onClick={() => onChange([...choices, { t: "", quality: 1, outcome: "" }])} className="text-xs text-emerald-500 font-semibold">+ Tambah Pilihan</button>
      </div>
      {choices.map((c, i) => (
        <div key={i} className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 mb-2">
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-slate-400 mt-2">{i + 1}.</span>
            <div className="flex-1 space-y-2">
              <input value={c.t} onChange={(e) => update(i, "t", e.target.value)} placeholder="Teks pilihan"
                className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <select value={c.quality} onChange={(e) => update(i, "quality", Number(e.target.value))}
                  className="rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-sm">
                  <option value={2}>Baik (2)</option>
                  <option value={1}>Cukup (1)</option>
                  <option value={0}>Berisiko (0)</option>
                </select>
                <input value={c.outcome} onChange={(e) => update(i, "outcome", e.target.value)} placeholder="Konsekuensi"
                  className="rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-sm" />
              </div>
            </div>
            <button type="button" onClick={() => { if (choices.length > 2) onChange(choices.filter((_, j) => j !== i)); else toast.error("Minimal 2 pilihan"); }}
              className="text-rose-400 hover:text-rose-500 text-sm mt-2">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Scenario Form ----
function ScenarioForm({ initial, onSave, onCancel }: {
  initial?: ScenarioItem | null;
  onSave: (data: { slug: string; theme: string; situation: string; choices: ScenarioChoice[]; order: number }) => void;
  onCancel: () => void;
}) {
  const [slug, setSlug] = useState(initial?.slug || "");
  const [theme, setTheme] = useState(initial?.theme || "");
  const [situation, setSituation] = useState(initial?.situation || "");
  const [choices, setChoices] = useState<ScenarioChoice[]>(initial?.choices || [{ t: "", quality: 2, outcome: "" }, { t: "", quality: 0, outcome: "" }]);
  const [order, setOrder] = useState(initial?.order ?? 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !theme || !situation) { toast.error("Slug, tema, dan situasi wajib diisi"); return; }
    if (choices.some(c => !c.t.trim())) { toast.error("Semua teks pilihan wajib diisi"); return; }
    onSave({ slug, theme, situation, choices, order });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!!initial} placeholder="sc9"
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm disabled:opacity-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tema</label>
          <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="mis. E-Wallet"
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Situasi</label>
        <textarea value={situation} onChange={(e) => setSituation(e.target.value)} rows={3} placeholder="Ceritakan situasi/skenario..."
          className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
      </div>
      <ScenarioChoiceEditor choices={choices} onChange={setChoices} />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-white/5">Batal</button>
        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">Simpan</button>
      </div>
    </form>
  );
}

// ---- SimEvent Choice Form ----
function SimChoiceEditor({ choices, onChange }: { choices: SimChoice[]; onChange: (c: SimChoice[]) => void }) {
  function update(idx: number, field: keyof SimChoice, value: any) {
    const nc = [...choices];
    nc[idx] = { ...nc[idx], [field]: value };
    onChange(nc);
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Pilihan ({choices.length})</label>
        <button type="button" onClick={() => onChange([...choices, { t: "", quality: 1, dBalance: 0, dSaving: 0, outcome: "" }])} className="text-xs text-emerald-500 font-semibold">+ Tambah Pilihan</button>
      </div>
      {choices.map((c, i) => (
        <div key={i} className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 mb-2">
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-slate-400 mt-2">{i + 1}.</span>
            <div className="flex-1 space-y-2">
              <input value={c.t} onChange={(e) => update(i, "t", e.target.value)} placeholder="Teks pilihan"
                className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-1.5 text-sm" />
              <div className="grid grid-cols-4 gap-2">
                <select value={c.quality} onChange={(e) => update(i, "quality", Number(e.target.value))}
                  className="rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm">
                  <option value={2}>Baik</option>
                  <option value={1}>Cukup</option>
                  <option value={0}>Risiko</option>
                </select>
                <input type="number" value={c.dBalance} onChange={(e) => update(i, "dBalance", Number(e.target.value))} placeholder="Δ Saldo"
                  className="rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm" title="Perubahan saldo" />
                <input type="number" value={c.dSaving} onChange={(e) => update(i, "dSaving", Number(e.target.value))} placeholder="Δ Tabungan"
                  className="rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm" title="Perubahan tabungan" />
                <input value={c.outcome} onChange={(e) => update(i, "outcome", e.target.value)} placeholder="Konsekuensi"
                  className="rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm" />
              </div>
            </div>
            <button type="button" onClick={() => { if (choices.length > 2) onChange(choices.filter((_, j) => j !== i)); else toast.error("Minimal 2 pilihan"); }}
              className="text-rose-400 hover:text-rose-500 text-sm mt-2">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- SimEvent Form ----
function SimEventForm({ initial, onSave, onCancel }: {
  initial?: SimEventItem | null;
  onSave: (data: { slug: string; theme: string; icon: string; text: string; choices: SimChoice[]; order: number }) => void;
  onCancel: () => void;
}) {
  const [slug, setSlug] = useState(initial?.slug || "");
  const [theme, setTheme] = useState(initial?.theme || "");
  const [icon, setIcon] = useState(initial?.icon || "💰");
  const [text, setText] = useState(initial?.text || "");
  const [choices, setChoices] = useState<SimChoice[]>(initial?.choices || [
    { t: "", quality: 2, dBalance: 0, dSaving: 0, outcome: "" },
    { t: "", quality: 0, dBalance: 0, dSaving: 0, outcome: "" },
  ]);
  const [order, setOrder] = useState(initial?.order ?? 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !theme || !text) { toast.error("Slug, tema, dan teks wajib diisi"); return; }
    if (choices.some(c => !c.t.trim())) { toast.error("Semua teks pilihan wajib diisi"); return; }
    onSave({ slug, theme, icon, text, choices, order });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!!initial} placeholder="ev7"
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm disabled:opacity-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tema</label>
          <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="mis. Gaji"
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ikon</label>
          <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="💰"
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teks Peristiwa</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Deskripsi peristiwa simulasi..."
          className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-transparent px-3 py-2 text-sm" />
      </div>
      <SimChoiceEditor choices={choices} onChange={setChoices} />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-white/5">Batal</button>
        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">Simpan</button>
      </div>
    </form>
  );
}

// ---- Main Component ----
export default function GameManager() {
  const [tab, setTab] = useState<"scenarios" | "simEvents">("scenarios");
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [simEvents, setSimEvents] = useState<SimEventItem[]>([]);
  const [editScenario, setEditScenario] = useState<ScenarioItem | null>(null);
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [editSimEvent, setEditSimEvent] = useState<SimEventItem | null>(null);
  const [showAddSimEvent, setShowAddSimEvent] = useState(false);
  const [confirm, setConfirm] = useState<{ msg: string; action: () => void } | null>(null);

  async function fetchScenarios() {
    const res = await api.get("/scenarios");
    setScenarios(res.data.scenarios);
  }

  async function fetchSimEvents() {
    const res = await api.get("/scenarios/sim-events");
    setSimEvents(res.data.events);
  }

  useEffect(() => { fetchScenarios(); fetchSimEvents(); }, []);

  // Scenario handlers
  async function handleSaveScenario(data: any) {
    try {
      if (editScenario) {
        await api.put(`/scenarios/${editScenario.id}`, data);
        toast.success("Skenario berhasil diperbarui");
      } else {
        await api.post("/scenarios", data);
        toast.success("Skenario berhasil ditambahkan");
      }
      setEditScenario(null); setShowAddScenario(false);
      fetchScenarios();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menyimpan skenario");
    }
  }

  async function handleDeleteScenario(id: string) {
    try {
      await api.delete(`/scenarios/${id}`);
      toast.success("Skenario berhasil dihapus");
      fetchScenarios();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menghapus skenario");
    }
  }

  // SimEvent handlers
  async function handleSaveSimEvent(data: any) {
    try {
      if (editSimEvent) {
        await api.put(`/scenarios/sim-events/${editSimEvent.id}`, data);
        toast.success("Simulasi event berhasil diperbarui");
      } else {
        await api.post("/scenarios/sim-events", data);
        toast.success("Simulasi event berhasil ditambahkan");
      }
      setEditSimEvent(null); setShowAddSimEvent(false);
      fetchSimEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menyimpan simulasi event");
    }
  }

  async function handleDeleteSimEvent(id: string) {
    try {
      await api.delete(`/scenarios/sim-events/${id}`);
      toast.success("Simulasi event berhasil dihapus");
      fetchSimEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menghapus simulasi event");
    }
  }

  const qualityBadge = (q: number) => (
    <span className={cls("text-xs font-bold px-1.5 py-0.5 rounded",
      q === 2 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : q === 1 ? "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300"
      : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300")}>
      {q === 2 ? "Baik" : q === 1 ? "Cukup" : "Risiko"}
    </span>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Manajemen Game</h2>
        <div className="flex gap-2">
          <button onClick={() => setTab("scenarios")} className={cls("px-4 py-2 rounded-lg text-sm font-semibold transition", tab === "scenarios" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-white/5")}>🎮 Skenario</button>
          <button onClick={() => setTab("simEvents")} className={cls("px-4 py-2 rounded-lg text-sm font-semibold transition", tab === "simEvents" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-white/5")}>🧪 Simulasi Akhir</button>
        </div>
      </div>

      {tab === "scenarios" ? (
        <>
          <div className="flex justify-end">
            <button onClick={() => { setShowAddScenario(true); setEditScenario(null); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">+ Tambah Skenario</button>
          </div>

          {(showAddScenario || editScenario) && (
            <Card className="p-6">
              <h3 className="font-bold mb-3">{editScenario ? "Edit Skenario" : "Tambah Skenario Baru"}</h3>
              <ScenarioForm initial={editScenario} onSave={handleSaveScenario} onCancel={() => { setShowAddScenario(false); setEditScenario(null); }} />
            </Card>
          )}

          {scenarios.map((s) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-500">{s.slug.toUpperCase()}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5">{s.theme}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{s.situation.length > 120 ? s.situation.slice(0, 120) + "…" : s.situation}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.choices.map((c, ci) => (
                      <span key={ci} className="text-xs flex items-center gap-1">
                        {qualityBadge(c.quality)} {c.t.length > 30 ? c.t.slice(0, 30) + "…" : c.t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditScenario(s); setShowAddScenario(false); }}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 transition">✏️</button>
                  <button onClick={() => setConfirm({ msg: `Hapus skenario "${s.slug}"?`, action: () => handleDeleteScenario(s.id) })}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition">🗑</button>
                </div>
              </div>
            </Card>
          ))}
          {scenarios.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Belum ada skenario.</p>}
        </>
      ) : (
        <>
          <div className="flex justify-end">
            <button onClick={() => { setShowAddSimEvent(true); setEditSimEvent(null); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">+ Tambah Peristiwa Simulasi</button>
          </div>

          {(showAddSimEvent || editSimEvent) && (
            <Card className="p-6">
              <h3 className="font-bold mb-3">{editSimEvent ? "Edit Peristiwa Simulasi" : "Tambah Peristiwa Simulasi Baru"}</h3>
              <SimEventForm initial={editSimEvent} onSave={handleSaveSimEvent} onCancel={() => { setShowAddSimEvent(false); setEditSimEvent(null); }} />
            </Card>
          )}

          {simEvents.map((ev) => (
            <Card key={ev.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{ev.icon}</span>
                    <span className="text-xs font-bold text-emerald-500">{ev.slug.toUpperCase()}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5">{ev.theme}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{ev.text.length > 120 ? ev.text.slice(0, 120) + "…" : ev.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {ev.choices.map((c, ci) => (
                      <span key={ci} className="text-xs flex items-center gap-1">
                        {qualityBadge(c.quality)}
                        <span className="text-slate-400">Δ{c.dBalance >= 0 ? "+" : ""}{c.dBalance}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditSimEvent(ev); setShowAddSimEvent(false); }}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 transition">✏️</button>
                  <button onClick={() => setConfirm({ msg: `Hapus peristiwa "${ev.slug}"?`, action: () => handleDeleteSimEvent(ev.id) })}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition">🗑</button>
                </div>
              </div>
            </Card>
          ))}
          {simEvents.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Belum ada peristiwa simulasi.</p>}
        </>
      )}

      {confirm && <ConfirmModal message={confirm.msg} onConfirm={() => { confirm.action(); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
