import { beforeEach, describe, expect, it } from 'vitest';
import { parseOdds } from './odds';

describe('parseOdds', () => {
  it('should parse odds', () => {
    const odds = "995e0722-4118-4f8e-a517-82f6ea240673,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,7ee17545-acd2-4332-869b-1bef06cfaec8,1709900432183,29190088-763e-4d1c-861a-d16dbfcf858c,3cd8eeee-a57c-48a3-845f-93b561a95782,ac68a563-e511-4776-b2ee-cd395c7dc424,\nfd903e06-9a7d-423d-8869-1c060cc0b62d,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,7ee17545-acd2-4332-869b-1bef06cfaec8,1709900348483,a950b22c-989b-402f-a1ac-70df8f102e27,5dbdb683-c15f-4d79-a348-03cf2861b954,7fa4e60c-71ad-4e76-836f-5c2bc6602156,e2d12fef-ae82-4a35-b389-51edb8dc664e@1:3|6c036000-6dd9-485d-97a1-e338e6a32a51@1:3,";

    const result = parseOdds(odds);

    expect(result).toMatchObject([
      {
        "sportEventId": "995e0722-4118-4f8e-a517-82f6ea240673",
        "sportId": "c0a1f678-dbe5-4cc8-aa52-8c822dc65267",
        "competitionId": "7ee17545-acd2-4332-869b-1bef06cfaec8",
        "startTimestamp": 1709900432183,
        "homeCompetitorId": "29190088-763e-4d1c-861a-d16dbfcf858c",
        "awayCompetitorId": "3cd8eeee-a57c-48a3-845f-93b561a95782",
        "sportEventStatusId": "ac68a563-e511-4776-b2ee-cd395c7dc424",
        "scores": []
      },
      {
        "sportEventId": "fd903e06-9a7d-423d-8869-1c060cc0b62d",
        "sportId": "c0a1f678-dbe5-4cc8-aa52-8c822dc65267",
        "competitionId": "7ee17545-acd2-4332-869b-1bef06cfaec8",
        "startTimestamp": 1709900348483,
        "homeCompetitorId": "a950b22c-989b-402f-a1ac-70df8f102e27",
        "awayCompetitorId": "5dbdb683-c15f-4d79-a348-03cf2861b954",
        "sportEventStatusId": "7fa4e60c-71ad-4e76-836f-5c2bc6602156",
        "scores": [
          {
            "periodId": "e2d12fef-ae82-4a35-b389-51edb8dc664e",
            "home": 1,
            "away": 3
          },
          {
            "periodId": "6c036000-6dd9-485d-97a1-e338e6a32a51",
            "home": 1,
            "away": 3
          }
        ]
      }
    ]);
  });

  it('should return empty array if no odds provided', () => {
    const odds = "";

    const result = parseOdds(odds);

    expect(result).toMatchObject([]);
  });
});
