import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.config.js";

export interface JwtUserPayload {
  id: string;
  email: string;
  roles?: string[] | undefined;
}

export const generateToken = (payload: JwtUserPayload): string => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  const expiresIn = (env.JWT_EXPIRES_IN || "7d") as NonNullable<
    SignOptions["expiresIn"]
  >;
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtUserPayload => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  return jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
};
