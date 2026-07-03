import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Brand, ThemeToggle } from "../components/ui";
import { cls } from "../lib/utils";

const NAV_ITEMS = [
  { path: "/dashboard", label: "📊 Dasbor" },
  { path: "/modules", label: "📚 Modul" },
  { path: "/game", label: "🎯 Game Skenario" },
  { path: "/simulation", label: "🏁 Simulasi Akhir" },
  { path: "/leaderboard", label: "🏆 Papan Peringkat" },
  { path: "/badges", label: "🎖️ Lencana" },
  { path: "/analytics", label: "📈 Analitik" },
  { path: "/profile", label: "👤 Profil" },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <Brand />
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate("/profile")} className="w-10 h-10 grid place-items-center rounded-2xl bg-gradient-to-br from-[#0B1F3A] to-emerald-700 text-white font-extrabold shadow-md fq-press" title="Profil">
            {(user?.name || "S")[0].toUpperCase()}
          </button>
          <ThemeToggle />
          <button onClick={() => { logout(); navigate("/"); }} className="px-3 py-1.5 rounded-full border-2 border-slate-200 dark:border-white/15 font-semibold hover:border-rose-400 hover:text-rose-500 transition fq-press">
            Keluar
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {NAV_ITEMS.map(({ path, label }) => (
          <button key={path} onClick={() => navigate(path)}
            className={cls("px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all fq-press",
              location.pathname.startsWith(path)
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_4px_0_0_rgba(13,148,136,0.5)] scale-105"
                : "bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 hover:border-emerald-300 hover:-translate-y-0.5"
            )}>
            {label}
          </button>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
