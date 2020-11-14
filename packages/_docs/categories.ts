import { packages } from '../../scripts/packages'

export const categories = [
  'Component',
  'Watch',
  'State',
  'Sensors',
  'Browser',
  'Animation',
  'Utilities',
  'Misc',
  ...packages
    .filter(pkg => pkg.addon)
    .map(pkg => `@${pkg.display}`),
]
