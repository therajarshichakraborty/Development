import http, {
  createServer,
  type IncomingMessage,
  type ServerResponse,
  type Server,
} from "node:http";
import application from "./app.js";
import { env } from "./config/env.config.js";
import connectToDatabase from "./config/db.config.js";

async function bootStrap(): Promise<void> {
  const app = await application();
  const server: Server = createServer(app);

  server.listen(env.PORT, () => {
    console.log(`Server is running on port http://localhost:${env.PORT}`);
  });

  server.on("error", error => {
    console.error("Server failed to start", error);
    process.exit(1);
  });

  process.on("SIGINT", () => {
    console.log("Server is shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  await connectToDatabase().then(() => {
    console.log("Database connected successfully!");
  }).catch((error: unknown) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
}

bootStrap()
  .then(() => {
    console.log("Server started successfully");
  })
  .catch(error => {
    console.error("Server failed to start", error);
    process.exit(1);
  });
