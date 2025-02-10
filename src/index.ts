import { startPolling } from "./crawler";
import { startServer } from "./server";

import type { EventState } from "./crawler";

const store: { events: EventState[] } = {
  events: [],
}

const POLL_INTERVAL_MAX = 950; // todo: make this configurable

const main = async () => {
  const stop = startPolling(store, POLL_INTERVAL_MAX);

  const server = await startServer(store);

  process.on('SIGINT', () => {
    stop();
    server.close();
  });
}

main();