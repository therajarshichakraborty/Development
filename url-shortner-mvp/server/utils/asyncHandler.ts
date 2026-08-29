import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (
  func: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<unknown> | unknown
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

export default asyncHandler;
