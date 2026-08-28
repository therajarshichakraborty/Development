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
      .url()
      .describe("The connection string for the main database"),

    PORT: z.coerce
      .number()
      .default(4040)
      .describe("The port number for the server"),
  })
  .parse(process.env);

export type Env = typeof env;
