import { buildSchema, parse } from 'graphql';
import { validateDocument } from './validate-document.js';

describe('schema', () => {
  it('validates a document against a schema', () => {
    const schema = buildSchema(`
      type Query {
        user(id: ID!): User
      }

      type User {
        id: ID!
      }
    `);

    const document = parse(`
      query {
        user(id: "1") {
          id
          unknownField
        }
      }
    `);

    const result = validateDocument(schema, document);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
