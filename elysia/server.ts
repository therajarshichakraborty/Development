import http from "node:http"
// import { initServer } from "./index.js"
import { log } from "node:console";

export async function bootStrap(){
  // const app = await initServer();

  try{
   // const server = await app.server;

    // server.listen(3000, () => {
    //   console.log("Server is running on port 3000");
    // });

  } catch (error) {
    log(error)
  }
}