import jwt, { type SignOptions } from "jsonwebtoken";
import type { AuthTokenPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

const JWT_EXPIRES_IN =
  (process.env.JWT_EXPIRES_IN || "7d") as NonNullable<SignOptions["expiresIn"]>;

export function signToken(payload: AuthTokenPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}