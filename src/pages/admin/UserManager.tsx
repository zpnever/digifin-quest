import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card } from "../../components/ui";

interface UserData {
  id: string; name: string; email: string; points: number; streak: number; joinedAt: string;
  _count: { completedLessons: number; quizScores: number; badges: number; scenarioResults: number };
}

export default function UserManager() {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data.users)).catch(console.error);
  }, []);

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Daftar Mahasiswa ({users.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-left">
              <th className="pb-3 font-semibold">#</th>
              <th className="pb-3 font-semibold">Nama</th>
              <th className="pb-3 font-semibold">Email</th>
              <th className="pb-3 font-semibold text-center">Poin</th>
              <th className="pb-3 font-semibold text-center">Streak</th>
              <th className="pb-3 font-semibold text-center">Modul</th>
              <th className="pb-3 font-semibold text-center">Kuis</th>
              <th className="pb-3 font-semibold text-center">Lencana</th>
              <th className="pb-3 font-semibold text-center">Skenario</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="py-3">{i + 1}</td>
                <td className="py-3 font-semibold">{u.name}</td>
                <td className="py-3 text-slate-500">{u.email}</td>
                <td className="py-3 text-center font-bold text-emerald-500">{u.points}</td>
                <td className="py-3 text-center">{u.streak}d</td>
                <td className="py-3 text-center">{u._count.completedLessons}</td>
                <td className="py-3 text-center">{u._count.quizScores}</td>
                <td className="py-3 text-center">{u._count.badges}</td>
                <td className="py-3 text-center">{u._count.scenarioResults}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Belum ada mahasiswa terdaftar.</p>}
    </Card>
  );
}
