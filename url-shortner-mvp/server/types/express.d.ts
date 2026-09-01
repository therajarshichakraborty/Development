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

/**
 * 
@types/express.d.ts
import { JwtPayload } from 'jsonwebtoken'; // Or your custom payload interface

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
      userId?: string;
    }
  }
}
*/

export {};
