/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/parser',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  build: {
    outDir: '../dist/parser',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'parser',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: [
        '@graphjson/ast',
        '@graphjson/core',
        '@graphjson/json-dsl',
        '@graphjson/plugins',
        '@graphjson/presets',
        '@graphjson/printer',
        '@graphjson/schema',
        '@graphjson/sdk',
        '@graphjson/shared'
      ],
    },
  },
}));