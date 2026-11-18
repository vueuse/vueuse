import type { MaybeRefOrGetter, Ref, WritableComputedRef } from 'vue'
import type { AnyFn } from '../utils/types'
import { computed, toValue } from 'vue'

/**
 * Keys of `T` that hold data.
 * Array paths use numeric indexes. Methods are left out, so a path cannot end on `toString` or a function field.
 */
type DataKey<T> = [T] extends [readonly unknown[]]
  ? number
  : [T] extends [object]
      ? {
          [K in keyof T]-?: [NonNullable<T[K]>] extends [AnyFn] ? never : K
        }[keyof T]
      : never

/** Object reached by `K`, after dropping `null` and `undefined`. `never` when that segment is not an object. */
type ChildAt<T, K extends PropertyKey> = [K] extends [keyof T]
  ? Exclude<T[K], null | undefined> extends infer C
    ? [C] extends [object]
        ? C
        : never
    : never
  : never

/**
 * Value type at `P`.
 * A `null` or `undefined` segment along the way adds `undefined`, because a read stops there.
 */
type PathValue<T, P extends readonly PropertyKey[]> = P extends readonly [infer K, ...infer R]
  ? K extends keyof T
    ? R extends readonly []
      ? T[K]
      : R extends readonly PropertyKey[]
        ? Exclude<T[K], null | undefined> extends infer C
          ? [C] extends [object]
              ? undefined extends T[K]
                ? PathValue<C, R> | undefined
                : null extends T[K]
                  ? PathValue<C, R> | undefined
                  : PathValue<C, R>
              : undefined
          : undefined
        : undefined
    : undefined
  : T

type UnwrapRoot<T> = T extends Ref<infer V>
  ? V extends object
    ? V
    : never
  : T extends object
    ? T
    : never

/** Object held by a ref, a getter, or the value itself. */
type SourceOf<S> = S extends AnyFn
  ? UnwrapRoot<ReturnType<S>>
  : UnwrapRoot<S>

type At<S, K1 extends PropertyKey, K2 extends PropertyKey = never, K3 extends PropertyKey = never, K4 extends PropertyKey = never, K5 extends PropertyKey = never>
  = [K2] extends [never]
    ? ChildAt<SourceOf<S>, K1>
    : [K3] extends [never]
        ? ChildAt<ChildAt<SourceOf<S>, K1>, K2>
        : [K4] extends [never]
            ? ChildAt<ChildAt<ChildAt<SourceOf<S>, K1>, K2>, K3>
            : [K5] extends [never]
                ? ChildAt<ChildAt<ChildAt<ChildAt<SourceOf<S>, K1>, K2>, K3>, K4>
                : ChildAt<ChildAt<ChildAt<ChildAt<ChildAt<SourceOf<S>, K1>, K2>, K3>, K4>, K5>

/**
 * Writable ref synced with a nested property of a reactive object, a ref, or a getter.
 *
 * The path is a tuple of up to 6 keys. A call-site array literal is inferred as a tuple.
 * A widened `string[]` is rejected.
 *
 * @see https://vueuse.org/shared/toRefWithDeepPath/
 */
export function toRefWithDeepPath<
  S extends MaybeRefOrGetter<object>,
  K1 extends DataKey<SourceOf<S>>,
>(
  source: S,
  path: readonly [K1],
): WritableComputedRef<PathValue<SourceOf<S>, [K1]>>
export function toRefWithDeepPath<
  S extends MaybeRefOrGetter<object>,
  K1 extends DataKey<SourceOf<S>>,
  K2 extends DataKey<At<S, K1>>,
>(
  source: S,
  path: readonly [K1, K2],
): WritableComputedRef<PathValue<SourceOf<S>, [K1, K2]>>
export function toRefWithDeepPath<
  S extends MaybeRefOrGetter<object>,
  K1 extends DataKey<SourceOf<S>>,
  K2 extends DataKey<At<S, K1>>,
  K3 extends DataKey<At<S, K1, K2>>,
>(
  source: S,
  path: readonly [K1, K2, K3],
): WritableComputedRef<PathValue<SourceOf<S>, [K1, K2, K3]>>
export function toRefWithDeepPath<
  S extends MaybeRefOrGetter<object>,
  K1 extends DataKey<SourceOf<S>>,
  K2 extends DataKey<At<S, K1>>,
  K3 extends DataKey<At<S, K1, K2>>,
  K4 extends DataKey<At<S, K1, K2, K3>>,
>(
  source: S,
  path: readonly [K1, K2, K3, K4],
): WritableComputedRef<PathValue<SourceOf<S>, [K1, K2, K3, K4]>>
export function toRefWithDeepPath<
  S extends MaybeRefOrGetter<object>,
  K1 extends DataKey<SourceOf<S>>,
  K2 extends DataKey<At<S, K1>>,
  K3 extends DataKey<At<S, K1, K2>>,
  K4 extends DataKey<At<S, K1, K2, K3>>,
  K5 extends DataKey<At<S, K1, K2, K3, K4>>,
>(
  source: S,
  path: readonly [K1, K2, K3, K4, K5],
): WritableComputedRef<PathValue<SourceOf<S>, [K1, K2, K3, K4, K5]>>
export function toRefWithDeepPath<
  S extends MaybeRefOrGetter<object>,
  K1 extends DataKey<SourceOf<S>>,
  K2 extends DataKey<At<S, K1>>,
  K3 extends DataKey<At<S, K1, K2>>,
  K4 extends DataKey<At<S, K1, K2, K3>>,
  K5 extends DataKey<At<S, K1, K2, K3, K4>>,
  K6 extends DataKey<At<S, K1, K2, K3, K4, K5>>,
>(
  source: S,
  path: readonly [K1, K2, K3, K4, K5, K6],
): WritableComputedRef<PathValue<SourceOf<S>, [K1, K2, K3, K4, K5, K6]>>
export function toRefWithDeepPath(
  source: MaybeRefOrGetter<object>,
  path: readonly PropertyKey[],
) {
  return computed({
    get() {
      return readPath(readRoot(source), path)
    },
    set(value) {
      writePath(readRoot(source), path, value)
    },
  })
}

function readRoot(source: MaybeRefOrGetter<object>): unknown {
  // A getter may itself return a ref. `toValue` only unwraps the value it is given.
  return toValue(toValue(source))
}

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return value !== null && (typeof value === 'object' || typeof value === 'function')
}

function readPath(root: unknown, path: readonly PropertyKey[]): unknown {
  let current = root
  for (const key of path) {
    if (!isRecord(current))
      return undefined
    current = current[key]
  }
  return current
}

function writePath(root: unknown, path: readonly PropertyKey[], value: unknown) {
  if (path.length === 0)
    throw new TypeError('[toRefWithDeepPath] Cannot set with an empty path.')

  if (!isRecord(root))
    throw new TypeError(`[toRefWithDeepPath] Cannot set through ${root === null ? 'null' : typeof root} at the source.`)

  let current: Record<PropertyKey, unknown> = root
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    const next = current[key]
    if (next == null) {
      if (next === null)
        throw new TypeError(`[toRefWithDeepPath] Cannot set through null at "${String(key)}".`)
      const created = typeof path[i + 1] === 'number' ? [] : {}
      current[key] = created
      current = created as Record<PropertyKey, unknown>
      continue
    }
    if (!isRecord(next))
      throw new TypeError(`[toRefWithDeepPath] Cannot set through ${typeof next} at "${String(key)}".`)
    current = next
  }

  const leaf = path[path.length - 1]
  current[leaf] = value
}
