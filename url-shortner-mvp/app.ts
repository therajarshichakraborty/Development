import express from "express";
import type { Application, Request, Response } from "express";

async function application(): Promise<Application> {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (_: Request, res: Response) => {
    res.status(200).json({ message: "URL Shortner MVP" });
  });

  app.get("/health", (_: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
  });
  return app;
}

export default application;
