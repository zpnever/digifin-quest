import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register — Mahasiswa registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Nama, email, dan kata sandi wajib diisi" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Kata sandi minimal 6 karakter" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email sudah terdaftar" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "STUDENT" },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/auth/register/admin — Admin/Dosen registration with code
router.post("/register/admin", async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password || !adminCode) {
      res.status(400).json({ error: "Semua field wajib diisi termasuk kode admin" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Kata sandi minimal 6 karakter" });
      return;
    }

    if (adminCode !== process.env.ADMIN_REGISTER_CODE) {
      res.status(403).json({ error: "Kode admin tidak valid" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email sudah terdaftar" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "ADMIN" },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register admin error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email dan kata sandi wajib diisi" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Email atau kata sandi salah" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Email atau kata sandi salah" });
      return;
    }

    // Update streak on login
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak = user.streak;
    let pointsBonus = 0;

    if (user.lastLoginDay !== today) {
      newStreak = user.lastLoginDay === yesterday ? user.streak + 1 : 1;
      pointsBonus = 20; // POINTS.dailyLogin

      await prisma.user.update({
        where: { id: user.id },
        data: {
          streak: newStreak,
          lastLoginDay: today,
          points: user.points + pointsBonus,
          todayLessons: 0,
        },
      });

      // Award streak badge
      if (newStreak >= 5) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId: user.id, badgeId: "streak5" } },
          create: { userId: user.id, badgeId: "streak5" },
          update: {},
        });
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points + pointsBonus,
        streak: newStreak,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// GET /api/auth/me — Get current user
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, name: true, email: true, role: true,
        points: true, streak: true, lastLoginDay: true,
        todayLessons: true, joinedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default router;
