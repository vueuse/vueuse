import type { Ref } from 'vue'
import type { ConfigurableFlushSync } from '../utils'
import type { WatchPausableReturn } from '../watchPausable'
import { pausableWatch } from '../watchPausable'

type Direction = 'ltr' | 'rtl' | 'both'
type SpecificFieldPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>
/**
 * A = B
 */
type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false

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

// L = R
interface EqualType<
  D extends Direction,
  L,
  R,
  O extends keyof Transform<L, R> = D extends 'both' ? 'ltr' | 'rtl' : D,
> {
  transform?: SpecificFieldPartial<Pick<Transform<L, R>, O>, O>
}

type StrictIncludeMap<IncludeType extends 'LR' | 'RL', D extends Exclude<Direction, 'both'>, L, R> = (Equal<[IncludeType, D], ['LR', 'ltr']>
  & Equal<[IncludeType, D], ['RL', 'rtl']>) extends true
  ? {
      transform?: SpecificFieldPartial<Pick<Transform<L, R>, D>, D>
    } : {
      transform: Pick<Transform<L, R>, D>
    }

// L ⊆ R
type StrictIncludeType<IncludeType extends 'LR' | 'RL', D extends Direction, L, R> = D extends 'both'
  ? {
      transform: SpecificFieldPartial<Transform<L, R>, IncludeType extends 'LR' ? 'ltr' : 'rtl'>
    }
  : D extends Exclude<Direction, 'both'>
    ? StrictIncludeMap<IncludeType, D, L, R>
    : never

// L ∩ R ≠ ∅
type IntersectButNotEqualType<D extends Direction, L, R> = D extends 'both'
  ? {
      transform: Transform<L, R>
    }
  : D extends Exclude<Direction, 'both'>
    ? {
        transform: Pick<Transform<L, R>, D>
      }
    : never

// L ∩ R = ∅
type NotIntersectType<D extends Direction, L, R> = IntersectButNotEqualType<D, L, R>
interface Transform<L, R> {
  ltr: (left: L) => R
  rtl: (right: R) => L
}

type TransformType<D extends Direction, L, R> = Equal<L, R> extends true
  // L = R
  ? EqualType<D, L, R>
  : IncludeButNotEqual<L, R> extends true
    // L ⊆ R
    ? StrictIncludeType<'LR', D, L, R>
    : IncludeButNotEqual<R, L> extends true
      // R ⊆ L
      ? StrictIncludeType<'RL', D, L, R>
      : IntersectButNotEqual<L, R> extends true
        // L ∩ R ≠ ∅
        ? IntersectButNotEqualType<D, L, R>
        : NotIntersect<L, R> extends true
          // L ∩ R = ∅
          ? NotIntersectType<D, L, R>
          : never

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
} & TransformType<D, L, R>

/**
 * Two-way refs synchronization.
 * From the set theory perspective to restrict the option's type
 * Check in the following order:
 * 1. L = R
 * 2. L ∩ R ≠ ∅
 * 3. L ⊆ R
 * 4. L ∩ R = ∅
 */
export function syncRef<L, R, D extends Direction = 'both'>(
  left: Ref<L>,
  right: Ref<R>,
  ...[options]: Equal<L, R> extends true
    ? [options?: SyncRefOptions<L, R, D>]
    : [options: SyncRefOptions<L, R, D>]
) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    direction = 'both',
    transform = {},
  } = options || {}

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
