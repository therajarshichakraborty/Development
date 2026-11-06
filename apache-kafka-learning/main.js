/**
 * input and output operations are very fast = high throughput system
 * for messaging = to exchange data between applications
 *
 * data order/sequence do not matter ;
 * stock market data ->
 * zomato rider update ->
 *
 *  socket.on("rider:location", (location)=>{
 *  customer_emit(location)
 *  sql `INSERT into Location_log rider id`
 *  })
 * 
 */

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const main = async () => {
  const app = express();
  const server = createServer(app);
  const io = new 
  Server();
  const PORT = process.env.port ?? 8080;

  io.attach(server);

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "./public")));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

await main();