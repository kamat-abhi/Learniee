import type { NextFunction, Request, Response } from 'express';
import { findUserById } from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export function protect(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res
      .status(401)
      .json({ message: 'Not authenticated. Please log in.' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    const user = findUserById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User no longer exists.' });
      return;
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session.' });
  }
}
