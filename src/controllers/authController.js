import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password harus disertakan" });
  }
  try {
    // Periksa apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    });
    res.status(201).json({ message: "User berhasil terdaftar", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password harus disertakan" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Kredensial tidak valid" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Kredensial tidak valid" });
    }
    // Buat token JWT untuk sesi login
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function generateApiToken(req, res) {
  try {
    const apiToken = crypto.randomBytes(32).toString('hex');
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { apiToken }
    });
    res.json({ apiToken });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
