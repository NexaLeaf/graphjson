import { print } from 'graphql';
import { generateDocument } from '@graphjson/core';
import { query, field, variable } from '@graphjson/sdk';

/**
 * Advanced example:
 * - Pagination (intent)
 * - Alias
 * - Directives
 * - Fragments
 * - Multilevel nesting
 */
const input = query({
  companies: field()
    .paginate('relay')
    .args({ first: 5 })
    .select({
      id: true,
      name: true,

      departments: field()
        .args({ first: 3 })
        .select({
          id: true,
          name: true,

          employees: field()
            .alias('staff')
            .directive('include', { if: true })
            .args({
              first: 10,
              after: variable('employeeCursor', 'String'),
            })
            .select({
              id: true,
              firstName: true,
              lastName: true,

              projects: field().directive('skip', { if: false }).args({ active: true }).select({
                id: true,
                title: true,
                status: true,
              }),

              // fragment spread
              '...EmployeeFields': true,
            }),
        }),
    }),
});

/* ---------------------------------------
 * Compile JSON → GraphQL AST
 * --------------------------------------- */

const { ast, variables } = generateDocument(input);

console.log('--- GraphQL ---\n');
console.log(print(ast));

console.log('\n--- Variables ---\n');
console.log(variables);
