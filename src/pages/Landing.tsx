import React from "react";
import { useNavigate } from "react-router-dom";
import { Brand, Card, GoldChip, LogoBar, ThemeToggle } from "../components/ui";
import { cls } from "../lib/utils";

const MODULE_PREVIEW = [
  { num: 1, title: "Fintech Basics", topics: ["Definisi Fintech", "Jenis Fintech", "Ekosistem", "Manfaat & Risiko"] },
  { num: 2, title: "Digital Payment & E-Wallet", topics: ["E-wallet", "QRIS", "Mobile Banking", "Keamanan Transaksi"] },
  { num: 3, title: "Budgeting & Personal Finance", topics: ["Penganggaran", "Menabung", "Dana Darurat", "Perencanaan"] },
  { num: 4, title: "Fintech Lending / Pinjaman Online", topics: ["P2P Lending", "Pinjol Legal vs Ilegal", "Bunga & Biaya", "Risiko Utang"] },
  { num: 5, title: "Digital Financial Security", topics: ["Phishing", "Social Engineering", "Autentikasi 2FA", "Perlindungan Data"] },
  { num: 6, title: "Consumer Protection", topics: ["Hak Konsumen", "Penyelesaian Sengketa", "Transparansi", "Pengaduan"] },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 dark:bg-[#0B1F3A]/80 border-b border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => navigate("/login")} className="px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition">Masuk</button>
            <button onClick={() => navigate("/register")} className="px-4 py-2 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-lg shadow-emerald-500/30">Mulai</button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#13294e] to-[#0B1F3A] dark:from-black/40 dark:via-transparent dark:to-black/40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 lg:py-28 text-white">
          <GoldChip>★ Belajar Fintech Berbasis Permainan</GoldChip>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black leading-[1.05] max-w-3xl">
            Kuasai keuangan digital,<br /><span className="text-emerald-400">satu petualangan demi petualangan.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-xl">
            DigiFin Quest mengubah literasi keuangan digital menjadi permainan. Lima modul, keterampilan nyata, poin, lencana, dan level — dirancang untuk mahasiswa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => navigate("/register")} className="px-6 py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 transition shadow-xl shadow-emerald-500/30">Mulai belajar gratis →</button>
            <button onClick={() => navigate("/login")} className="px-6 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 transition">Saya sudah punya akun</button>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
            <span>📚 6 modul</span><span>❓ 60 soal kuis</span><span>🎖️ 7 lencana</span><span>🏆 Papan peringkat langsung</span>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Didukung oleh</p>
            <LogoBar onWhite />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">Yang akan Anda peroleh</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">Platform ini menargetkan lima capaian terukur yang bersumber dari riset literasi keuangan dan adopsi teknologi.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            ["💡", "Literasi Keuangan Digital", "Memahami penganggaran, pembayaran, dan investasi."],
            ["📲", "Adopsi Fintech", "Membangun niat dan kepercayaan diri menggunakan fintech."],
            ["💪", "Efikasi Diri Keuangan", "Memercayai kemampuan diri mengelola uang."],
            ["✅", "Perilaku Bertanggung Jawab", "Membuat pilihan keuangan yang lebih aman dan cermat."],
            ["🎮", "Pengalaman yang Menarik", "Tetap termotivasi lewat kemajuan berbasis permainan."],
          ].map(([icon, t, d]) => (
            <Card key={t} className="p-5">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold mb-1">{t}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <h2 className="text-2xl font-bold mb-6">Kurikulum</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_PREVIEW.map((m) => (
            <Card key={m.num} className="p-5 hover:shadow-md transition">
              <span className="text-xs font-bold text-emerald-500">MODUL {m.num}</span>
              <h3 className="font-bold mt-1 mb-2">{m.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {m.topics.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5">{t}</span>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-10 text-center text-white">
          <h2 className="text-3xl font-black mb-3">Siap memulai petualangan Anda?</h2>
          <p className="text-emerald-50 mb-6">Buat akun dan raih lencana pertama Anda dalam hitungan menit.</p>
          <button onClick={() => navigate("/register")} className="px-8 py-3 rounded-xl font-bold bg-white text-emerald-700 hover:bg-emerald-50 transition">Mulai sekarang →</button>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col items-center gap-4">
          <LogoBar />
          <p className="text-center text-sm text-slate-400">DigiFin Quest · Dibuat untuk riset & pendidikan</p>
        </div>
      </footer>
    </div>
  );
}
