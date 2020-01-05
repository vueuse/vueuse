// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'packages/core/index.ts',
    output: [{
      file: 'dist/core/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/core/index.esm.js',
      format: 'es',
    }, {
      file: 'dist/core/index.umd.js',
      format: 'umd',
      name: 'VueUse',
      globals: {
        vue: 'Vue',
        '@vue/composition-api': 'vueCompositionApi',
        '@vue/runtime-dom': 'Vue',
      },
    },
    {
      file: 'dist/core/index.umd.min.js',
      format: 'umd',
      name: 'VueUse',
      globals: {
        vue: 'Vue',
        '@vue/composition-api': 'vueCompositionApi',
        '@vue/runtime-dom': 'Vue',
      },
      plugins: [uglify()],
    }],
    plugins: [
      typescript(),
    ],
    external: [
      'vue',
      '@vue/composition-api',
      '@vue/runtime-dom',
    ],
  },
  {
    input: './typings/core/index.d.ts',
    output: [{
      file: 'dist/core/index.d.ts',
      format: 'es',
    }],
    plugins: [
      dts(),
    ],
  },
]
