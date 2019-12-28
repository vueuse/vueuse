import { Ref, ref } from '../api'

export function useFullscreen (target: Ref<HTMLElement> = ref(document.body)) {
  const isFullscreen = ref(false)

  function exitFullscreen () {
    if (document.fullscreenElement)
      document.exitFullscreen()

    isFullscreen.value = false
  }

  function enterFullscreen () {
    exitFullscreen()

    target.value.requestFullscreen().then(() => {
      isFullscreen.value = true
    })
  }

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  }
}
