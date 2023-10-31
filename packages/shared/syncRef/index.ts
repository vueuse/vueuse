import { type Ref } from 'vue-demi'
import type { ConfigurableFlushSync } from '../utils'
import type { WatchPausableReturn } from '../watchPausable'
import { pausableWatch } from '../watchPausable'

type Direction = 'ltr' | 'rtl' | 'both'
type SpecificFieldPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
/**
 * A = B
 */
type Equal<A, B> = A extends B ? (B extends A ? true : false) : false

/**
 * A ∩ B ≠ ∅
 */
type IntersectButNotEqual<A, B> = Equal<A, B> extends true
  ? false
  : A & B extends never
    ? false
    : true

/**
 * A ⊆ B
 */
type IncludeButNotEqual<A, B> = Equal<A, B> extends true
  ? false
  : A extends B
    ? true
    : false

/**
 * A ∩ B = ∅
 */
type NotIntersect<A, B> = Equal<A, B> extends true
  ? false
  : A & B extends never
    ? true
    : false

interface Transform<L, R> {
  ltr: (left: L) => R
  rtl: (right: R) => L
}

export type SyncRefOptions<L, R, D extends Direction> = ConfigurableFlushSync & {
  /**
   * Watch deeply
   *
   * @default false
   */
  deep?: boolean
  /**
   * Sync values immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Direction of syncing. Value will be redefined if you define syncConvertors
   *
   * @default 'both'
   */
  direction?: D

} & {
  /**
   * Custom transform function
   */
  both: Equal<L, R> extends true
    ? {
        transform?: SpecificFieldPartial<Transform<L, R>, 'ltr' | 'rtl'>
      }
    : IncludeButNotEqual<L, R> extends true
      ? {
          transform: SpecificFieldPartial<Transform<L, R>, 'ltr'>
        }
      : IncludeButNotEqual<R, L> extends true
        ? {
            transform: SpecificFieldPartial<Transform<L, R>, 'rtl'>
          }
        : IntersectButNotEqual<L, R> extends true
          ? {
              transform: Transform<L, R>
            }
          : NotIntersect<L, R> extends true
            ? {
                transform: Transform<L, R>
              }
            : never
  ltr: Equal<L, R> extends true
    ? {
        transform?: SpecificFieldPartial<Pick<Transform<L, R>, 'ltr'>, 'ltr'>
      }
    : IncludeButNotEqual<L, R> extends true
      ? {
          transform: SpecificFieldPartial<Pick<Transform<L, R>, 'ltr'>, 'ltr'>
        }
      : IncludeButNotEqual<R, L> extends true
        ? {
            transform: Pick<Transform<L, R>, 'ltr'>
          }
        : IntersectButNotEqual<L, R> extends true
          ? {
              transform: Pick<Transform<L, R>, 'ltr'>
            }
          : NotIntersect<L, R> extends true
            ? {
                transform: Pick<Transform<L, R>, 'ltr'>
              }
            : never
  rtl: Equal<L, R> extends true
    ? {
        transform?: SpecificFieldPartial<Pick<Transform<L, R>, 'rtl'>, 'rtl'>
      }
    : IncludeButNotEqual<L, R> extends true
      ? {
          transform: Pick<Transform<L, R>, 'rtl'>
        }
      : IncludeButNotEqual<R, L> extends true
        ? {
            transform: SpecificFieldPartial<Pick<Transform<L, R>, 'rtl'>, 'rtl'>
          }
        : IntersectButNotEqual<L, R> extends true
          ? {
              transform: Pick<Transform<L, R>, 'rtl'>
            }
          : NotIntersect<L, R> extends true
            ? {
                transform: Pick<Transform<L, R>, 'rtl'>
              }
            : never
}[D]

/**
 * Two-way refs synchronization.
 * From the set theory perspective to restrict the option's type
 * Check in the following order:
 * 1. A = B
 * 2. A ∩ B ≠ ∅
 * 3. A ⊆ B
 * 4. A ∩ B = ∅
 * @param left
 * @param right
 * @param args
 */
export function syncRef<L, R, D extends Direction = 'both'>(
  left: Ref<L>,
  right: Ref<R>,
  ...args: Equal<L, R> extends true
    ? [SyncRefOptions<L, R, D>?]
    : [SyncRefOptions<L, R, D>]
) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    direction = 'both',
    transform = {},
  } = args[0] || {}

  const watchers: WatchPausableReturn[] = []

  const transformLTR = ('ltr' in transform && transform.ltr) || (v => v)
  const transformRTL = ('rtl' in transform && transform.rtl) || (v => v)

  if (direction === 'both' || direction === 'ltr') {
    watchers.push(pausableWatch(
      left,
      (newValue) => {
        watchers.forEach(w => w.pause())
        right.value = transformLTR(newValue) as R
        watchers.forEach(w => w.resume())
      },
      { flush, deep, immediate },
    ))
  }

  if (direction === 'both' || direction === 'rtl') {
    watchers.push(pausableWatch(
      right,
      (newValue) => {
        watchers.forEach(w => w.pause())
        left.value = transformRTL(newValue) as L
        watchers.forEach(w => w.resume())
      },
      { flush, deep, immediate },
    ))
  }

  const stop = () => {
    watchers.forEach(w => w.stop())
  }

  return stop
}
