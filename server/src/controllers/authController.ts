import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByEmail,
} from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import type { User } from '../types/index.js';

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function sendAuthResponse(
  res: Response,
  user: User,
  statusCode: number,
): void {
  const token = signToken({ id: user.id, email: user.email });
  res.cookie('token', token, cookieOptions);

  const { passwordHash: _passwordHash, ...safeUser } = user;
  res.status(statusCode).json({ user: safeUser });
}

export async function signup(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    res
      .status(400)
      .json({ message: 'Name, email and password are required.' });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: 'Password must be at least 6 characters.' });
    return;
  }

  const existing = findUserByEmail(email);
  if (existing) {
    res
      .status(409)
      .json({ message: 'An account with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({ name, email, passwordHash });

  sendAuthResponse(res, user, 201);
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res
      .status(400)
      .json({ message: 'Email and password are required.' });
    return;
  }

  const user = findUserByEmail(email);
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  sendAuthResponse(res, user, 200);
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully.' });
}

export function getMe(req: Request, res: Response): void {
  res.status(200).json({ user: req.user });
}
