export const isClient = typeof window !== 'undefined'
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const assert = (condition: boolean, ...infos: any[]) => {
  // eslint-disable-next-line no-console
  if (!condition) console.warn(...infos)
}
const toString = Object.prototype.toString
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
export const isNumber = (val: any): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isObject = (val: any): val is object =>
  toString.call(val) === '[object Object]'
export const isWindow = (val: any): val is Window =>
  typeof window !== 'undefined' && toString.call(val) === '[object Window]'
export const now = () => Date.now()
export const timestamp = () => +Date.now()
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
export const noop = () => { }
export const rand = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const windows = [
  // Windows (iTunes)
  /microsoft (windows) (vista|xp)/i,
  // Windows RT
  /(windows) nt 6\.2; (arm)/i,
  /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
  /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i,
]

const macos = [
  /(mac os x) ?([\w\. ]*)/i,
  /(macintosh|mac_powerpc\b)(?!.+haiku)/i, // Mac OS
]

export const isWindowsOS = (() => {
  if (!isClient)
    return false
  return windows.some(regex => regex.test(window.navigator.userAgent))
})()

export const isMacOS = (() => {
  if (!isClient)
    return false
  return macos.some(regex => regex.test(window.navigator.userAgent))
})()
