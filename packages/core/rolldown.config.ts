import { packages } from '../../meta/packages'
import { createRolldownConfig } from '../../rolldown.config'

export default createRolldownConfig(
  packages.find(pkg => pkg.name === 'core')!,
)
