/* eslint-disable no-global-assign */
require = require('esm')(module/* , options */)
require('esbuild-register')
module.exports = require('./scripts/rollup.config.ts')
