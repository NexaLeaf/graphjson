import { Kind, FieldNode } from 'graphql';
import { buildFieldNode } from './build-field-node.js';
import type { JsonField, JsonVariable } from '@graphjson/json-dsl';

describe('buildFieldNode', () => {
  it('supports alias, directives, and variable collection', () => {
    const relayFields = new Set<FieldNode>();
    const collected: JsonVariable[] = [];

    const field: JsonField = {
      alias: 'userAlias',
      directives: {
        include: {
          if: { $var: 'withUser', type: 'Boolean!' },
        },
      },
      select: {
        id: true,
      },
    };

    const node = buildFieldNode('user', field, (v) => collected.push(v), relayFields);

    expect(node.alias?.value).toBe('userAlias');
    expect(node.directives?.length).toBe(1);

    const directive = node.directives?.[0];
    expect(directive?.name.value).toBe('include');
    expect(directive?.arguments?.length).toBe(1);

    const arg = directive?.arguments?.[0];
    expect(arg?.name.value).toBe('if');
    expect(arg?.value.kind).toBe(Kind.VARIABLE);
    if (arg?.value.kind === Kind.VARIABLE) {
      expect(arg.value.name.value).toBe('withUser');
    }

    expect(collected).toHaveLength(1);
    expect(collected[0].$var).toBe('withUser');
  });
});
