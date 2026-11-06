import { log } from "@repo/logger";
import { scaffoldExpressApplication } from "./server";
import { createServer, type Server } from "node:http";

const port = Number(process.env.PORT) || 5001;

export default async function bootstrapApplication() {
  const application = scaffoldExpressApplication();
  const server: Server = createServer(application);

  server.listen(port, () => {
    log(`api running on ${port}`);
  });
}

await bootstrapApplication()
  .then(()=>{ log(`server is running successfully`) })
  .catch(()=>{ log(`server failed to initialize due to some error`);
    process.exit(1);
  });
