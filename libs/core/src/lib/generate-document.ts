import {
  DocumentNode,
  Kind,
  OperationDefinitionNode,
  VariableDefinitionNode,
  TypeNode,
  FieldNode,
} from 'graphql';
import { JsonDocument, JsonVariable } from '@graphjson/json-dsl';
import {  buildFieldNode } from '@graphjson/ast';
import {relayPaginationPreset} from '@graphjson/presets';

interface GenerateResult {
  ast: DocumentNode;
  variables: Record<string, any>;
  relayFields: Set<FieldNode>;
}

function parseType(type: string): TypeNode {
  if (type.endsWith('!')) {
    return {
      kind: Kind.NON_NULL_TYPE,
      type: {
        kind: Kind.NAMED_TYPE,
        name: { kind: Kind.NAME, value: type.slice(0, -1) },
      },
    };
  }

  return {
    kind: Kind.NAMED_TYPE,
    name: { kind: Kind.NAME, value: type },
  };
}
export function generateDocument(json: JsonDocument, options?: { applyRelay?: boolean }): GenerateResult {
  const variables: Record<string, any> = {};
  const variableDefinitions: Map<string, VariableDefinitionNode> = new Map();
  const relayFields = new Set<FieldNode>();

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

  function buildOperation(
    type: 'query' | 'mutation' | 'subscription',
    fields: Record<string, any>
  ): OperationDefinitionNode {
    return {
      kind: Kind.OPERATION_DEFINITION,
      operation: type,
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

  if (json.query) definitions.push(buildOperation('query', json.query));
  if (json.mutation)
    definitions.push(buildOperation('mutation', json.mutation));
  if (json.subscription)
    definitions.push(buildOperation('subscription', json.subscription));

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
