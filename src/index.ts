import { startPolling } from "./crawler";
import { startServer } from "./server";
import { config } from "./config";

import type { EventState } from "./crawler";

const store: { events: EventState[] } = {
  events: [],
}

const main = async () => {
  console.info(`Starting crawler with MAX_POLL_INTERVAL: ${config.maxPollInterval}ms`);
  console.info(`Consuming from: ${config.sourceBaseUrl}`);
  const stop = startPolling(store, config.maxPollInterval);

  const server = await startServer(store);

  process.on('SIGINT', () => {
    stop();
    server.close();
  });
}

main();