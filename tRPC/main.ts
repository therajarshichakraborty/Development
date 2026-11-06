import dotenv from "dotenv";
dotenv.config();

import { createServer , type Server} from "node:http";
import express, { type Express } from "express";
import { log } from "node:console";

const port = Number(process.env.PORT) || 7000;

function bootStrapServerApplication():void {
  const application: Express = express();
  const server: Server = createServer(application);

  application
    .use(express.json({ limit: "50kb" }))
    .use(express.urlencoded({ extended: true }))
    .get('/',(_req,res) => {
      return res.json({ health:"Health is Good" })
    })
    
    server.listen(port,()=>{
      log(`Server is running on port ${port}`)
    })
}


bootStrapServerApplication();
