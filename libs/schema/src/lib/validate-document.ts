import {
  GraphQLSchema,
  DocumentNode,
  visit,
  GraphQLError,
  TypeInfo,
  visitWithTypeInfo,
  FieldNode,
  ArgumentNode,
} from 'graphql';

export interface ValidationResult {
  errors: GraphQLError[];
}

export function validateDocument(
  schema: GraphQLSchema,
  document: DocumentNode
): ValidationResult {
  const errors: GraphQLError[] = [];
  const typeInfo = new TypeInfo(schema);

  visit(
    document,
    visitWithTypeInfo(typeInfo, {
      Field(node: FieldNode) {
        const fieldDef = typeInfo.getFieldDef();
        if (!fieldDef) {
          errors.push(
            new GraphQLError(
              `Unknown field "${node.name.value}"`,
              node
            )
          );
        }
      },
      Argument(node: ArgumentNode) {
        const argDef = typeInfo.getArgument();
        if (!argDef) {
          errors.push(
            new GraphQLError(
              `Unknown argument "${node.name.value}"`,
              node
            )
          );
        }
      },
    })
  );

  return { errors };
}
