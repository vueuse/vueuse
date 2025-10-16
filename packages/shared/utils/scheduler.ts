import type { MaybeRefOrGetter } from 'vue'
import type { AnyFn, Pausable } from './types'

export interface SchedulerOptions {
  /**
   * Interval duration in milliseconds.
   *
   * @default 1000
   */
  interval?: MaybeRefOrGetter<number>

  /**
   * Start the scheduler immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Execute the callback immediately after calling `resume`
   *
   * @default false
   */
  immediateCallback?: boolean
}

export type Scheduler = (
  cb: AnyFn,
  options?: SchedulerOptions
) => Pausable

export interface ConfigurableScheduler extends SchedulerOptions {
  /**
   * Custom scheduler to use for interval execution.
   *
   * @default useIntervalFn
   */
  scheduler?: Scheduler
}

export type ConfigurableRafScheduler = ConfigurableScheduler & {
  /**
   * Custom scheduler to use for interval execution.
   *
   * @default useRafFn
   */
  scheduler?: Scheduler
}

export type ConfigurableSchedulerLazy = ConfigurableScheduler & {
  /**
   * Start the interval immediately
   *
   * @default false
   */
  immediate?: boolean
}

/**
 * DO NOT USE
 * @internal
 * @deprecated
 */
export type DEPRECATE_SCHEDULER_INTERVAL<T extends ConfigurableRafScheduler> = Omit<T, 'interval'> & {
  /** @deprecated The option `interval: 'requestAnimationFrame'` has been deprecated. Please use the `scheduler` option with`useRafFn` instead */
  interval: 'requestAnimationFrame'
}
