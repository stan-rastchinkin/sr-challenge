import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { getMapping } from '../api-client';

import { Mapper, newMapper, parseMapping, MappingNotFoundError } from './mapper';


const stringifiedMapping = "29190088-763e-4d1c-861a-d16dbfcf858c:Real Madrid;33ff69aa-c714-470c-b90d-d3883c95adce:Barcelona;b582b685-e75c-4139-8274-d19f078eabef:Manchester United";
const parsedMapping = {
  "29190088-763e-4d1c-861a-d16dbfcf858c": "Real Madrid",
  "33ff69aa-c714-470c-b90d-d3883c95adce": "Barcelona",
  "b582b685-e75c-4139-8274-d19f078eabef": "Manchester United"
}

vi.mock('../api-client', () => ({
  getMapping: vi.fn()
}))

describe('parseMapping', () => {
  it('should parse mapping', () => {
    const mapping = parseMapping(stringifiedMapping);

    expect(mapping).toEqual(parsedMapping);
  });
});

describe('Mapper', () => {
  let mapper: Mapper;

  beforeAll(async () => {
    vi.mocked(getMapping).mockResolvedValue({ mappings: stringifiedMapping });
    mapper = await newMapper();
  })

  afterAll(() => {
    vi.restoreAllMocks();
  })

  it('should map id to titles', async () => {
    const mapper = await newMapper();

    expect(mapper.mapId("29190088-763e-4d1c-861a-d16dbfcf858c")).toEqual("Real Madrid");
  });

  it('should throw error if id is not found', async () => {
    const mapper = await newMapper();

    expect(() => mapper.mapId("test")).toThrow(MappingNotFoundError);
  });
});
