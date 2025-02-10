export type Score = {
  periodId: string;
  home: number;
  away: number;
}

export type EventState = {
  sportEventId: string;
  sportId: string;
  competitionId: string;
  startTimestamp: number;
  homeCompetitorId: string;
  awayCompetitorId: string;
  sportEventStatusId: string;
  scores: Score[];
};

const parseScores = (scores: string): Score[] => {
  const scoresRegex = /([^@|]+)@(\d+):(\d+)/g;
  const matches = scores.matchAll(scoresRegex);

  return Array.from(matches).map((match) => ({
    periodId: match[1],
    home: parseInt(match[2]),
    away: parseInt(match[3]),
  }));
}

const parseOddsLine = (oddsLine: string): EventState => {
  const matches = oddsLine.split(',');

  const state: EventState = {
    sportEventId: matches[0],
    sportId: matches[1],
    competitionId: matches[2],
    startTimestamp: parseInt(matches[3]),
    homeCompetitorId: matches[4],
    awayCompetitorId: matches[5],
    sportEventStatusId: matches[6],
    scores: parseScores(matches[7] || ""),
  }

  return state;
}

export const parseOdds = (odds: string): EventState[] => {
  const lines = odds.split('\n');

  return lines
    .filter(line => line.length > 0)
    .map((line) => parseOddsLine(line));
}
