import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function registerUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) 
      return res.status(400).json({ error: 'Username and password required.' });
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) 
      return res.status(400).json({ error: 'Username already taken.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword }
    });
    res.status(201).json({ message: 'User created.', user: { id: newUser.id, username: newUser.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) 
      return res.status(400).json({ error: 'Username and password required.' });
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) 
      return res.status(401).json({ error: 'User not found.' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) 
      return res.status(401).json({ error: 'Invalid password.' });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
