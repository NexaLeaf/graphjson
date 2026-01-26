import { print } from 'graphql';
import { generateDocument } from '@graphjson/core';
import {
  query,
  field,
} from '@graphjson/sdk';


export const input = query({
  search: field().select({
    companies: field()
      .paginate('relay')
      .args({
        first: 25,
        orderBy: { alexaRank: 'ASC' }
      })
      .select({
        id: true,
        displayName: true,
        name: true,
        revenue: true,
        alexaRank: true,

        // virtual field handled by Relay preset
        __aggregates: field().select({
          _count: true
        })
      })
  })
});


const { ast, variables } = generateDocument(input, { applyRelay: true });

console.log('--- GraphQL ---\n');
console.log(print(ast));

console.log('\n--- Variables ---\n');
console.log(variables);
