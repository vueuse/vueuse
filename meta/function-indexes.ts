import _indexes from '../indexes.json'
import { PackageIndexes } from './types'

const indexes = _indexes as PackageIndexes

export default indexes

export const functions = indexes.functions
export const functionNames = indexes.functions.map(f => f.name)
export const getFunction = (name: string) => indexes.functions.find(f => f.name === name)

export const categories = indexes.categories
export const packages = indexes.packages
