import React from "react";
import { useProgress } from "../../hooks/useProgress";
import { Card } from "../../components/ui";
import { BADGES } from "../../constants/badges";
import { cls } from "../../lib/utils";

export default function Badges() {
  const { progress } = useProgress();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {BADGES.map((b) => {
        const has = progress.badges.includes(b.id);
        return (
          <Card key={b.id} hover={has} className={cls("p-6 text-center relative overflow-hidden", has ? "ring-2 ring-amber-300 dark:ring-amber-400/40" : "opacity-60")}>
            {has && <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-2xl bg-amber-300/40" />}
            <div className={cls("text-6xl mb-3 inline-block relative", has ? "fq-float" : "grayscale")}>{b.icon}</div>
            <h3 className="font-extrabold">{b.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{b.desc}</p>
            <span className={cls("inline-block mt-3 text-xs font-bold px-4 py-1.5 rounded-full", has ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md" : "bg-slate-100 dark:bg-white/5 text-slate-400")}>{has ? "✓ Diraih" : "🔒 Terkunci"}</span>
          </Card>
        );
      })}
    </div>
  );
}
