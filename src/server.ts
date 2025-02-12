import http from "node:http";

import { newResponseFormatter } from "./format-response/";

import type { EventState } from "./crawler";
import { config } from "./config";

const respond = (res: http.ServerResponse, status: number, payload: any) => {
  const body = JSON.stringify(payload);
  return res
    .writeHead(status, { "Content-Length": body.length, "Content-Type": "application/json" })
    .end(body);
}

export const startServer = async (store: {events: EventState[]}): Promise<http.Server> => {
  const formatResponseObject = await newResponseFormatter();

  const requestListener = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === "/client/state") {

      try {
        respond(res, 200, await formatResponseObject(store.events));
      } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal server error");
      }

      return;
    }

    respond(res, 404, { message: "Not found" });
  };

  const server = http.createServer(requestListener);
  server.listen(config.port, "0.0.0.0", () => {
    console.info(`Server is running on port: ${config.port}`);
  });

  return server;
}
