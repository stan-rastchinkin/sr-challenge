import { getMapping } from "./api-client";

type Mapping = {
  [key: string]: string;
}

export const parseMapping = (mappings: string): Mapping => {
  const parsedData: Mapping = mappings.split(";").reduce((acc: Mapping, mapping: string) => {
    const [key, value] = mapping.split(":");
    acc[key] = value;
    return acc;
  }, {});

  return parsedData;
}

const fetchMapping = async (): Promise<Mapping> => {
  const response = await getMapping();
  return parseMapping(response.mappings);
}

export interface Mapper {
  mapId(id: string): string;
}

export class MappingNotFoundError extends Error {
  constructor(id: string) {
    super(`No mapping found for id: ${id}`);
  }
}

export const newMapper = async (): Promise<Mapper> => {
  const mapping = await fetchMapping();

  return {
    mapId: (id: string) => {
      const value = mapping[id];

      if (!value) {
        throw new MappingNotFoundError(id);
      }

      return value;
    },
  }
}