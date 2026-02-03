import { print, type DocumentNode } from 'graphql';
import type { JsonDocument } from '@graphjson/json-dsl';
import { generateDocument } from '@graphjson/core';

export interface PrintJsonResult {
  query: string;
  variables: Record<string, unknown>;
  document: DocumentNode;
}

export function printDocument(document: DocumentNode): string {
  return print(document);
}

export function printJson(
  json: JsonDocument,
  options?: { applyRelay?: boolean }
): PrintJsonResult {
  try {
    const result = generateDocument(json, options);
    return {
      query: print(result.ast),
      variables: result.variables,
      document: result.ast,
    };
  } catch (error: any) {
    throw new Error(`Failed to generate document: ${error.message}`);
  }
}
