// #region imports
import type { Ref, WritableComputedRef } from 'vue'
import { computed, isProxy, isRef, toValue } from 'vue'
// #endregion

// #region types
type LensSelector<T> = {
  [K in keyof T]: T[K] extends object | any[] ? LensSelector<T[K]> : T[K];
} & {
  [index: number]: T extends any[] ? LensSelector<T[number]> : never
}

export interface UseLensOptions<P, R = P> {
  fallback?: P
  transform?: (value: P) => R
  onGet?: (value: P) => R
  onSet?: (value: R) => P
}
// #endregion

// #region helpers
function createPathProxy(callback: (proxy: any) => any): string[] {
  const path: string[] = []
  const proxy = new Proxy(
    {},
    {
      get: (_, prop) => {
        if (typeof prop === 'string') {
          path.push(String(prop))
        }
        return proxy
      },
    },
  )
  callback(proxy)
  return path
}

function isObject(value: unknown): value is Record<string | number, any> {
  return value != null && typeof value === 'object'
}

function getValueByPath<T, P>(obj: T, path: string[]): P | undefined {
  let current: any = toValue(obj)
  for (const key of path) {
    if (!isObject(current) || !(key in current))
      return undefined
    current = current[key]
  }
  return current as P
}

function setValueByPath<P>(obj: any, path: string[], value: P): void {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    const nextKey = path[i + 1]
    if (!isObject(current[key]))
      current[key] = /^\d+$/.test(nextKey) ? [] : {}
    current = current[key]
  }
  current[path[path.length - 1]] = value
}

const error = {
  notRef: new Error('"source" must be a Ref or a reactive object.'),
  notPath: new Error('Selector must specify a valid path.'),
}
// #endregion

// #region overload
/**
 * Creates a reactive lens to access and modify nested properties with a fallback.
 * @template T - The type of the source object or Ref.
 * @template P - The type of the property accessed by the selector.
 * @param source - The reactive source (Ref or reactive object).
 * @param selector - A function selecting the nested property.
 * @param options - Requires a fallback value.
 * @returns A writable computed ref with the selected property value.
 */
export function useLens<T, P>(
  source: MaybeRef<T>,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P> & { fallback: P }
): WritableComputedRef<P>

/**
 * Creates a reactive lens with a transformation function.
 * @template T - The type of the source object or Ref.
 * @template P - The type of the property accessed by the selector.
 * @template R - The type of the transformed value.
 * @param source - The reactive source (Ref or reactive object).
 * @param selector - A function selecting the nested property.
 * @param options - Requires a transform function.
 * @returns A writable computed ref with the transformed value.
 */
export function useLens<T, P, R>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P, R> & { transform: (value: P) => R }
): WritableComputedRef<R>

/**
 * Creates a reactive lens with a getter transformation.
 * @template T - The type of the source object or Ref.
 * @template P - The type of the property accessed by the selector.
 * @template R - The type of the transformed value.
 * @param source - The reactive source (Ref or reactive object).
 * @param selector - A function selecting the nested property.
 * @param options - Requires an onGet function.
 * @returns A writable computed ref with the transformed value on get.
 */
export function useLens<T, P, R>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P, R> & { onGet: (value: P) => R }
): WritableComputedRef<R>

/**
 * Creates a reactive lens with a setter transformation.
 * @template T - The type of the source object or Ref.
 * @template P - The type of the property accessed by the selector.
 * @template R - The type of the transformed value.
 * @param source - The reactive source (Ref or reactive object).
 * @param selector - A function selecting the nested property.
 * @param options - Requires an onSet function.
 * @returns A writable computed ref with the transformed value on set.
 */
export function useLens<T, P, R>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options: LensOptions<P, R> & { onSet: (value: R) => P }
): WritableComputedRef<P>

/**
 * Creates a reactive lens to access and modify nested properties.
 * @template T - The type of the source object or Ref.
 * @template P - The type of the property accessed by the selector.
 * @param source - The reactive source (Ref or reactive object).
 * @param selector - A function selecting the nested property.
 * @param options - Optional configuration.
 * @returns A writable computed ref with the selected property value or undefined.
 */
export function useLens<T, P>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options?: LensOptions<P>
): WritableComputedRef<P | undefined>
// #endregion

// #region release
/**
 * Implementation of useLens. See overloads for detailed documentation.
 * @template T, P, R
 * @param source
 * @param selector
 * @param options
 * @return {WritableComputedRef<P | R | undefined>}
 */
export function useLens<T, P, R = P>(
  source: Ref<T> | T,
  selector: (lens: LensSelector<T>) => P,
  options?: LensOptions<P, R>,
): WritableComputedRef<P | R | undefined> {
  if (!isRef(source) && !isProxy(source))
    throw error.notRef
  const path = createPathProxy(selector)
  if (!path.length)
    throw error.notPath

  return computed({
    get: () => {
      const value = toValue(source)
      const rawValue = getValueByPath<T, P>(value, path) ?? options?.fallback
      let result: P | R | undefined = rawValue as P | undefined
      if (options?.transform && result !== undefined)
        result = options.transform(result)
      if (options?.onGet && result !== undefined)
        result = options.onGet(result as P)
      return result
    },
    set: (newValue: R | P | undefined) => {
      let valueToSet: R | P | undefined = newValue
      if (options?.transform && valueToSet !== undefined)
        valueToSet = options.transform(valueToSet as P)
      if (options?.onSet && valueToSet !== undefined)
        valueToSet = options.onSet(valueToSet as R)
      if (valueToSet !== undefined)
        setValueByPath(toValue(source), path, valueToSet as P)
    },
  })
}
// #endregion
