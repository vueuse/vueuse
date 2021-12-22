import type { Awaitable } from '@vueuse/shared'

export interface StorageLikeAsync {
  getItem(key: string): Awaitable<string | null>
  setItem(key: string, value: string): Awaitable<void>
  removeItem(key: string): Awaitable<void>
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface SSRContextMap {
  getDefaultStorage: () => StorageLike | undefined
  getDefaultStorageAsync: () => StorageLikeAsync | undefined
  updateHTMLAttrs: (selector: string, attribute: string, value: string) => void
}

const globalKey = '__vueuse_ssr_context__'
// @ts-expect-error
globalThis[globalKey] = globalThis[globalKey] || {}
// @ts-expect-error
const context: Partial<SSRContextMap> = globalThis[globalKey]

export function getSSRContext<T extends keyof SSRContextMap>(key: T, fallback: SSRContextMap[T]): SSRContextMap[T]
export function getSSRContext<T extends keyof SSRContextMap>(key: T, fallback: SSRContextMap[T] | undefined): SSRContextMap[T] | undefined
export function getSSRContext<T extends keyof SSRContextMap>(key: T, fallback?: SSRContextMap[T]): SSRContextMap[T] | undefined {
  return context[key] as SSRContextMap[T] || fallback
}

export function setSSRContext<T extends keyof SSRContextMap>(key: T, fn: SSRContextMap[T]) {
  context[key] = fn
}
