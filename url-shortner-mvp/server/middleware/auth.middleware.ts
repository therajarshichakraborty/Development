import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../server/utils/ApiError.js";
import { verifyToken } from "../server/utils/jwt.js";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("No token provided"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(ApiError.unauthorized("Malformed authorization token"));
  }

  try {
    const decodedPayload = verifyToken(token);
    req.user = decodedPayload;
    req.userId = decodedPayload.id;
    next();
  } catch (_error) {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};
