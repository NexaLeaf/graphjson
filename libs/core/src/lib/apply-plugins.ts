import { visit } from 'graphql';
import { GraphJsonPlugin } from '@graphjson/plugins';

export function applyPlugins(
  document,
  plugins: GraphJsonPlugin[]
) {
  let doc = document;

  for (const plugin of plugins) {
    if (plugin.onDocument) {
      doc = plugin.onDocument(doc) ?? doc;
    }

    if (plugin.onField) {
      doc = visit(doc, {
        Field(node) {
          return plugin.onField(node, { path: [] }) ?? node;
        },
      });
    }
  }

  return doc;
}
