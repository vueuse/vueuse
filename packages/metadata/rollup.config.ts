import { packages } from '../../meta/packages'
import { createRollupConfig } from '../../rollup.config'

export default createRollupConfig(
  packages.find(pkg => pkg.name === 'metadata')!,
)
