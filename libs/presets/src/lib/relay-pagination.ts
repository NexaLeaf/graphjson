import { GraphJsonPlugin } from '@graphjson/plugins';
import { FieldNode, Kind, SelectionNode } from 'graphql';

export function relayPagination(): GraphJsonPlugin {
  return {
    onField(field: FieldNode) {
      if (!field.selectionSet) return;

      const hasEdges = field.selectionSet.selections.some(
        (s: SelectionNode) => s.kind === Kind.FIELD && s.name.value === 'edges'
      );

      if (hasEdges) return;

      return {
        ...field,
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'edges' },
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  {
                    kind: Kind.FIELD,
                    name: { kind: Kind.NAME, value: 'node' },
                    selectionSet: field.selectionSet,
                  },
                ],
              },
            },
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'pageInfo' },
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'hasNextPage' } },
                  { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'endCursor' } },
                ],
              },
            },
          ],
        },
      };
    },
  };
}
