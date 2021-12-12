export interface SSRContextMap {
  getStorage: (key: string) => Promise<void>
  setStorage: (key: string, value: any) => Promise<void>
  updateHTMLAttrs: (attrs: any) => void
  updateBodyAttrs: (attrs: any) => void
}

const context: Partial<SSRContextMap> = {}

export function getSSRContext<T extends keyof SSRContextMap>(key: T, fallback: SSRContextMap[T]): SSRContextMap[T]
export function getSSRContext<T extends keyof SSRContextMap>(key: T, fallback: SSRContextMap[T] | undefined): SSRContextMap[T] | undefined
export function getSSRContext<T extends keyof SSRContextMap>(key: T, fallback?: SSRContextMap[T]): SSRContextMap[T] | undefined {
  return context[key] as SSRContextMap[T] || fallback
}

export function setSSRContext<T extends keyof SSRContextMap>(key: T, fn: SSRContextMap[T]) {
  context[key] = fn
}
