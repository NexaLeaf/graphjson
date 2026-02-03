import { Kind, type OperationDefinitionNode } from 'graphql';
import { generateDocument } from './generate-document.js';
import type { JsonDocument } from '@graphjson/json-dsl';

describe('generateDocument', () => {
  it('scopes variable definitions per operation', () => {
    const doc: JsonDocument = {
      query: {
        user: {
          args: {
            id: { $var: 'id', type: 'ID!' },
          },
          select: {
            id: true,
          },
        },
      },
      mutation: {
        updateUser: {
          args: {
            id: { $var: 'id', type: 'ID!' },
            name: { $var: 'name', type: 'String!' },
          },
          select: {
            id: true,
          },
        },
      },
    };

    const result = generateDocument(doc);
    const definitions = result.ast.definitions as OperationDefinitionNode[];

    const queryVars =
      definitions[0].variableDefinitions?.map((def) => def.variable.name.value) ?? [];
    const mutationVars =
      definitions[1].variableDefinitions?.map((def) => def.variable.name.value) ?? [];

    expect(queryVars).toEqual(['id']);
    expect(mutationVars).toEqual(['id', 'name']);
  });

  it('adds operation names when provided', () => {
    const doc: JsonDocument = {
      operationName: { query: 'GetUser' },
      query: {
        user: {
          select: { id: true },
        },
      },
    };

    const result = generateDocument(doc);
    const definition = result.ast.definitions[0] as OperationDefinitionNode;
    expect(definition.name?.value).toBe('GetUser');
  });

  it('parses list and non-null types', () => {
    const doc: JsonDocument = {
      query: {
        users: {
          args: {
            roles: { $var: 'roles', type: '[String!]!' },
          },
          select: {
            id: true,
          },
        },
      },
    };

    const result = generateDocument(doc);
    const definition = result.ast.definitions[0] as OperationDefinitionNode;
    const typeNode = definition.variableDefinitions?.[0].type;

    expect(typeNode?.kind).toBe(Kind.NON_NULL_TYPE);
    if (typeNode?.kind === Kind.NON_NULL_TYPE) {
      expect(typeNode.type.kind).toBe(Kind.LIST_TYPE);
    }
  });
});
