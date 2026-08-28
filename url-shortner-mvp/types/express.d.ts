import "express";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUser;
      userId?: string;
    }
  }
}

export {};
