import { packages } from '../../meta/packages.ts'
import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig(
  packages.find(pkg => pkg.name === 'router')!,
)
