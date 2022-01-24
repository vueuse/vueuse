import type { Awaitable } from '@vueuse/shared'
import globalThis from 'globalthis'

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

/**
 * @expiremental The API is not finalized yet. It might not follow semver.
 */
export interface SSRHandlersMap {
  getDefaultStorage: () => StorageLike | undefined
  getDefaultStorageAsync: () => StorageLikeAsync | undefined
  updateHTMLAttrs: (selector: string, attribute: string, value: string) => void
}

const globalKey = '__vueuse_ssr_handlers__'
// @ts-expect-error inject global
globalThis[globalKey] = globalThis[globalKey] || {}
// @ts-expect-error inject global
const handlers: Partial<SSRHandlersMap> = globalThis[globalKey]

export function getSSRHandler<T extends keyof SSRHandlersMap>(key: T, fallback: SSRHandlersMap[T]): SSRHandlersMap[T]
export function getSSRHandler<T extends keyof SSRHandlersMap>(key: T, fallback: SSRHandlersMap[T] | undefined): SSRHandlersMap[T] | undefined
export function getSSRHandler<T extends keyof SSRHandlersMap>(key: T, fallback?: SSRHandlersMap[T]): SSRHandlersMap[T] | undefined {
  return handlers[key] as SSRHandlersMap[T] || fallback
}

export function setSSRHandler<T extends keyof SSRHandlersMap>(key: T, fn: SSRHandlersMap[T]) {
  handlers[key] = fn
}
