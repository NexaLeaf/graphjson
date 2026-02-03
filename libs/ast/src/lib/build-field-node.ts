import { ArgumentNode, DirectiveNode, FieldNode, Kind, SelectionNode } from 'graphql';
import { JsonArg, JsonField, JsonVariable } from '@graphjson/json-dsl';
import { literalToValueNode } from './literals.js';
import { isJsonVariable } from './is-json-variable.js';

type CollectVar = (v: JsonVariable) => void;

export function buildFieldNode(
  name: string,
  field: JsonField,
  collectVar: CollectVar,
  relayFields: Set<FieldNode>
): FieldNode {
  const args: ArgumentNode[] = [];
  const directives: DirectiveNode[] = [];
  const selections: SelectionNode[] = [];

  function buildArgument(argName: string, value: JsonArg) {
    if (isJsonVariable(value)) {
      collectVar(value);
      return {
        kind: Kind.ARGUMENT,
        name: { kind: Kind.NAME, value: argName },
        value: {
          kind: Kind.VARIABLE,
          name: { kind: Kind.NAME, value: value.$var },
        },
      };
    }

    return {
      kind: Kind.ARGUMENT,
      name: { kind: Kind.NAME, value: argName },
      value: literalToValueNode(value),
    };
  }

  if (field.args) {
    for (const [argName, value] of Object.entries(field.args)) {
      args.push(buildArgument(argName, value));
    }
  }

  if (field.directives) {
    for (const [directiveName, directiveArgs] of Object.entries(field.directives)) {
      const directiveArguments = Object.entries(directiveArgs ?? {}).map(
        ([argName, value]) => buildArgument(argName, value)
      );

      directives.push({
        kind: Kind.DIRECTIVE,
        name: { kind: Kind.NAME, value: directiveName },
        arguments: directiveArguments.length ? directiveArguments : undefined,
      });
    }
  }

  if (field.select) {
    for (const [key, val] of Object.entries(field.select)) {
      if (key.startsWith('...')) {
        selections.push({
          kind: Kind.FRAGMENT_SPREAD,
          name: { kind: Kind.NAME, value: key.slice(3) },
        });
      } else if (val === true) {
        selections.push({
          kind: Kind.FIELD,
          name: { kind: Kind.NAME, value: key },
        });
      } else {
        selections.push(buildFieldNode(key, val as JsonField, collectVar, relayFields));
      }
    }
  }

  const node: FieldNode = {
    kind: Kind.FIELD,
    name: { kind: Kind.NAME, value: name },
    alias: field.alias ? { kind: Kind.NAME, value: field.alias } : undefined,
    arguments: args.length ? args : undefined,
    directives: directives.length ? directives : undefined,
    selectionSet: selections.length ? { kind: Kind.SELECTION_SET, selections } : undefined,
  };

  if (field.paginate === 'relay') {
    relayFields.add(node);
  }

  return node;
}
