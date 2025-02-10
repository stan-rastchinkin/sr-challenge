import { startPolling } from "./crawler";

const store = {
  events: []
}

const POLL_INTERVAL_MAX = 950; // todo: make this configurable

const main = async () => {
  const stop = startPolling(store, POLL_INTERVAL_MAX);

  process.on('SIGINT', () => {
    stop();
  });
}

main();