import type { Ref } from 'vue-demi'
import { reactive, ref } from 'vue-demi'
import { noop } from '@vueuse/shared'

export type UseAsyncQueueTask<T> = (...args: any[]) => T | Promise<T>

export interface UseAsyncQueueResult<T> {
  state: 'pending' | 'fulfilled' | 'rejected'
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
  } = options

  const promiseState: Record<UseAsyncQueueResult<T>['state'], UseAsyncQueueResult<T>['state']> = {
    pending: 'pending',
    rejected: 'rejected',
    fulfilled: 'fulfilled',
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
    return prev.then((prevRes) => {
      if (result[activeIndex.value]?.state === promiseState.rejected && interrupt) {
        onFinished()
        return
      }

      return curr(prevRes).then((currentRes: any) => {
        updateResult(promiseState.fulfilled, currentRes)
        activeIndex.value === tasks.length - 1 && onFinished()
        return currentRes
      })
    }).catch((e) => {
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
