import type { NextFunction, Request, Response } from "express";

const asyncHandler = (func: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  };
};

export default asyncHandler;
