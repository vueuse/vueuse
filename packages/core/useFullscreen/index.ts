/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { Ref, ref } from 'vue-demi'

export function useFullscreen(
  target: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>,
) {
  const isFullscreen = ref(false)

  function exitFullscreen() {
    if (document.fullscreenElement)
      document.exitFullscreen()

    isFullscreen.value = false
  }

  function enterFullscreen() {
    exitFullscreen()

    if (target.value) {
      target.value.requestFullscreen().then(() => {
        isFullscreen.value = true
      })
    }
  }

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  }
}
