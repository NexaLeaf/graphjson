import {
  GraphQLError,
  GraphQLSchema,
  validate,
  specifiedRules,
  ValidationRule,
} from 'graphql';
import { generateDocument } from '@graphjson/core';
import type { JsonDocument } from '@graphjson/json-dsl';

export interface ValidateOptions {
  applyRelay?: boolean;
  rules?: readonly ValidationRule[];
}

export interface ValidateResult {
  errors: GraphQLError[];
  document: ReturnType<typeof generateDocument>['ast'];
  variables: ReturnType<typeof generateDocument>['variables'];
}

export function validateJsonDocument(
  schema: GraphQLSchema,
  json: JsonDocument,
  options: ValidateOptions = {}
): ValidateResult {
  const { applyRelay, rules = specifiedRules } = options;
  const result = generateDocument(json, { applyRelay });
  const errors = validate(schema, result.ast, rules);
  return {
    errors,
    document: result.ast,
    variables: result.variables,
  };
}
