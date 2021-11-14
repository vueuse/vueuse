import { ref, Ref } from 'vue-demi'
import { noop } from '@vueuse/shared'

type Task = (...args: any[]) => Promise<unknown>

export interface UseAsyncQueueResult<T> {
  state: 'pending' | 'fulfilled' | 'rejected'
  data: T | null
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

export function useAsyncQueue<T>(tasks: Task[], options: UseAsyncQueueOptions = {}) {
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
  const result: Ref<UseAsyncQueueResult<T>[]> = ref(initialResult)

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
    result.value[activeIndex.value].data = res as T
    result.value[activeIndex.value].state = state
  }

  tasks.reduce((prevPromise: ReturnType<Task>, curPromise: Task) => {
    return prevPromise.then((prevRes) => {
      if (result.value[activeIndex.value]?.state === promiseState.rejected && interrupt) {
        onFinished()
        return
      }

      return curPromise(prevRes).then((currentRes) => {
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

export type UseAsyncQueueReturn = ReturnType<typeof useAsyncQueue>
