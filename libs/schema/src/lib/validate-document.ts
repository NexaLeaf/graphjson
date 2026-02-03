import {
  GraphQLSchema,
  DocumentNode,
  GraphQLError,
  validate,
  specifiedRules,
  ValidationRule,
} from 'graphql';

export interface ValidationResult {
  errors: GraphQLError[];
}

export function validateDocument(
  schema: GraphQLSchema,
  document: DocumentNode,
  rules: readonly ValidationRule[] = specifiedRules
): ValidationResult {
  const errors: GraphQLError[] = validate(schema, document, rules);
  return { errors };
}
