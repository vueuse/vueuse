module.exports = {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    name: 'VueUse',
    globals: {
      vue: 'Vue',
      '@vue/composition-api': 'vueCompositionApi',
      '@vue/runtime-dom': 'Vue',
    },
  },
  plugins: [
    require('rollup-plugin-local-resolve')(),
  ],
  external: [
    'vue',
    '@vue/composition-api',
    '@vue/runtime-dom',
  ],
}
