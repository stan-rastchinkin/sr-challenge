import { getState } from "../api-client";
import { EventState, parseOdds } from "./odds";

type StopFunction = () => void;

export const startPolling = (store: { events: EventState[] }, maxPollInterval: number): StopFunction => {
  let RUN_LOOP = true;

  const stop = () => {
    RUN_LOOP = false;
  }

  const run = async () => {
    while (RUN_LOOP) {
      const start = Date.now();
      const state = await getState();
      store.events = parseOdds(state.odds);

      const duration = Date.now() - start;
      let delay = maxPollInterval - duration;
      delay = delay < 0 ? 0 : delay;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  run();
  return stop;
}
