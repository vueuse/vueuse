import type { Awaitable, Pausable, UseTimeoutFnOptions } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import { isClient, tryOnScopeDispose, useTimeoutFn } from '@vueuse/shared'
import { shallowRef } from 'vue'

export interface UseTimeoutPollOptions {
  /**
   * Start the timer immediately
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

export function useTimeoutPoll(
  fn: () => Awaitable<void>,
  interval: MaybeRefOrGetter<number>,
  options: UseTimeoutFnOptions = {},
): Pausable {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  const { start, stop } = useTimeoutFn(loop, interval, { immediate: false })

  const isActive = shallowRef(false)
  let runId = 0

  async function loop() {
    if (!isActive.value)
      return

    const currentRunId = runId
    try {
      await fn()
    }
    finally {
      if (isActive.value && currentRunId === runId)
        start()
    }
  }

  function resume() {
    if (!isActive.value) {
      isActive.value = true
      runId++
      if (immediateCallback)
        void loop()
      else
        start()
    }
  }

  function pause() {
    isActive.value = false
    runId++
    stop()
  }

  if (immediate && isClient)
    resume()

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
