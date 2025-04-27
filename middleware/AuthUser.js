import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || "your-secret-key";

// Middleware untuk verifikasi user login
export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda (Token tidak ada)" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email, // kalau kamu simpan email di token, opsional
    };
    req.role = decoded.role; // tambahan ini supaya gampang akses role
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token tidak valid atau kadaluarsa" });
  }
};

// Middleware khusus admin
export const adminOnly = async (req, res, next) => {
  // Karena verifyUser harus dipakai sebelum adminOnly, req.user sudah ada
  if (!req.user) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Akses terlarang: Admin only" });
  }

  next();
};
