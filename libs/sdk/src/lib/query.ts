import type {
  JsonDocument,
  JsonField,
  JsonArg,
  JsonVariable,
  JsonValue
} from '@graphjson/json-dsl';

/* ------------------------------
 * Internal helper types
 * ------------------------------ */

type Selection =
  | true
  | FieldBuilder
  | { [fragment: `...${string}`]: true };

type DirectiveArgs = Record<string, JsonArg>;

/* ------------------------------
 * Variable helper
 * ------------------------------ */

export function variable<T extends JsonValue = JsonValue>(
  name: string,
  type: string,
  defaultValue?: T
): JsonVariable {
  return {
    $var: name,
    type,
    default: defaultValue
  };
}

/* ------------------------------
 * Field Builder
 * ------------------------------ */

export class FieldBuilder {
  private field: JsonField = {};
  private aliasName?: string;

  /* ---------- args ---------- */

  args(args: Record<string, JsonArg>) {
    this.field.args = args;
    return this;
  }

  /* ---------- select ---------- */

  select(select: Record<string, Selection>) {
    this.field.select = Object.fromEntries(
      Object.entries(select).map(([key, value]) => {
        if (value instanceof FieldBuilder) {
          return [key, value.build()];
        }
        return [key, value];
      })
    );
    return this;
  }

  /* ---------- alias ---------- */

  alias(name: string) {
    this.aliasName = name;
    return this;
  }

  /* ---------- directives ---------- */

  directive(name: string, args: DirectiveArgs = {}) {
    this.field.directives ??= {};
    this.field.directives[name] = args;
    return this;
  }

  /* ---------- pagination intent ---------- */

  paginate(
    mode: 'relay' | 'cursor' | 'offset' = 'relay'
  ) {
    (this.field as any).paginate = mode;
    return this;
  }

  /* ---------- fragment spread ---------- */

  fragment(name: string) {
    this.field.select ??= {};
    (this.field.select as any)[`...${name}`] = true;
    return this;
  }

  /* ---------- build ---------- */

  build(): JsonField {
    if (!this.aliasName) return this.field;

    return {
      ...this.field,
      alias: this.aliasName
    } as JsonField;
  }

  /* ---------- serialization ---------- */

  toJSON(): JsonField {
    return this.build();
  }
}

/* ------------------------------
 * Factory
 * ------------------------------ */

export function field() {
  return new FieldBuilder();
}

/* ------------------------------
 * Operation Builders
 * ------------------------------ */

export function query(
  fields: Record<string, FieldBuilder>
): JsonDocument {
  return {
    query: Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, v.build()])
    )
  };
}

export function mutation(
  fields: Record<string, FieldBuilder>
): JsonDocument {
  return {
    mutation: Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, v.build()])
    )
  };
}

export function subscription(
  fields: Record<string, FieldBuilder>
): JsonDocument {
  return {
    subscription: Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, v.build()])
    )
  };
}
