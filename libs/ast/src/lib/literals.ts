import { Kind, ValueNode } from 'graphql';

export function literalToValueNode(value: any): ValueNode {
  if (value === null) return { kind: Kind.NULL };

  if (Array.isArray(value)) {
    return {
      kind: Kind.LIST,
      values: value.map(literalToValueNode),
    };
  }

  if (typeof value === 'object') {
    return {
      kind: Kind.OBJECT,
      fields: Object.entries(value).map(([k, v]) => ({
        kind: Kind.OBJECT_FIELD,
        name: { kind: Kind.NAME, value: k },
        value: literalToValueNode(v),
      })),
    };
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { kind: Kind.INT, value: String(value) }
      : { kind: Kind.FLOAT, value: String(value) };
  }

  if (typeof value === 'boolean') {
    return { kind: Kind.BOOLEAN, value };
  }

  return { kind: Kind.STRING, value };
}
