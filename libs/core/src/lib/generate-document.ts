import {
  DocumentNode,
  Kind,
  OperationDefinitionNode,
  VariableDefinitionNode,
  FieldNode,
  OperationTypeNode,
  parseType,
} from 'graphql';
import { JsonDocument, JsonVariable } from '@graphjson/json-dsl';
import { buildFieldNode } from '@graphjson/ast';
import { relayPaginationPreset } from '@graphjson/presets';

interface GenerateResult {
  ast: DocumentNode;
  variables: Record<string, any>;
  relayFields: Set<FieldNode>;
}

export function generateDocument(
  json: JsonDocument,
  options?: { applyRelay?: boolean }
): GenerateResult {
  const variables: Record<string, any> = {};
  const relayFields = new Set<FieldNode>();

  function buildOperation(
    type: 'query' | 'mutation' | 'subscription',
    fields: Record<string, any>,
    name?: string
  ): OperationDefinitionNode {
    const variableDefinitions: Map<string, VariableDefinitionNode> = new Map();

    function collectVar(v: JsonVariable) {
      if (variableDefinitions.has(v.$var)) return;

      variables[v.$var] = v.default ?? null;

      variableDefinitions.set(v.$var, {
        kind: Kind.VARIABLE_DEFINITION,
        variable: {
          kind: Kind.VARIABLE,
          name: { kind: Kind.NAME, value: v.$var },
        },
        type: parseType(v.type),
      });
    }

    return {
      kind: Kind.OPERATION_DEFINITION,
      operation: type as OperationTypeNode,
      name: name ? { kind: Kind.NAME, value: name } : undefined,
      variableDefinitions: Array.from(variableDefinitions.values()),
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections: Object.entries(fields).map(([name, field]) =>
          buildFieldNode(name, field, collectVar, relayFields)
        ),
      },
    };
  }

  const definitions: OperationDefinitionNode[] = [];
  const operationNames = json.operationName ?? {};

  if (json.query) {
    definitions.push(buildOperation('query', json.query, operationNames.query));
  }
  if (json.mutation) {
    definitions.push(buildOperation('mutation', json.mutation, operationNames.mutation));
  }
  if (json.subscription) {
    definitions.push(buildOperation('subscription', json.subscription, operationNames.subscription));
  }

  const result: GenerateResult = {
    ast: {
      kind: Kind.DOCUMENT,
      definitions,
    } as DocumentNode,
    variables,
    relayFields,
  };

  if (options?.applyRelay) {
    result.ast = relayPaginationPreset(result.ast, result.relayFields);
  }
  return result;
}
