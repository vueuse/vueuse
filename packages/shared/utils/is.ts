/* eslint-disable antfu/top-level-function */
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'
export const isWorker = typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const notNullish = <T = any>(val?: T | null | undefined): val is T => val != null
export const assert = (condition: boolean, ...infos: any[]) => {
  if (!condition)
    console.warn(...infos)
}
const toString = Object.prototype.toString
export const isObject = (val: any): val is object =>
  toString.call(val) === '[object Object]'
export const now = () => Date.now()
export const timestamp = () => +Date.now()
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
export const noop = () => {}
export const rand = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export const hasOwn = <T extends object, K extends keyof T>(val: T, key: K): key is K => Object.prototype.hasOwnProperty.call(val, key)

export const isIOS = /* #__PURE__ */ getIsIOS()

function getIsIOS() {
  return isClient && window?.navigator?.userAgent && (
    (/iP(?:ad|hone|od)/.test(window.navigator.userAgent))
    // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
    // https://github.com/vueuse/vueuse/issues/3577
    || (window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent))
  )
}
