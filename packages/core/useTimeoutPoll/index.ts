import type { Awaitable, MaybeRefOrGetter, Pausable, UseTimeoutFnOptions } from '@vueuse/shared'
import { isClient, tryOnScopeDispose, useTimeoutFn } from '@vueuse/shared'
import { ref } from 'vue'

export interface UseTimeoutPollOptions {
  /**
   * Start the timer immediate
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

  const isActive = ref(false)

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
