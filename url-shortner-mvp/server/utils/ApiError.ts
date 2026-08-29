export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  GONE: "GONE",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode =
  (typeof ErrorCodes)[keyof typeof ErrorCodes] | (string & {});

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
    isOperational = true
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = "Bad request", details?: unknown): ApiError {
    return new ApiError(400, ErrorCodes.VALIDATION_ERROR, message, details);
  }

  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(401, ErrorCodes.UNAUTHORIZED, message);
  }

  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(403, ErrorCodes.FORBIDDEN, message);
  }

  static notFound(message = "Not found"): ApiError {
    return new ApiError(404, ErrorCodes.NOT_FOUND, message);
  }

  static conflict(message = "Conflict"): ApiError {
    return new ApiError(409, ErrorCodes.CONFLICT, message);
  }

  static gone(message = "Resource is no longer available"): ApiError {
    return new ApiError(410, ErrorCodes.GONE, message);
  }

  static rateLimited(message = "Too many requests"): ApiError {
    return new ApiError(429, ErrorCodes.RATE_LIMITED, message);
  }

  static internal(
    message = "Internal server error",
    details?: unknown
  ): ApiError {
    return new ApiError(
      500,
      ErrorCodes.INTERNAL_ERROR,
      message,
      details,
      false
    );
  }
}
