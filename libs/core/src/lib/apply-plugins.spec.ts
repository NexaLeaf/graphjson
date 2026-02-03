import { parse } from 'graphql';
import { applyPlugins } from './apply-plugins.js';

describe('applyPlugins', () => {
  it('provides field paths to onField handlers', () => {
    const doc = parse(`
      query {
        user {
          id
        }
      }
    `);

    const paths: string[][] = [];

    applyPlugins(doc, [
      {
        onField(field, ctx) {
          paths.push(ctx.path);
          return field;
        },
      },
    ]);

    expect(paths).toEqual([['user'], ['user', 'id']]);
  });
});
