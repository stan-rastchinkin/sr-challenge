import { describe, expect, it, vi } from 'vitest';

import { startServer } from './server';

import { newResponseFormatter } from './format-response/';
import { config } from './config';
import { EventState } from './crawler';

vi.mock('./format-response/', () => ({
  newResponseFormatter: vi.fn()
}))

describe("server", () => {
  it("should respond with correct data", async () => {
    // ARRANGE
    const mock = vi.mocked(newResponseFormatter).mockResolvedValue(
      async (input: any) => input
    );
    const store = { events: [{test: "test"} as unknown as EventState] };
    const server = await startServer(store);
    
    // ACT
    const response = await fetch(`http://localhost:${config.port}/client/state`);

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual([{test: "test"}]);

    // TEARDOWN
    server.close();
    mock.mockRestore()
  });

  it("should respond with 404 if the route is not found", async () => {
    // ARRANGE
    const mock = vi.mocked(newResponseFormatter).mockResolvedValue(
      async (input: any) => input
    );
    const server = await startServer({ events: [] });

    // ACT
    const response = await fetch(`http://localhost:${config.port}/not-found`);

    // ASSERT
    expect(response.status).toBe(404);

    // TEARDOWN
    server.close();
    mock.mockRestore()
  });

  it("should respond with 500 if the format response fails", async () => {
    // ARRANGE
    const mock = vi.mocked(newResponseFormatter).mockResolvedValue(async () => { throw new Error("test") });
    const server = await startServer({ events: [] });

    // ACT
    const response = await fetch(`http://localhost:${config.port}/client/state`)
     .catch((error) => {
        return error;
      });

    // ASSERT
    expect(response.status).toBe(500);

    // TEARDOWN
    server.close();
    mock.mockRestore()
  });
});
