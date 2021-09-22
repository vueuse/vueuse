import _indexes from '../indexes.json'
import { PackageIndexes } from './types'

const indexes = _indexes as PackageIndexes

export default indexes

export const functions = indexes.functions
export const functionNames = indexes.functions.map(f => f.name)
export const getFunction = (name: string) => indexes.functions.find(f => f.name === name)

export const categories = indexes.categories
export const packages = indexes.packages

export const coreCategories = categories.filter(i => !i.startsWith('@'))
export const coreFunctions = functions.filter(i => i.category && !i.category?.startsWith('@'))
