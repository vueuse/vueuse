import fs from 'node:fs/promises'
import { defineConfig } from 'tsdown/config'
import tsdownPkg from 'tsdown/package.json' with { type: 'json' }
import { packages } from '../../meta/packages.ts'
import { attwConfig, basePlugins, externals } from '../../tsdown.config.ts'
import { name, version } from './package.json' with { type: 'json' }

const nuxt = packages.find(p => p.name === 'nuxt')!

export default defineConfig({
  entry: './module.ts',
  format: 'esm',
  dts: true,
  platform: 'node',
  exports: false,
  clean: true,
  plugins: basePlugins,
  deps: {
    neverBundle: [
      ...externals,
      ...(nuxt.external || []),
    ],
  },
  attw: attwConfig,
  hooks: {
    'build:done': async () => {
      await Promise.all([
        fs.cp('./ssr-plugin.mjs', 'dist/ssr-plugin.mjs'),
        fs.writeFile('dist/types.d.mts', `export { default } from './module.mjs';

export { type ModuleOptions, type VueUseNuxtOptions } from './module.mjs';
`, 'utf-8'),
        fs.writeFile('dist/module.json', `{
  "name": "${name}",
  "configKey": "vueuse",
  "version": "${version}",
  "builder": {
    "tsdown": "${tsdownPkg.version}"
  }
}
`, 'utf-8'),
      ])
    },
  },
})
