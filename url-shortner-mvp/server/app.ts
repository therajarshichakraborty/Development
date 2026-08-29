import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middleware/error.middleware.js";

async function application(): Promise<Application> {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
    })
  );

  app.use("/api/v1/auth", authRouter);

  app.get("/", (_: Request, res: Response) => {
    res.status(200).json({ message: "URL Shortner MVP" });
  });

  app.get("/health", (_: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
  });

  app.use(errorHandler);

  return app;
}

export default application;
