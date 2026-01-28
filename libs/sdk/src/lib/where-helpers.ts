import type { JsonValue } from '@graphjson/json-dsl';

type ConditionObject = Record<string, JsonValue>;

/* -------------------------
 * High-level helpers
 * ------------------------- */

export function whereAnd(conditions: ConditionObject[]) {
  const normalized = normalizeConditions(conditions, 'AND');
  return normalized.length ? { AND: normalized } : undefined;
}

export function whereOr(conditions: ConditionObject[]) {
  const normalized = normalizeConditions(conditions, 'OR');
  return normalized.length ? { OR: normalized } : undefined;
}

export function whereNot(condition: ConditionObject) {
  return { NOT: condition };
}

/* -------------------------
 * Internal normalization
 * ------------------------- */

function normalizeConditions(
  conditions: ConditionObject[],
  operator: 'AND' | 'OR'
): ConditionObject[] {
  const result: ConditionObject[] = [];

  for (const cond of conditions) {
    if (!cond || typeof cond !== 'object') continue;

    // Flatten same operator
    if (operator in cond && Array.isArray((cond as any)[operator])) {
      result.push(...(cond as any)[operator]);
    } else {
      result.push(cond);
    }
  }

  return result;
}
