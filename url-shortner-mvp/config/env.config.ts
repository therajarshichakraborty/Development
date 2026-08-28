import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

export const env = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development")
      .describe("The deployment environment of the application"),

    DATABASE_URL: z
      .string()
      .describe("The connection string for the main database"),

    PORT: z.coerce
      .number()
      .default(4040)
      .describe("The port number for the server"),

    JWT_SECRET: z.string().describe("Secret key for signing JWT tokens"),

    JWT_EXPIRES_IN: z
      .string()
      .default("7d")
      .describe("JWT token expiration time (e.g. '7d', '24h')"),

    BASE_URL: z
      .string()
      .default("http://localhost:4040")
      .describe("Base URL for constructing short links in responses"),
  })
  .parse(process.env);

export type Env = typeof env;
