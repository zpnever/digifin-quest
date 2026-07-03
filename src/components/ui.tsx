import React from "react";
import { cls } from "../lib/utils";

export function Brand({ light = false, size = "text-2xl" }: { light?: boolean; size?: string }) {
  return (
    <div className={cls("font-extrabold tracking-tight flex items-center gap-2", size)}>
      <span className="inline-grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xl shadow-lg shadow-emerald-500/40 fq-float">₣</span>
      <span className={light ? "text-white" : ""}>DigiFin<span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> Quest</span></span>
    </div>
  );
}

export function LogoBar({ className = "", onWhite = false }: { className?: string; onWhite?: boolean }) {
  return (
    <div className={cls("flex items-center gap-4 flex-wrap", className)}>
      <img src="/logos/aacsb.jpg" alt="AACSB Business Education Alliance" className="h-10 w-auto rounded-md" />
      <img src="/logos/feb-unj.jpg" alt="FEB UNJ" className={cls("h-10 w-auto rounded-md", onWhite ? "" : "bg-white/90 p-1")} />
    </div>
  );
}

export function Card({ children, className, hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cls("rounded-3xl bg-white dark:bg-white/[0.04] border-2 border-slate-100 dark:border-white/10 shadow-[0_4px_0_0_rgba(15,31,58,0.06)] dark:shadow-none",
      hover && "fq-hover fq-press cursor-pointer", className)}>
      {children}
    </div>
  );
}

export function Bar({ pct, color = "bg-gradient-to-r from-emerald-400 to-teal-500" }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden p-0.5">
      <div className={cls("h-full rounded-full transition-all duration-700 ease-out", color)} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

export function GoldChip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">{children}</span>;
}

const STAT_TINT: Record<string, string> = {
  "⭐": "from-amber-300 to-amber-500", "🚀": "from-violet-400 to-purple-500",
  "🎖️": "from-pink-400 to-rose-500", "🔥": "from-orange-400 to-red-500",
  "📚": "from-sky-400 to-blue-500", "📝": "from-emerald-400 to-teal-500",
  "🧠": "from-fuchsia-400 to-pink-500", "💰": "from-emerald-400 to-green-600",
  "🐷": "from-pink-300 to-pink-500", "✅": "from-emerald-400 to-teal-500",
  "🎮": "from-indigo-400 to-violet-500", "👥": "from-cyan-400 to-sky-500",
  "🔁": "from-slate-400 to-slate-600",
};

export function Stat({ label, value, icon, small }: { label: string; value: string | number; icon: string; small?: boolean }) {
  const tint = STAT_TINT[icon] || "from-emerald-400 to-teal-500";
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3 border-2 border-slate-100 dark:border-white/10 fq-hover">
      <div className={cls("inline-grid place-items-center w-10 h-10 rounded-xl text-xl text-white shadow-md bg-gradient-to-br", tint)}>{icon}</div>
      <div className={cls("font-extrabold mt-2", small ? "text-sm" : "text-2xl")}>{value}</div>
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"));

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dfq_theme", next ? "dark" : "light");
  };

  return (
    <button onClick={toggle} className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-white/10 transition" title="Toggle theme">
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
