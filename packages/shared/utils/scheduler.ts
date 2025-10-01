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

export type ConfigurableScheduler = SchedulerOptions & ({
  /**
   * Custom scheduler to use for interval execution.
   *
   * @default useIntervalFn
   */
  scheduler?: Scheduler
})

export type ConfigurableSchedulerLazy = ConfigurableScheduler & {
  /**
   * Start the interval immediately
   *
   * @default false
   */
  immediate?: boolean
}
