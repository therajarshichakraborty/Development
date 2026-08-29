import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    email: z.email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password is too long" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ message: "Invalid email format" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const validate = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed && typeof parsed === "object") {
        if ("body" in parsed && parsed.body !== undefined) {
          req.body = parsed.body;
        }
        if ("query" in parsed && parsed.query !== undefined) {
          Object.defineProperty(req, "query", {
            value: parsed.query,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }
        if ("params" in parsed && parsed.params !== undefined) {
          Object.defineProperty(req, "params", {
            value: parsed.params,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join(".").replace(/^body\./, ""),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: formattedErrors,
          },
        });
        return;
      }
      return next(error);
    }
  };
};
