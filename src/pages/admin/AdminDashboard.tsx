import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card, Bar, Stat } from "../../components/ui";

interface Analytics {
  totalStudents: number;
  totalModules: number;
  avgPoints: number;
  completionRate: number;
  moduleStats: { id: string; slug: string; title: string; completions: number; avgQuizPct: number; quizAttempts: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setData(res.data.analytics)).catch(console.error);
  }, []);

  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" /></div>;

  function downloadCSV() {
    api.get("/admin/export/csv", { responseType: "blob" }).then((res) => {
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a"); a.href = url; a.download = "digifinquest_report.csv"; a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Analitik Keseluruhan</h3>
          <button onClick={downloadCSV} className="text-sm rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 transition">⬇ Export CSV</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Total Mahasiswa" value={data.totalStudents} icon="👥" />
          <Stat label="Total Modul" value={data.totalModules} icon="📚" />
          <Stat label="Rata-rata Poin" value={data.avgPoints} icon="⭐" />
          <Stat label="Tingkat Penyelesaian" value={`${data.completionRate}%`} icon="✅" />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Performa Per Modul</h3>
        <div className="space-y-4">
          {data.moduleStats.map((m) => (
            <div key={m.id} className="rounded-xl bg-slate-50 dark:bg-white/5 p-4">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold">{m.title}</h4>
                <span className="text-xs text-slate-400">{m.quizAttempts} percobaan</span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs text-slate-400 w-20">Kuis avg</span>
                <div className="flex-1"><Bar pct={m.avgQuizPct} /></div>
                <span className="text-sm font-bold w-12 text-right">{m.avgQuizPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20">Selesai</span>
                <span className="text-sm font-semibold">{m.completions} mahasiswa</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
