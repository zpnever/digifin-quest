import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { Brand, Card, ThemeToggle } from "../components/ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email wajib diisi";
    if (!password) e.password = "Kata sandi wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Berhasil masuk!");
      // Auth context will update, let the router handle redirect
      const user = JSON.parse(localStorage.getItem("dfq_user") || "{}");
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Gagal masuk. Periksa email dan kata sandi.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-[#0B1F3A] via-[#13294e] to-emerald-900">
        <button onClick={() => navigate("/")}><Brand light size="text-3xl" /></button>
        <div>
          <h1 className="text-5xl font-black leading-tight">Selamat<br />datang kembali.</h1>
          <p className="mt-4 text-slate-300 max-w-md text-lg">Lanjutkan petualangan Anda dari titik terakhir.</p>
          <div className="mt-8 flex gap-3 flex-wrap">
            {["🧭 Explore", "📈 Invest", "🛡️ Stay Safe", "🔥 Streak"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm font-medium border border-white/10">{t}</span>
            ))}
          </div>
        </div>
        <p className="text-slate-400 text-sm">DigiFin Quest · Gamified Fintech Learning</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate("/")} className="lg:hidden"><Brand /></button>
            <span className="text-sm text-slate-400">Masuk</span>
            <ThemeToggle />
          </div>
          <h2 className="text-2xl font-bold mb-1">Selamat datang kembali</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Masuk dengan email dan kata sandi Anda.</p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anda@kampus.ac.id" type="email"
              className="w-full mb-1 rounded-xl border border-slate-300 dark:border-white/15 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.email && <p className="text-xs text-rose-500 mb-3">{errors.email}</p>}
            {!errors.email && <div className="mb-3" />}

            <label className="block text-sm font-medium mb-1">Kata Sandi</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••"
              className="w-full mb-1 rounded-xl border border-slate-300 dark:border-white/15 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.password && <p className="text-xs text-rose-500 mb-3">{errors.password}</p>}
            {!errors.password && <div className="mb-6" />}

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 transition shadow-lg shadow-emerald-500/30">
              {loading ? "Memproses..." : "Masuk →"}
            </button>
          </form>

          <button onClick={() => navigate("/register")} className="w-full text-center text-sm text-slate-500 dark:text-slate-400 mt-4 hover:text-emerald-500">
            Baru di sini? Buat akun
          </button>
        </Card>
      </div>
    </div>
  );
}
