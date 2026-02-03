import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/build',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: [
                'scope:ast',
                'scope:json-dsl',
                'scope:shared',
                'scope:plugins',
                'scope:presets',
              ],
            },
            {
              sourceTag: 'scope:async',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:async'],
            },
            {
              sourceTag: 'scope:colors',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:colors'],
            },
            {
              sourceTag: 'scope:strings',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:strings'],
            },
            {
              sourceTag: 'scope:json-dsl',
              onlyDependOnLibsWithTags: ['scope:json-dsl'],
            },
            {
              sourceTag: 'scope:ast',
              onlyDependOnLibsWithTags: ['scope:json-dsl'],
            },
            {
              sourceTag: 'scope:printer',
              onlyDependOnLibsWithTags: ['scope:ast', 'scope:json-dsl', 'scope:core']
            },
            {
              sourceTag: 'scope:presets',
              onlyDependOnLibsWithTags: ['scope:plugins'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:plugins',
              onlyDependOnLibsWithTags: ['scope:plugins'],
            },
            {
              sourceTag: 'scope:schema',
              onlyDependOnLibsWithTags: ['scope:json-dsl', 'scope:shared'],
            },
            {
              sourceTag: 'scope:sdk',
              onlyDependOnLibsWithTags: [
                'scope:json-dsl',
                'scope:core',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'scope:parser',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              sourceTag: 'type:example',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
