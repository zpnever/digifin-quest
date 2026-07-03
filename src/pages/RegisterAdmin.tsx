import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { Brand, Card, ThemeToggle } from "../components/ui";

export default function RegisterAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nama wajib diisi";
    if (!email.trim()) e.email = "Email wajib diisi";
    if (!password) e.password = "Kata sandi wajib diisi";
    else if (password.length < 6) e.password = "Kata sandi minimal 6 karakter";
    if (!adminCode.trim()) e.adminCode = "Kode admin wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerAdmin(name, email, password, adminCode);
      toast.success("Akun admin berhasil dibuat!");
      navigate("/admin");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Gagal membuat akun admin.";
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
          <h1 className="text-5xl font-black leading-tight">Registrasi<br />Dosen / Admin.</h1>
          <p className="mt-4 text-slate-300 max-w-md text-lg">Buat akun admin untuk mengelola modul, kuis, dan melihat analitik mahasiswa.</p>
        </div>
        <p className="text-slate-400 text-sm">DigiFin Quest · Admin Panel</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate("/")} className="lg:hidden"><Brand /></button>
            <span className="text-sm text-slate-400">Register Admin</span>
            <ThemeToggle />
          </div>
          <h2 className="text-2xl font-bold mb-1">Buat akun Dosen</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Masukkan kode admin yang diberikan untuk mendaftar.</p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Dr. Ahmad"
              className="w-full mb-1 rounded-xl border border-slate-300 dark:border-white/15 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.name && <p className="text-xs text-rose-500 mb-3">{errors.name}</p>}
            {!errors.name && <div className="mb-3" />}

            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dosen@kampus.ac.id" type="email"
              className="w-full mb-1 rounded-xl border border-slate-300 dark:border-white/15 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.email && <p className="text-xs text-rose-500 mb-3">{errors.email}</p>}
            {!errors.email && <div className="mb-3" />}

            <label className="block text-sm font-medium mb-1">Kata Sandi</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Minimal 6 karakter"
              className="w-full mb-1 rounded-xl border border-slate-300 dark:border-white/15 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.password && <p className="text-xs text-rose-500 mb-3">{errors.password}</p>}
            {!errors.password && <div className="mb-3" />}

            <label className="block text-sm font-medium mb-1">Kode Admin</label>
            <input value={adminCode} onChange={(e) => setAdminCode(e.target.value)} type="password" placeholder="Masukkan kode admin"
              className="w-full mb-1 rounded-xl border border-slate-300 dark:border-white/15 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            {errors.adminCode && <p className="text-xs text-rose-500 mb-3">{errors.adminCode}</p>}
            {!errors.adminCode && <div className="mb-6" />}
            <p className="text-xs text-slate-400 mb-4">Kode admin diperlukan untuk mencegah pembuatan akun admin yang tidak sah.</p>

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 transition shadow-lg shadow-emerald-500/30">
              {loading ? "Memproses..." : "Buat akun admin →"}
            </button>
          </form>

          <button onClick={() => navigate("/login")} className="w-full text-center text-sm text-slate-500 dark:text-slate-400 mt-4 hover:text-emerald-500">
            Sudah punya akun? Masuk
          </button>
        </Card>
      </div>
    </div>
  );
}
