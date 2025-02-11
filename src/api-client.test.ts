import { describe, expect, it } from 'vitest';
import nock from 'nock';

import { getMapping, getState } from './api-client';

const BASE_URL = String(process.env.SOURCE_BASE_URL);

describe.each([
  {
    path: '/api/mappings',
    expectedResponse: { mappings: "test:test" },
    method: getMapping,
  },
  {
    path: '/api/state',
    expectedResponse: { odds: "test:test" },
    method: getState,
  }
])("$method.name", ({ path, expectedResponse, method }) => {

  it("should return the expected response", async () => {
    nock(BASE_URL)
      .get(path)
      .reply(200, expectedResponse);

    const actualResponse = await method();
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should throw if the response is not 200", async () => {
    nock(BASE_URL)
      .get(path)
      .reply(404, { error: "Not Found" });

    await expect(method()).rejects.toThrow();
  });

  it("should throw on timeout", async () => {
    nock(BASE_URL)
      .get(path)
      .delay(4000)
      .reply(200, expectedResponse);

    await expect(method()).rejects.toThrow();
  });
});
