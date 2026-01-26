import {
  ArgumentNode,
  FieldNode,
  Kind,
  SelectionNode,
} from 'graphql';
import { JsonField, JsonVariable } from '@graphjson/json-dsl';
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
  const selections: SelectionNode[] = [];

  if (field.args) {
    for (const [argName, value] of Object.entries(field.args)) {
      if (isJsonVariable(value)) {
        collectVar(value);
        args.push({
          kind: Kind.ARGUMENT,
          name: { kind: Kind.NAME, value: argName },
          value: {
            kind: Kind.VARIABLE,
            name: { kind: Kind.NAME, value: value.$var },
          },
        });
      } else {
        args.push({
          kind: Kind.ARGUMENT,
          name: { kind: Kind.NAME, value: argName },
          value: literalToValueNode(value),
        });
      }
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
        selections.push(
          buildFieldNode(
            key,
            val as JsonField,
            collectVar,
            relayFields
          )
        );
      }
    }
  }

  const node: FieldNode = {
    kind: Kind.FIELD,
    name: { kind: Kind.NAME, value: name },
    arguments: args.length ? args : undefined,
    selectionSet: selections.length
      ? { kind: Kind.SELECTION_SET, selections }
      : undefined,
  };

  if (field.paginate === 'relay') {
    relayFields.add(node);
  }

  return node;
}
