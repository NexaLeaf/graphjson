import { parse } from 'graphql';
import { printDocument, printJson } from './printer.js';
// eslint-disable-next-line @nx/enforce-module-boundaries
import type { JsonDocument } from '@graphjson/json-dsl';

describe('printer', () => {
  it('prints a GraphQL document node', () => {
    const doc = parse(`
      query GetUser($id: ID!) {
        user(id: $id) {
          id
        }
      }
    `);
    const printed = printDocument(doc);
    expect(printed).toContain('query GetUser');
    expect(printed).toContain('user');
  });

  it('prints a JsonDocument with variables', () => {
    const json: JsonDocument = {
      operationName: { query: 'GetUser' },
      query: {
        user: {
          args: { id: { $var: 'id', type: 'ID!' } },
          select: { id: true },
        },
      },
    };

    const result = printJson(json);
    expect(result.query).toContain('query GetUser');
    expect(result.query).toContain('$id: ID!');
    expect(result.variables).toEqual({ id: null });
  });
});
