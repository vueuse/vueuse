import type { ComputedRef, getCurrentInstance, MaybeRef, Ref, ShallowRef, WatchOptions, WatchSource } from 'vue'

/**
 * Keep export for compatibility
 * @deprecated Use `import type { MultiWatchSources } from 'vue'` instead
 */
export type { MultiWatchSources } from 'vue'

/**
 * Void function
 */
export type Fn = () => void

/**
 * Any function
 */
export type AnyFn = (...args: any[]) => any

/**
 * A ref that allow to set null or undefined
 */
export type RemovableRef<T> = Ref<T, T | null | undefined>

/**
 * Maybe it's a computed ref, or a readonly value, or a getter function
 */
export type ReadonlyRefOrGetter<T> = ComputedRef<T> | (() => T)

/**
 * Make all the nested attributes of an object or array to MaybeRef<T>
 *
 * Good for accepting options that will be wrapped with `reactive` or `ref`
 *
 * ```ts
 * UnwrapRef<DeepMaybeRef<T>> === T
 * ```
 */
export type DeepMaybeRef<T> = T extends Ref<infer V>
  ? MaybeRef<V>
  : T extends Array<any> | object
    ? { [K in keyof T]: DeepMaybeRef<T[K]> }
    : MaybeRef<T>

export type Arrayable<T> = T[] | T

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never

export type ShallowUnwrapRef<T> = T extends Ref<infer P> ? P : T

export type Awaitable<T> = Promise<T> | T

export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never

/**
 * Compatible with versions below TypeScript 4.5 Awaited
 */
export type Awaited<T>
  = T extends null | undefined ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
    : T extends object & { then: (onfulfilled: infer F, ...args: infer _) => any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
      ? F extends ((value: infer V, ...args: infer _) => any) // if the argument to `then` is callable, extracts the first argument
        ? Awaited<V> // recursively unwrap the value
        : never // the argument to `then` was not callable
      : T // non-object or non-thenable

export type Promisify<T> = Promise<Awaited<T>>

export type PromisifyFn<T extends AnyFn> = (...args: ArgumentsType<T>) => Promisify<ReturnType<T>>

export interface Pausable {
  /**
   * A ref indicate whether a pausable instance is active
   */
  readonly isActive: Readonly<ShallowRef<boolean>>

  /**
   * Temporary pause the effect from executing
   */
  pause: Fn

  /**
   * Resume the effects
   */
  resume: Fn
}

export interface Stoppable<StartFnArgs extends any[] = any[]> {
  /**
   * A ref indicate whether a stoppable instance is executing
   */
  readonly isPending: Readonly<Ref<boolean>>

  /**
   * Stop the effect from executing
   */
  stop: Fn

  /**
   * Start the effects
   */
  start: (...args: StartFnArgs) => void
}

export type WatchOptionFlush = WatchOptions['flush']

export interface ConfigurableFlush {
  /**
   * Timing for monitoring changes, refer to WatchOptions for more details
   *
   * @default 'pre'
   */
  flush?: WatchOptionFlush
}

export interface ConfigurableFlushSync {
  /**
   * Timing for monitoring changes, refer to WatchOptions for more details.
   * Unlike `watch()`, the default is set to `sync`
   *
   * @default 'sync'
   */
  flush?: WatchOptionFlush
}

export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}

export type Mutable<T> = { -readonly [P in keyof T]: T[P] }

// https://stackoverflow.com/questions/55541275/typescript-check-for-the-any-type
export type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N
/**
 * will return `true` if `T` is `any`, or `false` otherwise
 */
export type IsAny<T> = IfAny<T, true, false>

/**
 * Universal timer handle that works in both browser and Node.js environments
 */
export type TimerHandle = ReturnType<typeof setTimeout> | undefined

export type InstanceProxy = NonNullable<NonNullable<ReturnType<typeof getCurrentInstance>>['proxy']>
