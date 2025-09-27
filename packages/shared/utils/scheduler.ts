import type { MaybeRefOrGetter } from 'vue'
import type { AnyFn, Pausable } from './types'

export interface SchedulerOptions {
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

export type IntervalScheduler = (
  cb: AnyFn,
  interval?: MaybeRefOrGetter<number>,
  options?: SchedulerOptions
) => Pausable

export type ConfigurableSchedulerImmediate = SchedulerOptions & ({
  /**
   * Custom scheduler to use for interval execution.
   *
   * @default useIntervalFn
   */
  scheduler?: IntervalScheduler
  /**
   * Interval duration in milliseconds.
   *
   * @default 1000
   */
  interval?: MaybeRefOrGetter<number>
})

export type ConfigurableScheduler = ConfigurableSchedulerImmediate & {
  /**
   * Start the interval immediately
   *
   * @default false
   */
  immediate?: boolean
}
