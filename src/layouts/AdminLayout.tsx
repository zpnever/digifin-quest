import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Brand, ThemeToggle } from "../components/ui";
import { cls } from "../lib/utils";

const NAV_ITEMS = [
  { path: "/admin", label: "📈 Analitik", exact: true },
  { path: "/admin/modules", label: "📝 Modul" },
  { path: "/admin/games", label: "🎮 Game" },
  { path: "/admin/users", label: "👥 Pengguna" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Brand />
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-white/10 font-semibold">🧑‍🏫 {user?.name}</span>
          <ThemeToggle />
          <button onClick={() => { logout(); navigate("/"); }} className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/15 hover:border-rose-400 hover:text-rose-500 transition">
            Keluar
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {NAV_ITEMS.map(({ path, label, exact }) => (
          <button key={path} onClick={() => navigate(path)}
            className={cls("px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all fq-press",
              isActive(path, exact)
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
