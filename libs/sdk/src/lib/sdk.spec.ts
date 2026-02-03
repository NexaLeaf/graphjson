import { buildSchema } from 'graphql';
import { validateJsonDocument } from './sdk.js';

describe('sdk', () => {
  it('validates JsonDocument against schema', () => {
    const schema = buildSchema(`
      type Query {
        user(id: ID!): User
      }

      type User {
        id: ID!
      }
    `);

    const result = validateJsonDocument(schema, {
      operationName: { query: 'GetUser' },
      query: {
        user: {
          args: { id: { $var: 'id', type: 'ID!' } },
          select: { id: true },
        },
      },
    });

    expect(result.errors).toEqual([]);
    expect(result.variables).toEqual({ id: null });
  });
});
