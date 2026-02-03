import { DocumentNode, FieldNode, visit } from 'graphql';
import { GraphJsonPlugin } from '@graphjson/plugins';

export function applyPlugins(document: DocumentNode, plugins: GraphJsonPlugin[]) {
  let doc = document;

  for (const plugin of plugins) {
    if (plugin.onDocument) {
      doc = plugin.onDocument(doc) ?? doc;
    }

    const onField = plugin.onField;

    if (onField) {
      const path: string[] = [];
      doc = visit(doc, {
        Field: {
          enter(node: FieldNode) {
            path.push(node.alias?.value ?? node.name.value);
            return onField(node, { path: [...path] }) ?? node;
          },
          leave() {
            path.pop();
          },
        },
      });
    }
  }

  return doc;
}
