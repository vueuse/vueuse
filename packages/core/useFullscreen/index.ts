/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { MaybeRef } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

/**
 * Reactive Fullscreen API
 */
export function useFullscreen(
  target: MaybeRef<Element | null> = ref(document.querySelector('html')),
  options: ConfigurableDocument = {},
) {
  const { document = defaultDocument } = options
  const targetRef = ref(target)
  const isFullscreen = ref(false)

  async function exitFullscreen() {
    if (document && document.fullscreenElement)
      await document.exitFullscreen()

    isFullscreen.value = false
  }

  async function enterFullscreen() {
    exitFullscreen()

    if (targetRef.value) {
      await targetRef.value.requestFullscreen()
      isFullscreen.value = true
    }
  }

  async function toggleFullscreen() {
    if (isFullscreen.value)
      await exitFullscreen()
    else
      await enterFullscreen()
  }

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}
