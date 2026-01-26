import { JsonVariable } from '@graphjson/json-dsl';

export function isJsonVariable(value: unknown): value is JsonVariable {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$var' in value &&
    typeof (value as any).$var === 'string'
  );
}
