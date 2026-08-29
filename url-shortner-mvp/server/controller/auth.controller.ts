import type { Request, Response, RequestHandler } from "express";
import { authService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export interface AuthController {
  register: RequestHandler;
  login: RequestHandler;
  getMe: RequestHandler;
}

export const authController: AuthController = {
  register: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user, token } = await authService.register(req.body);
    res
      .status(201)
      .json(ApiResponse.created({ user, token }, "Registration successful"));
  }),

  login: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user, token } = await authService.login(req.body);
    res.status(200).json(ApiResponse.ok({ user, token }, "Login successful"));
  }),

  getMe: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getMe(req.userId!);
    res.status(200).json(ApiResponse.ok({ user }, "Current user fetched"));
  }),
};
