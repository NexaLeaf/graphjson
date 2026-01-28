import { DocumentNode, FieldNode, Kind, visit } from 'graphql';

/**
 * Rewrites Relay connections:
 * - edges { node { ... } }
 * - pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
 */
export function relayPaginationPreset(
  document: DocumentNode,
  relayFields: Set<FieldNode>
): DocumentNode {
  return visit(document, {
    Field(node: FieldNode) {
      if (!relayFields.has(node)) return;

      if (!node.selectionSet) return;

      const originalSelections = node.selectionSet.selections;

      const nodeField: FieldNode = {
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: 'node' },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: originalSelections,
        },
      };

      const edgesField: FieldNode = {
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: 'edges' },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [nodeField],
        },
      };

      const pageInfoField: FieldNode = {
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: 'pageInfo' },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [
            { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'hasNextPage' } },
            { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'hasPreviousPage' } },
            { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'startCursor' } },
            { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'endCursor' } },
          ],
        },
      };

      return {
        ...node,
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [edgesField, pageInfoField],
        },
      };
    },
  });
}
