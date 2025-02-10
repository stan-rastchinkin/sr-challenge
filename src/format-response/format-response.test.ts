import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatResponseObject, newResponseFormatter } from './format-response';
import * as mapper from '../mapper';

const testMapper = {
  mapId: (id: string) => {
    const testMappings = {
      "a": "Real Madrid",
      "b": "Manchester United",
      "c": "UEFA Champions League",
      "d": "FOOTBALL",
      "e": "PRE",
      "f": "LIVE",
      "g": "REMOVED",
      "h": "CURRENT",
    }

    return testMappings[id];
  },
}

const testEvent = {
  // sportEventId: "some-sport-event-id",
  sportId: "d",
  competitionId: "c",
  startTimestamp: 1739215272157,
  homeCompetitorId: "a",
  awayCompetitorId: "b",
  sportEventStatusId: "f",
  scores: [
    {
      periodId: "h",
      home: 1,
      away: 2
    }
  ]
}

const expectedResponseObject = {
  status: "LIVE",
  scores: {
    CURRENT: {
      type: "CURRENT",
      home: 1,
      away: 2
    }
  },
  startTime: "2025-02-10T19:21:12.157Z",
  sport: "FOOTBALL",
  competitors: {
    HOME: {
      type: "HOME",
      name: "Real Madrid"
    },
    AWAY: {
      type: "AWAY",
      name: "Manchester United"
    }
  },
  competition: "UEFA Champions League"
}


describe('formatResponseObject', () => {
  it('should format response according to expected shape', () => {
    const input = {
      events: [
        {
          ...testEvent,
          sportEventId: "some-sport-event-id",
        }
      ]
    };

    const expected = {
      "some-sport-event-id": {
        ...expectedResponseObject,
        id: "some-sport-event-id",
      }
    };

    expect(formatResponseObject(testMapper, input.events)).toEqual(expected);
  });

  it('should skip events with REMOVED status', () => {
      const input = {
        events: [
          {
            ...testEvent,
            sportEventId: "some-sport-event-id",
          },
          {
            ...testEvent,
            sportEventId: "must-be-removed",
            sportEventStatusId: "g",
          },
        ]
      };

      const expected = {
        "some-sport-event-id": {
          ...expectedResponseObject,
          id: "some-sport-event-id",
        }
      };

      expect(formatResponseObject(testMapper, input.events)).toEqual(expected);
  });
});

describe('ResponseFormatter', () => {
    const newMapperSpy = vi.spyOn(mapper, 'newMapper');

    afterEach(() => {
      newMapperSpy.mockReset();
    })

    it('should create new Mapper and retry once on MappingNotFoundError', async () => {
        newMapperSpy.mockResolvedValueOnce({ mapId: () => {
          throw new mapper.MappingNotFoundError('Mapping not found');
        }});

        newMapperSpy.mockResolvedValueOnce({ mapId: testMapper.mapId });

        const responseFormatter = await newResponseFormatter();

        const result = await responseFormatter([{ ...testEvent, sportEventId: "some-sport-event-id" }]);

        expect(result).toEqual({
          "some-sport-event-id": {
            ...expectedResponseObject,
            id: "some-sport-event-id",
          }
        });
        expect(newMapperSpy).toHaveBeenCalledTimes(2);
    });

    it('should rethrow error if new Mapper also fails', async () => {
        newMapperSpy.mockResolvedValue({ mapId: () => {
          throw new mapper.MappingNotFoundError('Mapping not found');
        }});

        const responseFormatter = await newResponseFormatter();

        await expect(
          responseFormatter([{ ...testEvent, sportEventId: "some-sport-event-id" }])
        ).rejects.toThrow(new mapper.MappingNotFoundError('Mapping not found'));
    });
});
