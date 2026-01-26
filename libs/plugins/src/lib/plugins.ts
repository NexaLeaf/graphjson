import { FieldNode, DocumentNode } from 'graphql';

export interface GraphJsonPluginContext {
  path: string[];
}

export interface GraphJsonPlugin {
  onField?(
    field: FieldNode,
    ctx: GraphJsonPluginContext
  ): FieldNode | void;

  onDocument?(doc: DocumentNode): DocumentNode | void;
}
