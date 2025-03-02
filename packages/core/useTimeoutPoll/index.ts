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

  const { start } = useTimeoutFn(loop, interval, { immediate })

  const isActive = shallowRef(false)

  async function loop() {
    if (!isActive.value)
      return

    await fn()
    start()
  }

  function resume() {
    if (!isActive.value) {
      isActive.value = true
      if (immediateCallback)
        fn()
      start()
    }
  }

  function pause() {
    isActive.value = false
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
