import _indexes from '../indexes.json'
import type { PackageIndexes } from './types'

const indexes = _indexes as PackageIndexes

export { indexes }

export const categoriesOrder = [
  'Browser',
  'Sensors',
  'Animation',
  'State',
  'Elements',
  'Component',
  'Watch',
  'Network',
  'Utilities',
  'Misc',
]

export const functions = indexes.functions
export const functionNames = indexes.functions.map(f => f.name)
export const getFunction = (name: string) => indexes.functions.find(f => f.name === name)

export const packages = indexes.packages

export const categories = Array.from(indexes.categories)
  .sort((a, b) => categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b))
  .sort((a, b) => a.startsWith('@') ? 1 : b.startsWith('@') ? -1 : 0)
