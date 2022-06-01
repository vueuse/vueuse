import type { EventHookOn } from '@vueuse/shared'
import { createEventHook } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'

export interface UseRetryOptions {
  /**
   * Max retries
   * `0` means no retries
   *
   * @default 3
   */
  maxRetries?: number

  /**
   * Interval for retry number of millisecond
   * `0` means use browser default
   *
   * @default 100
   */
  interval?: number

  /**
   * Timeout for abort retry after number of millisecond
   * `0` means use browser default
   *
   * @default 1000
   */
  timeout?: number
}

export interface UseRetryReturn<T> {
  /**
   * Indicates if the retry has finished
   */
  isFinished: Ref<boolean>

  /**
   * Fires after the retry has finished
   */
  onFinish: EventHookOn<T>

  // TODO @Shinigami92 2022-06-01: Add retry readonly ref

  // TODO @Shinigami92 2022-06-01: Add loading (?)
}

export function useRetry<T>(
  source: () => T,
  cb: (result: T) => boolean | PromiseLike<boolean>,
  options: UseRetryOptions = {},
): UseRetryReturn<T> {
  const { maxRetries = 3, interval = 100, timeout = 1000 } = options

  // Event Hooks
  const finishEvent = createEventHook<T>()

  const isFinished = ref(false)

  // TODO @Shinigami92 2022-06-01: Support abort

  let retries = 0

  const startedAt = Date.now()

  const execute = async (): Promise<void> => {
    return new Promise<T>((resolve, reject) => {
      const returnValue = source()
      return Promise.resolve(cb(returnValue))
        .then((fulfilled) => {
          if (fulfilled)
            resolve(returnValue)
          else
            reject(returnValue)
        })
    })
      .then((returnValue) => {
        finishEvent.trigger(returnValue)
        isFinished.value = true
      })
      .catch((returnValue) => {
        const now = Date.now()
        const elapsed = now - startedAt
        if (retries < maxRetries && elapsed < timeout) {
          retries++
          setTimeout(execute, interval)
        }
        else {
          finishEvent.trigger(returnValue)
          isFinished.value = true
        }
      })
  }

  execute()

  const shell: UseRetryReturn<T> = {
    isFinished,

    onFinish: finishEvent.on,
  }

  return {
    ...shell,
  }
}
