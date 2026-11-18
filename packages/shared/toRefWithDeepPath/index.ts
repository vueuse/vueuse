import type { MaybeRefOrGetter, Ref, WritableComputedRef } from 'vue'
import type { AnyFn } from '../utils/types'
import { computed, toValue } from 'vue'

/**
 * Longest path the types accept.
 * `Prev` has to stay longer than this value.
 */
type MaxDepth = 6

/** `Prev[D]` is `D - 1`. Index `0` is `never` and stops the walk. */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

/**
 * Keys of `T` that hold data.
 * Array paths use numeric indexes. Methods are left out, so a path cannot end on `toString` or a function field.
 */
type DataKey<T> = [T] extends [never]
  ? never
  : [T] extends [readonly unknown[]]
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

/**
 * Value reached by walking `P` from `S`.
 * `D` is how many keys are still allowed. An empty `P` is `S` itself.
 */
type At<S, P extends readonly PropertyKey[] = [], D extends number = MaxDepth>
  = P extends readonly []
    ? SourceOf<S>
    : [D] extends [0 | never]
        ? never
        : P extends readonly [infer K extends PropertyKey, ...infer R extends readonly PropertyKey[]]
          ? K extends keyof SourceOf<S>
            ? At<ChildAt<SourceOf<S>, K>, R, Prev[D]>
            : never
          : never

/**
 * `P` when every key exists and the walk stays within `D`.
 * Otherwise the keys that were legal at the first mismatch, or a depth error.
 */
type ValidPath<S, P extends readonly PropertyKey[], D extends number = MaxDepth>
  = P extends readonly []
    ? never
    : [D] extends [0 | never]
        ? `A path can have at most ${MaxDepth} keys`
        : P extends readonly [infer K extends PropertyKey, ...infer R extends readonly PropertyKey[]]
          ? K extends DataKey<SourceOf<S>>
            ? R extends readonly []
              ? readonly [K]
              : ValidPath<At<S, readonly [K], D>, R, Prev[D]> extends infer Next
                ? [Next] extends [readonly PropertyKey[]]
                    ? readonly [K, ...Next]
                    : Next
                : never
            : readonly [DataKey<SourceOf<S>>]
          : never

/**
 * Value type at `P`.
 * A `null` or `undefined` segment along the way adds `undefined`, because a read stops there.
 */
type PathValue<T, P extends readonly PropertyKey[], D extends number = MaxDepth>
  = P extends readonly []
    ? T
    : [D] extends [0 | never]
        ? never
        : P extends readonly [infer K extends PropertyKey, ...infer R extends readonly PropertyKey[]]
          ? K extends keyof T
            ? R extends readonly []
              ? T[K]
              : Exclude<T[K], null | undefined> extends infer C
                ? [C] extends [object]
                    ? undefined extends T[K]
                      ? PathValue<C, R, Prev[D]> | undefined
                      : null extends T[K]
                        ? PathValue<C, R, Prev[D]> | undefined
                        : PathValue<C, R, Prev[D]>
                    : undefined
                : undefined
            : undefined
          : undefined

type CheckedPath<S, P extends readonly PropertyKey[]> = [P] extends [ValidPath<S, P>] ? P : ValidPath<S, P>

/**
 * Writable ref synced with a nested property of a reactive object, a ref, or a getter.
 *
 * The path is a tuple of up to `MaxDepth` keys. A call-site array literal is inferred as a tuple.
 * A widened `string[]` is rejected.
 *
 * @see https://vueuse.org/shared/toRefWithDeepPath/
 */
export function toRefWithDeepPath<
  S extends MaybeRefOrGetter<object>,
  const P extends readonly PropertyKey[],
>(
  source: S,
  path: CheckedPath<S, P>,
): WritableComputedRef<PathValue<SourceOf<S>, P>> {
  return computed({
    get() {
      return readPath(readRoot(source), path)
    },
    set(value) {
      writePath(readRoot(source), path, value)
    },
  }) as WritableComputedRef<PathValue<SourceOf<S>, P>>
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
