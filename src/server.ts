import http from "node:http";

import { newResponseFormatter } from "./format-response/";

import type { EventState } from "./crawler";

const PORT = 8000; // todo: make this configurable

export const startServer = async (store: {events: EventState[]}): Promise<http.Server> => {
  const formatResponseObject = await newResponseFormatter();

  const respond500 = (res: http.ServerResponse): http.ServerResponse => {
    const body = JSON.stringify({ error: "Internal server error" });
    return res
      .writeHead(500, { "Content-Length": body.length, "Content-Type": "application/json" })
      .end(body);
  }

  const respond404 = (res: http.ServerResponse): http.ServerResponse => {
    const body = JSON.stringify({ message: "Not found" });  
    return res
      .writeHead(404, { "Content-Length": body.length, "Content-Type": "application/json" })
      .end(body);
  }

  const respondOk = async (res: http.ServerResponse, events: EventState[]): Promise<http.ServerResponse> => {
    const body = JSON.stringify(await formatResponseObject(events));
    return res
      .writeHead(200, { "Content-Length": body.length, "Content-Type": "application/json" })
      .end(body);
  }

  const requestListener = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === "/client/state") {

      try {
        await respondOk(res, store.events);
      } catch (error) {
        console.error(error);
        respond500(res);
      }

      return;
    }

    respond404(res);
  };

  const server = http.createServer(requestListener);
  server.listen(PORT, "localhost", () => {
    console.log(`Server is running on port: ${PORT}`);
  });

  return server;
}
