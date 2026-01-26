import { DocumentNode, FieldNode, visit } from 'graphql';
import { GraphJsonPlugin } from '@graphjson/plugins';

export function applyPlugins(
  document: DocumentNode,
  plugins: GraphJsonPlugin[]
) {
  let doc = document;

  for (const plugin of plugins) {
    if (plugin.onDocument) {
      doc = plugin.onDocument(doc) ?? doc;
    }

   const onField = plugin.onField;

   if (onField) {
    doc = visit(doc, {
    Field(node: FieldNode) {
      return onField(node, { path: [] }) ?? node;
    },
  });
}
  }

  return doc;
}
