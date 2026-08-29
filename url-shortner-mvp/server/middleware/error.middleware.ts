import type { Request, Response, NextFunction } from "express";
import { ApiError, ErrorCodes } from "../server/utils/ApiError.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null,
      },
    });
    return;
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message:
        err instanceof Error && err.message
          ? err.message
          : "Internal server error",
    },
  });
};
