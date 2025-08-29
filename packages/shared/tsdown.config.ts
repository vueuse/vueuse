import { packages } from '../../meta/packages'
import { createTsDownConfig } from '../../tsdown.config'

export default createTsDownConfig(
  packages.find(pkg => pkg.name === 'shared')!,
)
