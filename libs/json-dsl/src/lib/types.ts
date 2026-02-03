export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface JsonVariable {
  $var: string;
  type: string;
  default?: JsonValue;
}

/**
 * A GraphQL argument value in JSON DSL
 * - literal value
 * - or variable reference
 */
export type JsonArg = JsonValue | JsonVariable;

export interface JsonField {
  args?: Record<string, JsonArg>;
  select?: Record<string, true | JsonField | { [fragment: `...${string}`]: true }>;

  // optional extensions (consumed by plugins)
  alias?: string;
  directives?: Record<string, Record<string, JsonArg>>;
  paginate?: 'relay' | 'cursor' | 'offset';
}

export type JsonSelection = true | JsonField | { [fragment: `...${string}`]: true };

export interface JsonOperation {
  [field: string]: JsonField;
}

export interface JsonDocument {
  operationName?: {
    query?: string;
    mutation?: string;
    subscription?: string;
  };
  query?: JsonOperation;
  mutation?: JsonOperation;
  subscription?: JsonOperation;
}
