import type { JsonValue } from '@graphjson/json-dsl';

export const eq = (field: string, value: JsonValue) =>
  ({ [field]: { eq: value } });

export const gt = (field: string, value: JsonValue) =>
  ({ [field]: { gt: value } });

export const lt = (field: string, value: JsonValue) =>
  ({ [field]: { lt: value } });

export const gte = (field: string, value: JsonValue) =>
  ({ [field]: { gte: value } });

export const lte = (field: string, value: JsonValue) =>
  ({ [field]: { lte: value } });

export const inList = (field: string, values: JsonValue[]) =>
  ({ [field]: { in: values } });
