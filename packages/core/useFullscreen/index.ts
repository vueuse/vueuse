/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { MaybeRef } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

/**
 * Reactive Fullscreen API.
 *
 * @see   {@link https://vueuse.js.org/useFullscreen}
 * @param target
 * @param options
 */
export function useFullscreen(
  target?: MaybeRef<Element | null | undefined>,
  options: ConfigurableDocument = {},
) {
  const { document = defaultDocument } = options
  const targetRef = ref(target || document?.querySelector('html'))
  const isFullscreen = ref(false)

  async function exit() {
    if (document?.fullscreenElement)
      await document.exitFullscreen()

    isFullscreen.value = false
  }

  async function enter() {
    exit()

    if (targetRef.value) {
      await targetRef.value.requestFullscreen()
      isFullscreen.value = true
    }
  }

  async function toggle() {
    if (isFullscreen.value)
      await exit()
    else
      await enter()
  }

  return {
    isFullscreen,
    enter,
    exit,
    toggle,
  }
}
