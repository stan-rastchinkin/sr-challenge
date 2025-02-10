import { MappingNotFoundError, newMapper } from "../mapper";

import type { EventState } from "../crawler";
import type { Mapper } from "../mapper";

export const formatResponseObject = (mapper: Mapper, events: EventState[]) => 
  events
    .reduce((acc, event) => {
      const status = mapper.mapId(event.sportEventStatusId);

      if (status === "REMOVED") {
        return acc;
      }

      acc[event.sportEventId] = {
        id: event.sportEventId,
        status,
        scores: event.scores.reduce((acc, score) => {
          const type = mapper.mapId(score.periodId);
          acc[type] = {
            type,
            home: score.home,
            away: score.away
          };

          return acc;
        }, {}),
        startTime: new Date(event.startTimestamp).toISOString(),
        sport: mapper.mapId(event.sportId),
        competitors: {
          "HOME": {
            "type": "HOME",
            "name": mapper.mapId(event.homeCompetitorId),
          },
          "AWAY": {
            "type": "AWAY",
            "name": mapper.mapId(event.awayCompetitorId),
          }
        },
        competition: mapper.mapId(event.competitionId),
      }

    return acc;
    }, new Object());

export const newResponseFormatter = async () => {
  let mapper = await newMapper();

  return async(events: EventState[]) => {
    try {
      return formatResponseObject(mapper, events);
    } catch (error) {
      if (error instanceof MappingNotFoundError) {
        mapper = await newMapper();
        return formatResponseObject(mapper, events);
      }

      throw error;
    }
  };
}