import { packages } from '../../meta/packages.ts'
import { createTsDownConfig } from '../../tsdown.config.ts'

const configs = createTsDownConfig(
  packages.find(pkg => pkg.name === 'core')!,
  ['metadata.mjs', 'metadata.d.mts'],
)

// @types/web-bluetooth provides global types used by useBluetooth.
// rolldown-plugin-dts strips /// <reference> directives during DTS bundling,
// so we inject the reference via banner to ensure consumers get proper types.
for (const config of configs) {
  config.banner = { dts: '/// <reference types="web-bluetooth" />' }
}

export default configs
