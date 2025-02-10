import { describe, expect, it, vi, MockInstance, afterEach } from 'vitest';

import * as apiClient from '../api-client';

import { startPolling } from './poller';

describe('startPolling', () => {
  let getStateMock: MockInstance;

  afterEach(() => {
    getStateMock.mockReset();
  })

  it('should poll API', async () => {
    // ARRANGE
    getStateMock = vi.spyOn(apiClient, 'getState').mockImplementation(() => {
      return Promise.resolve({ odds: "" });
    });

    // ACT
    const stop = startPolling({ events: [] }, 50);

    await new Promise(resolve => setTimeout(resolve, 330));
    stop();

    // ASSERT
    expect(getStateMock.mock.calls.length >= 6).toBe(true);
  });

  it('should not call API after stop', async () => {
    // ARRANGE
    getStateMock = vi.spyOn(apiClient, 'getState').mockImplementation(() => {
      return Promise.resolve({ odds: "" });
    });

    // ACT
    const stop = startPolling({ events: [] }, 50);

    await new Promise(resolve => setTimeout(resolve, 150));
    const numberOfCallsBeforeStop = getStateMock.mock.calls.length;
    stop();

    await new Promise(resolve => setTimeout(resolve, 150));

    // ASSERT
    expect(numberOfCallsBeforeStop).toEqual(numberOfCallsBeforeStop);
  });

  it('should write to referenced store', async () => {
    // ARRANGE
    getStateMock = vi.spyOn(apiClient, 'getState').mockImplementation(() => {
      return Promise.resolve({ odds: "995e0722-4118-4f8e-a517-82f6ea240673,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,7ee17545-acd2-4332-869b-1bef06cfaec8,1709900432183,29190088-763e-4d1c-861a-d16dbfcf858c,3cd8eeee-a57c-48a3-845f-93b561a95782,ac68a563-e511-4776-b2ee-cd395c7dc424,\nfd903e06-9a7d-423d-8869-1c060cc0b62d,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,7ee17545-acd2-4332-869b-1bef06cfaec8,1709900348483,a950b22c-989b-402f-a1ac-70df8f102e27,5dbdb683-c15f-4d79-a348-03cf2861b954,7fa4e60c-71ad-4e76-836f-5c2bc6602156,e2d12fef-ae82-4a35-b389-51edb8dc664e@1:3|6c036000-6dd9-485d-97a1-e338e6a32a51@1:3," });
    });
    const store = { events: [] };

    // ACT
    const stop = startPolling(store, 50);

    await new Promise(resolve => setTimeout(resolve, 70));
    stop();

    // ASSERT
    expect(store.events.length).toBe(2);
  });
});
