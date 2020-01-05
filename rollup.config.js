const { uglify } = require('rollup-plugin-uglify')
const resolve = require('rollup-plugin-local-resolve')

const createDefault = () => ({
  input: 'dist/esm/core/index.js',
  output: {
    file: 'dist/umd/core/index.js',
    format: 'umd',
    name: 'VueUse',
    globals: {
      vue: 'Vue',
      '@vue/composition-api': 'vueCompositionApi',
      '@vue/runtime-dom': 'Vue',
    },
  },
  plugins: [
    resolve(),
  ],
  external: [
    'vue',
    '@vue/composition-api',
    '@vue/runtime-dom',
  ],
})

const createMinified = () => {
  const config = createDefault()

  config.output.file = 'dist/umd/core/index.min.js'
  config.plugins.push(uglify())

  return config
}

module.exports = [createDefault(), createMinified()]
