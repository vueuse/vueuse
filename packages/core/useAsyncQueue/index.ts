import { noop } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { reactive, ref } from 'vue-demi'

export type UseAsyncQueueTask<T> = (...args: any[]) => T | Promise<T>

export interface UseAsyncQueueResult<T> {
  state: 'aborted' | 'fulfilled' | 'pending' | 'rejected'
  data: T | null
}

export interface UseAsyncQueueReturn<T> {
  activeIndex: Ref<number>
  result: T
}

export interface UseAsyncQueueOptions {
  /**
   * Interrupt tasks when current task fails.
   *
   * @default true
   */
  interrupt?: boolean

  /**
   * Trigger it when the tasks fails.
   *
   */
  onError?: () => void

  /**
   * Trigger it when the tasks ends.
   *
   */
  onFinished?: () => void

  /**
   * A AbortSignal that can be used to abort the task.
   */
  signal?: AbortSignal
}

/**
 * Asynchronous queue task controller.
 *
 * @see https://vueuse.org/useAsyncQueue
 * @param tasks
 * @param options
 */
export function useAsyncQueue<T1>(tasks: [UseAsyncQueueTask<T1>], options?: UseAsyncQueueOptions): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>]>
export function useAsyncQueue<T1, T2>(tasks: [UseAsyncQueueTask<T1>, UseAsyncQueueTask<T2>], options?: UseAsyncQueueOptions): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>, UseAsyncQueueResult<T2>]>
export function useAsyncQueue<T1, T2, T3>(tasks: [UseAsyncQueueTask<T1>, UseAsyncQueueTask<T2>, UseAsyncQueueTask<T3>], options?: UseAsyncQueueOptions): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>, UseAsyncQueueResult<T2>, UseAsyncQueueResult<T3>]>
export function useAsyncQueue<T1, T2, T3, T4>(tasks: [UseAsyncQueueTask<T1>, UseAsyncQueueTask<T2>, UseAsyncQueueTask<T3>, UseAsyncQueueTask<T4>], options?: UseAsyncQueueOptions): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>, UseAsyncQueueResult<T2>, UseAsyncQueueResult<T3>, UseAsyncQueueResult<T4>]>
export function useAsyncQueue<T1, T2, T3, T4, T5>(tasks: [UseAsyncQueueTask<T1>, UseAsyncQueueTask<T2>, UseAsyncQueueTask<T3>, UseAsyncQueueTask<T4>, UseAsyncQueueTask<T5>], options?: UseAsyncQueueOptions): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>, UseAsyncQueueResult<T2>, UseAsyncQueueResult<T3>, UseAsyncQueueResult<T4>, UseAsyncQueueResult<T5>]>
export function useAsyncQueue<T>(tasks: UseAsyncQueueTask<T>[], options?: UseAsyncQueueOptions): UseAsyncQueueReturn<UseAsyncQueueResult<T>[]>
export function useAsyncQueue<T = any>(tasks: UseAsyncQueueTask<any>[], options: UseAsyncQueueOptions = {}): UseAsyncQueueReturn<UseAsyncQueueResult<T>[]> {
  const {
    interrupt = true,
    onError = noop,
    onFinished = noop,
    signal,
  } = options

  const promiseState: Record<
    UseAsyncQueueResult<T>['state'],
    UseAsyncQueueResult<T>['state']
  > = {
    aborted: 'aborted',
    fulfilled: 'fulfilled',
    pending: 'pending',
    rejected: 'rejected',
  }

  const initialResult = Array.from(new Array(tasks.length), () => ({ state: promiseState.pending, data: null }))

  const result = reactive(initialResult) as UseAsyncQueueResult<T>[]

  const activeIndex = ref<number>(-1)

  if (!tasks || tasks.length === 0) {
    onFinished()
    return {
      activeIndex,
      result,
    }
  }

  function updateResult(state: UseAsyncQueueResult<T>['state'], res: unknown) {
    activeIndex.value++
    result[activeIndex.value].data = res as T
    result[activeIndex.value].state = state
  }

  tasks.reduce((prev, curr) => {
    return prev
      .then((prevRes) => {
        if (signal?.aborted) {
          updateResult(promiseState.aborted, new Error('aborted'))
          return
        }

        if (
          result[activeIndex.value]?.state === promiseState.rejected
          && interrupt
        ) {
          onFinished()
          return
        }

        const done = curr(prevRes).then((currentRes: any) => {
          updateResult(promiseState.fulfilled, currentRes)
          activeIndex.value === tasks.length - 1 && onFinished()
          return currentRes
        })

        if (!signal)
          return done

        return Promise.race([done, whenAborted(signal)])
      })
      .catch((e) => {
        if (signal?.aborted) {
          updateResult(promiseState.aborted, e)
          return e
        }

        updateResult(promiseState.rejected, e)
        onError()
        return e
      })
  }, Promise.resolve())

  return {
    activeIndex,
    result,
  }
}

function whenAborted(signal: AbortSignal): Promise<never> {
  return new Promise((resolve, reject) => {
    const error = new Error('aborted')

    if (signal.aborted)
      reject(error)
    else
      signal.addEventListener('abort', () => reject(error), { once: true })
  })
}
