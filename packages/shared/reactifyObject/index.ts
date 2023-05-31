import type { Reactified, ReactifyOptions } from '../reactify'
import { reactify } from '../reactify'
import type { AnyFn } from '../utils'

export type ReactifyNested<T, Keys extends keyof T = keyof T, S extends boolean = true> = { [K in Keys]: T[K] extends AnyFn ? Reactified<T[K], S> : T[K] }

export interface ReactifyObjectOptions<T extends boolean> extends ReactifyOptions<T> {
  /**
   * Includes names from Object.getOwnPropertyNames
   *
   * @default true
   */
  includeOwnProperties?: boolean
}

/**
 * Apply `reactify` to an object
 */
export function reactifyObject<T extends object, Keys extends keyof T>(obj: T, keys?: (keyof T)[]): ReactifyNested<T, Keys, true>
export function reactifyObject<T extends object, S extends boolean = true>(obj: T, options?: ReactifyObjectOptions<S>): ReactifyNested<T, keyof T, S>

export function reactifyObject<T extends object, S extends boolean = true>(obj: T, optionsOrKeys: ReactifyObjectOptions<S> | (keyof T)[] = {}): ReactifyNested<T, keyof T, S> {
  let keys: string[] = []
  let options: ReactifyOptions<S> | undefined
  if (Array.isArray(optionsOrKeys)) {
    keys = optionsOrKeys as string[]
  }
  else {
    options = optionsOrKeys
    const { includeOwnProperties = true } = optionsOrKeys

    keys.push(...Object.keys(obj))
    if (includeOwnProperties)
      keys.push(...Object.getOwnPropertyNames(obj))
  }

  return Object.fromEntries(
    keys
      .map((key) => {
        const value = obj[key as keyof T]
        return [
          key,
          typeof value === 'function'
            ? reactify(value.bind(obj), options)
            : value,
        ]
      }),
  ) as ReactifyNested<T, keyof T, S>
}
