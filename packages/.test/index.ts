import process from 'node:process'
import './polyfillFetch'

export const isBelowNode18 = Number(process.version.slice(1).split('.')[0]) < 18

export * from './mount'
export * from './retry'
export * from './nextTick'
