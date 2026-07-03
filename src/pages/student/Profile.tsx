import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProgress } from "../../hooks/useProgress";
import { Card, Bar, GoldChip, Stat } from "../../components/ui";
import { BADGES } from "../../constants/badges";
import { levelFor, nextLevel } from "../../constants/levels";
import { cls } from "../../lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const lvl = levelFor(progress.points);
  const next = nextLevel(progress.points);
  const completedCount = Object.keys(progress.completedLessons).length;
  const toNext = next ? next.min - progress.points : 0;
  const lvlPct = next ? Math.round(((progress.points - lvl.min) / (next.min - lvl.min)) * 100) : 100;
  const sim = progress.simResult;
  const eligible = sim && sim.passed;

  function downloadCert() {
    const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Sertifikat DigiFin Quest</title>
<style>body{font-family:Georgia,serif;margin:0;background:#0B1F3A;display:flex;align-items:center;justify-content:center;min-height:100vh}
.cert{background:#fff;width:900px;max-width:95%;padding:56px;border:12px solid #0B1F3A;position:relative;text-align:center}
.cert::after{content:"";position:absolute;inset:18px;border:2px solid #10b981;pointer-events:none}
h1{color:#0B1F3A;font-size:40px;margin:8px 0}.sub{color:#10b981;letter-spacing:3px;text-transform:uppercase;font-size:13px;font-weight:bold}
.name{font-size:34px;color:#0B1F3A;margin:20px 0 6px;border-bottom:2px solid #d4a017;display:inline-block;padding:0 24px 8px}
.desc{color:#444;font-size:15px;line-height:1.6;max-width:620px;margin:14px auto}
.meta{display:flex;justify-content:space-around;margin-top:28px;color:#0B1F3A}.meta b{display:block;font-size:22px;color:#10b981}
.foot{margin-top:30px;color:#777;font-size:12px}.gold{color:#d4a017}</style></head><body>
<div class="cert"><div class="sub">Sertifikat Penyelesaian</div><h1>DigiFin Quest</h1>
<p class="desc">Diberikan kepada</p><div class="name">${user?.name || "Mahasiswa"}</div>
<p class="desc">atas keberhasilan menyelesaikan program pembelajaran literasi keuangan digital & fintech.</p>
<div class="meta"><div>Level<b>${lvl.lvl} · ${lvl.name}</b></div><div>Total Poin<b>${progress.points}</b></div><div>Skor Keputusan<b>${sim ? sim.pct : 0}%</b></div></div>
<p class="foot">Diterbitkan pada ${today} · <span class="gold">DigiFin Quest</span></p></div></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a"); a.href = url; a.download = "Sertifikat_DigiFinQuest.html"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1 p-6 text-center">
          <div className="w-24 h-24 mx-auto grid place-items-center rounded-full bg-gradient-to-br from-[#0B1F3A] to-emerald-600 text-white text-4xl font-black">{(user?.name || "S")[0].toUpperCase()}</div>
          <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user?.role === "STUDENT" ? "Mahasiswa" : "Dosen"}</p>
          <div className="mt-3"><GoldChip>Lv.{lvl.lvl} · {lvl.name}</GoldChip></div>
          <p className="text-xs text-slate-400 mt-4">Bergabung {progress.joined}</p>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Kemajuan level</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">Level {lvl.lvl} · {lvl.name}</span>
              {next && <span className="text-slate-500">{toNext} pts to {next.name}</span>}
            </div>
            <Bar pct={lvlPct} color="bg-gradient-to-r from-emerald-500 to-amber-400" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <Stat label="Poin" value={progress.points} icon="⭐" />
              <Stat label="Modul" value={`${completedCount}/6`} icon="📚" />
              <Stat label="Lencana" value={progress.badges.length} icon="🎖️" />
              <Stat label="Rentetan" value={`${progress.streak}d`} icon="🔥" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Lencana yang diraih</h3>
            {progress.badges.length === 0 ? <p className="text-sm text-slate-400">Belum ada lencana.</p> : (
              <div className="flex flex-wrap gap-3">
                {BADGES.filter((b) => progress.badges.includes(b.id)).map((b) => (
                  <div key={b.id} className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-2">
                    <span className="text-2xl">{b.icon}</span><span className="text-sm font-semibold">{b.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Riwayat kuis</h3>
            {Object.keys(progress.quizScores).length === 0 ? <p className="text-sm text-slate-400">Belum ada kuis yang dikerjakan.</p> : (
              <div className="space-y-2">
                {Object.entries(progress.quizScores).map(([moduleId, s]) => (
                  <div key={moduleId} className="flex justify-between text-sm">
                    <span>Modul {moduleId.slice(0, 8)}...</span>
                    <span className={cls("font-semibold", s.pct >= 60 ? "text-emerald-500" : "text-rose-500")}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Certificate */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-3">Sertifikat Penyelesaian</h3>
        {eligible ? (
          <>
            <div className="rounded-2xl border-2 border-[#0B1F3A] dark:border-emerald-500/40 p-6 text-center relative overflow-hidden">
              <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold">Sertifikat Penyelesaian</p>
              <p className="text-sm text-slate-500 mt-2">Diberikan kepada</p>
              <p className="text-2xl font-bold text-[#0B1F3A] dark:text-white border-b-2 border-amber-400 inline-block px-4 pb-1 mt-1">{user?.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto">atas penyelesaian program DigiFin Quest.</p>
              <div className="flex justify-center gap-8 mt-4 text-sm">
                <span>Level <b className="text-emerald-500">{lvl.lvl}</b></span>
                <span>Poin <b className="text-emerald-500">{progress.points}</b></span>
                <span>Skor <b className="text-emerald-500">{sim!.pct}%</b></span>
              </div>
            </div>
            <button onClick={downloadCert} className="mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 transition">Unduh Sertifikat (HTML/cetak PDF)</button>
          </>
        ) : (
          <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-6 text-center">
            <div className="text-4xl mb-2">🔒</div>
            <p className="font-semibold">Sertifikat belum terbuka</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selesaikan <b>Simulasi Akhir</b> dengan skor minimal 60%.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
